import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import {
  createBussinessService,
  resetBussinessService,
  selectAddBussinessServiceError,
} from "../../../redux/slices/services/bussinessServices/BussinessSerives";

const BussinessServicesAddForm = () => {
  const dispatch = useDispatch();
  const isSuccess = useSelector((state) => state.businessService.isSuccess);
  const error = useSelector(selectAddBussinessServiceError);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const initialValues = {
    name: "",
    title: "",
    description: "",
    slug: "",
    image: null,
    logo: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .matches(/^[a-zA-Z0-9\s]+$/, "Name must contain only alphabets and numbers")
      .required("Name is required"),
    title: Yup.string()
      .min(2, "Title must be at least 2 characters")
      .max(50, "Title must be at most 50 characters")
      .matches(/^[a-zA-Z\s]+$/, "Title must contain only alph abets")
      .required("Title is required"),
    description: Yup.string()
      .max(500, "Description must be at most 500 characters")
      .required("Description is required"),
    slug: Yup.string()
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and can contain hyphens")
      .required("Slug is required"),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileFormat", "Only image files are supported", (value) => value && value.type.startsWith("image/"))
      .test("fileSize", "File size must be less than 5MB", (value) => value && value.size <= 5 * 1024 * 1024),
    logo: Yup.mixed()
      .required("Logo is required")
      .test("fileFormat", "Only image files are supported", (value) => value && value.type.startsWith("image/"))
      .test("fileSize", "File size must be less than 5MB", (value) => value && value.size <= 5 * 1024 * 1024),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("slug", values.slug);
    formData.append("image", values.image);
    formData.append("logo", values.logo);

    dispatch(createBussinessService({ formData, token: cookies.token }));
    setSubmitting(false);
  };

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies]);

  useEffect(() => {
    if (isSuccess) {
      setSnackbar({ open: true, message: "Business service created successfully!", severity: "success" });
      navigate("/Business-Services-control");
      dispatch(resetBussinessService());
    }
  }, [isSuccess]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
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
              Business Services Add Form
            </Typography>
            <br />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Slug"
                        variant="outlined"
                        name="slug"
                        value={values.slug}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.slug && errors.slug)}
                        helperText={touched.slug && errors.slug}
                      />
                    </Grid>
                <Grid item xs={12}>
                      <DropzoneArea
                        acceptedFiles={["image/*"]}
                        filesLimit={1}
                        dropzoneText="Drag and drop an image here or click Max 3MB only Uploads"
                        onChange={(fileArray) => setFieldValue("image", fileArray[0])}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage name="image" component="div" style={{ color: "red" }} />
                    </Grid>
                    <Grid item xs={12}>
                      <DropzoneArea
                        acceptedFiles={["image/*"]}
                        filesLimit={1}
                        dropzoneText="Drag and drop logo(icon) here or click"
                        onChange={(fileArray) => setFieldValue("logo", fileArray[0])}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage name="logo" component="div" style={{ color: "red" }} />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{ mt: 3 }}
                    style={{ background: "green" }}
                  >
                    Submit
                  </Button>
                </form>
              )}
            </Formik>
          </Paper>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      }
    />
  );
};

export default BussinessServicesAddForm;