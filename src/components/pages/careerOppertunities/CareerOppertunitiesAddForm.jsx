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
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import {  useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import {
  fetchCourse,
  selectCourses,
} from "../../redux/slices/course/course";
import {
  addCareerOpportunities,
  selectCareerOpportunitiesError,
} from "../../redux/slices/careerOppertunities/careerOppertunities";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

const validationSchema = Yup.object({
  company_name: Yup.string().required("Company name is required"),
  description: Yup.string().required("Description is required"),
  images: Yup.array().of(Yup.mixed()).min(1, "At least one image is required"),
  course: Yup.object().nullable().required("Course is required"),
});

const CareerOpportunitiesAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courses = useSelector(selectCourses);
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies, dispatch, navigate]);

  useEffect(() => {
    dispatch(fetchCourse());
  }, [dispatch]);

  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("company_name", values.company_name);
    formData.append("description", values.description);
    formData.append("image", values.images[0]);
    formData.append("course", values.course._id);

    dispatch(addCareerOpportunities({ formData, token: cookies.token }));
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
              Career Opportunities Add Form
            </Typography>
            <br />
            <Formik
              initialValues={{
                company_name: "",
                description: "",
                images: [],
                course: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
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
                        onChange={(files) => setFieldValue("images", files)}
                      />
                      {touched.images && errors.images && (
                        <Typography variant="body2" color="error">
                          {errors.images}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={Autocomplete}
                        options={courses || []}
                        getOptionLabel={(option) =>
                          option ? option.course_name : ""
                        }
                        value={values.course}
                        onChange={(event, newValue) => setFieldValue("course", newValue)}
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
                    Submit
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

export default CareerOpportunitiesAddForm;
