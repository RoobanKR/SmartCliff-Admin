import React, { useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Autocomplete,
  FormControl
} from "@mui/material";
import {
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
} from "@material-ui/core";

import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { fetchCourse, selectCourses } from "../../redux/slices/course/course";
import { fetchCategories, selectCategories } from "../../redux/slices/category/category";
import { createBatch } from "../../redux/slices/batch/batches";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

const validationSchema = Yup.object({
  branch: Yup.string().required("Branch is required"),
  batch_type: Yup.string().required("Batch type is required"),
  mode_of_type: Yup.string().required("Mode of training is required"),
  startDate: Yup.date().required("Start date is required"),
  duration: Yup.string().required("Duration is required"),
  contact: Yup.string()
    .matches(/^[0-9]+$/, "Contact must be numeric")
    .required("Contact is required"),
  course: Yup.object().nullable().required("Course is required"),
  category: Yup.object().nullable().required("Category is required"),
  image: Yup.mixed().required("Image is required"),
});

const BatchAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = useCookies(["token"])[0];
  const courses = useSelector(selectCourses);
  const categories = useSelector(selectCategories);

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
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("branch", values.branch);
    formData.append("batch_type", values.batch_type);
    formData.append("mode_of_type", values.mode_of_type);
    formData.append("start_date", values.startDate);
    formData.append("duration", values.duration);
    formData.append("contact", values.contact);
    formData.append("course", values.course._id);
    formData.append("category", values.category._id);
    formData.append("image", values.image);

    dispatch(createBatch({ token: cookies.token, formData }));

    setSubmitting(false);
    // navigate("/batch-control");
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
              Batch Add Form
            </Typography>
            <br />
            <Formik
              initialValues={{
                branch: "",
                mode_of_type: "",
                startDate: new Date().toISOString().split("T")[0],
                duration: "",
                contact: "",
                batch_type: "",
                course: null,
                category: null,
                image: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleSubmit,
                setFieldValue,
                isSubmitting,
                values,
              }) => (
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={Autocomplete}
                        name="category"
                        options={categories}
                        getOptionLabel={(option) => option.category_name}
                        value={values.category}
                        onChange={(event, newValue) => {
                          setFieldValue("category", newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Category"
                            fullWidth
                          />
                        )}
                      />
                      <ErrorMessage name="category" component="div" style={{ color: "red" }} />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={Autocomplete}
                        name="course"
                        options={courses.filter(
                          (course) => course.category._id === (values.category?._id || "")
                        )}
                        getOptionLabel={(option) => option.course_name || ""}
                        value={values.course}
                        onChange={(event, newValue) => {
                          setFieldValue("course", newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="Courses"
                            fullWidth
                          />
                        )}
                      />
                      <ErrorMessage name="course" component="div" style={{ color: "red" }} />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Branch (Location)"
                        variant="outlined"
                        name="branch"
                        required
                        value={values.branch}
                        onChange={(e) => setFieldValue("branch", e.target.value)}
                      />
                      <ErrorMessage name="branch" component="div" style={{ color: "red" }} />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">Mode of Training</FormLabel>
                        <RadioGroup
                          row
                          name="batch_type"
                          value={values.batch_type}
                          onChange={(e) => setFieldValue("batch_type", e.target.value)}
                        >
                          <FormControlLabel
                            value="online"
                            control={<Radio color="primary" />}
                            label="Online"
                          />
                          <FormControlLabel
                            value="offline"
                            control={<Radio color="primary" />}
                            label="Offline"
                          />
                        </RadioGroup>
                      </FormControl>
                      <ErrorMessage name="batch_type" component="div" style={{ color: "red" }} />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Mode Of Type"
                        variant="outlined"
                        name="mode_of_type"
                        rows={4}
                        value={values.mode_of_type}
                        onChange={(e) => setFieldValue("mode_of_type", e.target.value)}
                      />
                      <ErrorMessage name="mode_of_type" component="div" style={{ color: "red" }} />
                    </Grid>

                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        label="Start Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        name="startDate"
                        value={values.startDate}
                        onChange={(e) => setFieldValue("startDate", e.target.value)} 
                      />
                      <ErrorMessage name="startDate" component="div" style={{ color: "red" }} />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Duration"
                        variant="outlined"
                        rows={4}
                        name="duration"
                        value={values.duration}
                        onChange={(e) => setFieldValue("duration", e.target.value)}
                      />
                      <ErrorMessage name="duration" component="div" style={{ color: "red" }} />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Contact"
                        variant="outlined"
                        name="contact"
                        rows={4}
                        value={values.contact}
                        onChange={(e) => setFieldValue("contact", e.target.value)}
                      />
                      <ErrorMessage name="contact" component="div" style={{ color: "red" }} />
                    </Grid>

                    <Grid item xs={12}>
                      <DropzoneArea
                        onChange={(files) => setFieldValue("image", files[0])}
                        acceptedFiles={["image/*"]}
                        filesLimit={1}
                        showPreviews={false}
                        showPreviewsInDropzone
                        dropzoneText="Drag and drop an image here or click"
                      />
                      <ErrorMessage name="image" component="div" style={{ color: "red" }} />
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

export default BatchAddForm;
