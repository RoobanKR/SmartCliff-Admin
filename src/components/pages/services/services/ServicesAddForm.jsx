import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import {
  addService,
  resetService,
  selectAddServiceError,
} from "../../../redux/slices/services/services/Services";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ServicesAddForm = () => {
  const dispatch = useDispatch();
  const isSuccess = useSelector((state) => state.service.isSuccess);
  const error = useSelector(selectAddServiceError);
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);

  const initialValues = {
    title: "",
    slug: "",
    description: "",
    images: [],
    videos: [],
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Title must contain only alphabets")
      .required("Title is required"),
    slug: Yup.string()
      .matches(/^[a-z]+$/, "Slug must contain only lowercase letters")
      .matches(/^\S*$/, "No whitespace allowed")
      .required("Slug is required"),
    description: Yup.string().required("Description is required"),
    images: Yup.array()
      .min(1, "At least one image is required")
      .required("Image is required"),
    videos: Yup.array()
      .min(1, "At least one video is required")
      .required("Video is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("slug", values.slug);
    formData.append("description", values.description);
    values.images.forEach((image) => {
      formData.append("image", image);
    });
    values.videos.forEach((video) => {
      formData.append("videos", video);
    });
    dispatch(addService({ formData, token: cookies.token }));
    setSubmitting(false);
  };

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
      console.log("user verify called");
    }
  }, [cookies]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/Services-control");
      dispatch(resetService());
    }
    console.log("isSuccess", isSuccess);
  }, [isSuccess]);

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
              gutterBottom
              variant="h4"
              textAlign={"center"}
              component="div"
              fontFamily={"Serif"}
            >
              Services Add Form
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
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                  <Grid container spacing={2}>
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
                        error={Boolean(
                          touched.description && errors.description
                        )}
                        helperText={touched.description && errors.description}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DropzoneArea
                        acceptedFiles={["image/*"]}
                        filesLimit={5}
                        dropzoneText="Drag and drop image here or click"
                        onChange={(fileArray) =>
                          handleChange({
                            target: { name: "images", value: fileArray },
                          })
                        }
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="images"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <h5>Video uploads</h5>
                      <input
                        multiple
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "videos",
                              value: Array.from(e.target.files),
                            }, // Convert FileList to array
                          })
                        }
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="videos"
                        component="div"
                        style={{ color: "red" }}
                      />
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
        </Container>
      }
    />
  );
};

export default ServicesAddForm;
