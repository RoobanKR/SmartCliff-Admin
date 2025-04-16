import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, FormControl, Button } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { Autocomplete, Grid, TextField } from "@mui/material";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slices/category/category";
import { selectCategories } from "../../redux/slices/category/category";
import {
  addInstructor,
  resetInstructor,
  selectInstructorState,
} from "../../redux/slices/instructor/instructor";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
}));

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("description is required"),
  experience: Yup.number().min(0, "Experience cannot be negative").required("Experience is required"),
  qualification: Yup.string().required("Qualification is required"),
  specialization: Yup.string().required("Specialization is required"),
   category: Yup.array().min(1, "At least one category is required"),
  profile: Yup.array().min(1, "At least one image is required"),
});

const InstructorAddForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [images, setImages] = useState([]);
  const navigate = useNavigate(); // Add this line to get the navigation function
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!cookies.token) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies, dispatch, navigate]);

  const handleCategoryChange = (_, newValues) => {
    setSelectedCategories(newValues);
  };

  const initialValues = {
    name: "",
    description: "",
    experience: "",
    qualification: "",
    specialization: "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("description", values.description);
    formData.set("experience", values.experience);
    formData.set("qualification", values.qualification);
    formData.set("specialization", values.specialization);

    // Append selected categories
    const categoryString = selectedCategories
      .map((category) => category._id)
      .join(",");
    formData.append("category", categoryString);

    for (let i = 0; i < images.length; i++) {
      formData.append("profile", images[i]);
    }

    dispatch(addInstructor({ formData, token: cookies.token }));
    setSubmitting(false);
    navigate("/Instructor-control");
  };

  return (
    <LeftNavigationBar
      Content={
        <Box className={classes.formContainer}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className={classes.form}>
                <Typography
                  gutterBottom
                  variant="h4"
                  align="center"
                  component="div"
                  style={{ fontFamily: "Serif" }}
                >
                  Instructor Add Form
                </Typography>
                <br />

                <Field
                  as={TextField}
                  name="name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  required
                  className={classes.formControl}
                  error={!!errors.name && touched.name}
                  helperText={errors.name && touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  className={classes.formControl}
                  error={!!errors.description && touched.description}
                  helperText={errors.description && touched.description && errors.description}
                />
                <Field
                  as={TextField}
                  name="experience"
                  label="Experience"
                  variant="outlined"
                  fullWidth
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                  className={classes.formControl}
                  error={!!errors.experience && touched.experience}
                  helperText={errors.experience && touched.experience && errors.experience}
                />
                <Field
                  as={TextField}
                  name="qualification"
                  label="Qualification"
                  variant="outlined"
                  fullWidth
                  required
                  className={classes.formControl}
                  error={!!errors.qualification && touched.qualification}
                  helperText={errors.qualification && touched.qualification && errors.qualification}
                />
                <FormControl className={classes.formControl} fullWidth>
                  <Autocomplete
                    id="category"
                    options={categories}
                    getOptionLabel={(option) => option.category_name}
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Categories"
                        fullWidth
                      />
                    )}
                    multiple
                  />
                </FormControl>
                <Field
                  as={TextField}
                  name="specialization"
                  label="Specialization (comma-separated)"
                  variant="outlined"
                  fullWidth
                  required
                  className={classes.formControl}
                  error={!!errors.specialization && touched.specialization}
                  helperText={errors.specialization && touched.specialization && errors.specialization}
                />
                <Grid item xs={12}>
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    filesLimit={5}
                    dropzoneText="Drag and drop images here or click"
                    onChange={(fileArray) => setImages(fileArray)}
                    name="profile"
                  />
                </Grid>
                <br />
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "#4CAF50", color: "white" }}
                  fullWidth
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      }
    />
  );
};

export default InstructorAddForm;
