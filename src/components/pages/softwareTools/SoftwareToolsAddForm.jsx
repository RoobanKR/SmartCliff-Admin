import React, { useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { addSoftwareTools } from "../../redux/slices/softwareTools/softwareTools";
import {
  fetchCategories,
  selectCategories,
} from "../../redux/slices/category/category";
import { Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const SoftwareToolsAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const [cookies] = useCookies(["token"]);

  const validationSchema = Yup.object({
    softwareTools: Yup.string()
      .required("Software Tools name is required")
      .min(3, "Name should be at least 3 characters long"),
    description: Yup.string().required("Description is required"),
    categories: Yup.array().min(1, "At least one category must be selected"),
    images: Yup.array().min(1, "At least one image must be uploaded"),
  });

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await dispatch(
        addSoftwareTools({
          token: cookies.token,
          softwareTools: values.softwareTools,
          description: values.description,
          images: values.images,
          selectedCategories: values.categories,
        })
      );
      navigate(`/Software_Tools-control`);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }

    setSubmitting(false);
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
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: 'Merriweather, serif',
                fontWeight: 700, textAlign: 'center',
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 5,
                "&::before": {
                  content: '""',
                  width: "28px",
                  height: "5px",
                  display: "block",
                  position: "absolute",
                  bottom: "3px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#747474",
                },
                "&::after": {
                  content: '""',
                  width: "100px",
                  height: "1px",
                  display: "block",
                  position: "relative",
                  marginTop: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#747474",
                },
              }}
            >
              Software Tools Add Form
            </Typography>

            <Formik
              initialValues={{
                softwareTools: "",
                description: "",
                images: [],
                categories: [],
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        name="softwareTools"
                        as={TextField}
                        fullWidth
                        label="Software Tools Name"
                        variant="outlined"
                      />
                      <ErrorMessage
                        name="softwareTools"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="description"
                        as={TextField}
                        fullWidth
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={4}
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        id="categories"
                        options={categories}
                        getOptionLabel={(option) => option.category_name}
                        value={values.categories}
                        onChange={(e, newValues) =>
                          setFieldValue("categories", newValues)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Categories"
                            fullWidth
                          />
                        )}
                      />
                      <ErrorMessage
                        name="categories"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DropzoneArea
                        acceptedFiles={["image/*"]}
                        filesLimit={5}
                        dropzoneText="Drag and drop images here or click"
                        onChange={(fileArray) =>
                          setFieldValue("images", fileArray)
                        }
                      />
                      {values.images.length === 0 && (
                        <div style={{ color: "red" }}>
                          At least one image must be uploaded
                        </div>
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
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Container>
      }
    />
  );
};

export default SoftwareToolsAddForm;
