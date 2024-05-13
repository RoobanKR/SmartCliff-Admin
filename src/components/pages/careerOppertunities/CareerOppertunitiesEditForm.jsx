import React, { useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Autocomplete,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import {
  fetchCareerOpportunityById,
  updateCareerOpportunity,
} from "../../redux/slices/careerOppertunities/careerOppertunities";
import { fetchCourse, selectCourses } from "../../redux/slices/course/course";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

const validationSchema = Yup.object({
  company_name: Yup.string().required("Company Name is required"),
  description: Yup.string().required("Description is required"),
  course: Yup.object().nullable().required("Course is required"),
  newImages: Yup.array().min(1, "At least one image is required"),
});

const CareerOpportunitiesEditForm = () => {
  const { careeroppId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies, dispatch, navigate]);

  const { careerOpportunity } = useSelector(
    (state) => state.careerOpportunities
  );
  const courses = useSelector(selectCourses);

  const [existingImages, setExistingImages] = React.useState([]);

  useEffect(() => {
    dispatch(fetchCareerOpportunityById(careeroppId));
    dispatch(fetchCourse());

    if (careerOpportunity) {
      setExistingImages(careerOpportunity.image ? [careerOpportunity.image] : []);
    }
  }, [dispatch, careerOpportunity]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("company_name", values.company_name);
    formData.append("description", values.description);
    formData.append("course", values.course._id);

    if (values.newImages.length > 0) {
      for (const image of values.newImages) {
        formData.append("image", image);
      }
    } else {
      // Convert existing images to File objects
      for (const imageUrl of existingImages) {
        const fileNameWithTimestamp = imageUrl.split("/").pop();
        const fileNameWithoutTimestamp = fileNameWithTimestamp.replace(
          /^\d+_/,
          ""
        );
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const file = new File([arrayBuffer], fileNameWithoutTimestamp, {
          type: response.headers.get("content-type"),
        });

        formData.append("image", file);
      }
    }

    dispatch(
      updateCareerOpportunity({
        careeroppId,
        formData,
        token: cookies.token,
      })
    );

    setSubmitting(false);
    navigate(`/Career_Opportunities-control`);
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              gutterBottom
              variant="h4"
              textAlign={"center"}
              component="div"
              fontFamily={"Serif"}
            >
              Career Opportunities Edit Form
            </Typography>
            <br />
            <Formik
              initialValues={{
                company_name: careerOpportunity?.company_name || "",
                description: careerOpportunity?.description || "",
                course: careerOpportunity?.course || null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({
                handleSubmit,
                setFieldValue,
                isSubmitting,
                values,
                errors,
                touched,
              }) => (
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Company Name"
                        variant="outlined"
                        name="company_name"
                        value={values.company_name}
                        onChange={(e) => setFieldValue("company_name", e.target.value)}
                      />
                      {touched.company_name && errors.company_name && (
                        <Typography variant="body2" color="error">
                          {errors.company_name}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        name="description"
                        value={values.description}
                        onChange={(e) => setFieldValue("description", e.target.value)}
                      />
                      {touched.description && errors.description && (
                        <Typography variant="body2" color="error">
                          {errors.description}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <DropzoneArea
                        acceptedFiles={["image/*"]}
                        filesLimit={5}
                        dropzoneText="Drag and drop images here or click"
                        onChange={(files) => setFieldValue("newImages", files)}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ marginTop: "16px" }}
                      >
                        Existing Images:
                      </Typography>
                      {Array.isArray(existingImages) &&
                        existingImages.map((imageUrl, index) => {
                          const fileName = imageUrl.split("/").pop();
                          return (
                            <Typography key={index} style={{ marginLeft: "16px" }}>
                              {fileName}
                            </Typography>
                          );
                        })}
                    </Grid>

                    <Grid item xs={12}>
                      <Autocomplete
                        options={courses || []}
                        getOptionLabel={(option) =>
                          option ? option.course_name : ""
                        }
                        value={values.course}
                        onChange={(_, newValue) => setFieldValue("course", newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Courses"
                            fullWidth
                          />
                        )}
                      />
                      {touched.course && errors.course && (
                        <Typography variant="body2" color="error">
                          {errors.course}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="success"
                    sx={{ mt: 3 }}
                    disabled={isSubmitting}
                  >
                    Update
                  </Button>
                </form>
              )}
            </Formik>
          </Paper>
        </Container>
      }
    />
  );
};

export default CareerOpportunitiesEditForm;
