import React, { useEffect } from "react";
import {
  makeStyles,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Checkbox,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { Autocomplete } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  selectCategories,
} from "../../redux/slices/category/category";
import {
  fetchInstructors,
  selectInstructorState,
} from "../../redux/slices/instructor/instructor";
import {
  fetchSoftwareTools,
  selectSoftwareTools,
} from "../../redux/slices/softwareTools/softwareTools";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { createCourse } from "../../redux/slices/course/course";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  form: {
    width: "100%",
    maxWidth: 600,
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
  course_id: Yup.string().required("Course ID is required"),
  course_name: Yup.string().required("Course Name is required"),
  slug: Yup.string().required("Slug is required"),
  short_description: Yup.string().required("Short Description is required"),
  objective: Yup.string().required("Objective is required"),
  cost: Yup.number().min(0).required("Cost is required"),
  duration: Yup.number().min(0).required("Duration is required"),
  course_level: Yup.string().required("Course Level is required"),
  mode_of_trainee: Yup.string().required("Mode of Training is required"),
  certificate: Yup.boolean(),
  number_of_assesment: Yup.number().min(0).required("Number of Assessments is required"),
  projects: Yup.number().min(0).required("Number of Projects is required"),
  category: Yup.object().required("Category is required"),
  instructor: Yup.object().required("Instructor is required"),
  tool_software: Yup.object().required("Software Tool is required"),
  images: Yup.mixed().required("At least one image is required"),
});

const CourseAddForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);
  const softwareTools = useSelector(selectSoftwareTools);
  const instructors = useSelector((state) => state.instructors.instructors);

  useEffect(() => {
    dispatch(fetchSoftwareTools());
    dispatch(fetchCategories());
    dispatch(fetchInstructors());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    // Add form fields to formData
    formData.append("course_id", values.course_id);
    formData.append("slug", values.slug);

    formData.append("course_name", values.course_name);
    formData.append("short_description", values.short_description);
    formData.append("objective", values.objective);
    formData.append("cost", values.cost);
    formData.append("duration", values.duration);
    formData.append("course_level", values.course_level);
    formData.append("mode_of_trainee", values.mode_of_trainee);
    formData.append("certificate", values.certificate ? "Yes" : "No");
    formData.append("number_of_assesment", values.number_of_assesment);
    formData.append("projects", values.projects);
    
    // Append related objects
    formData.append("category", values.category._id);
    formData.append("instructor", values.instructor._id);
    formData.append("tool_software", values.tool_software._id);

    // Add image files
    values.images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(createCourse( formData ));

      setSubmitting(false); // Allow subsequent submissions
  
  };

  return (
    <LeftNavigationBar
    Content={

    <Box className={classes.formContainer}>
      <Formik
        initialValues={{
          course_id: "",
          course_name: "",
          slug: "",
          short_description: "",
          objective: "",
          cost: "",
          duration: "",
          course_level: "",
          mode_of_trainee: "",
          certificate: false,
          number_of_assesment: 0,
          projects: 0,
          category: null,
          instructor: null,
          tool_software: null,
          images: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, setFieldValue, isSubmitting, values }) => (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Typography variant="h4" align="center">Course Information</Typography>
            <br />
            <Field
              as={TextField}
              className={classes.formControl}
              label="Course ID"
              name="course_id"
              variant="outlined"
              fullWidth
              required
            />
            <ErrorMessage
              name="course_id"
              component="div"
              style={{ color: "red" }}
            />
            <Field
              as={TextField}
              className={classes.formControl}
              label="Course Name"
              name="course_name"
              variant="outlined"
              fullWidth
              required
            />
            <ErrorMessage
              name="course_name"
              component="div"
              style={{ color: "red" }}
            />
            <Field
              as={TextField}
              className={classes.formControl}
              label="Slug"
              name="slug"
              variant="outlined"
              fullWidth
              required
            />
            <ErrorMessage
              name="slug"
              component="div"
              style={{ color: "red" }}
            />
            <Field
              as={TextField}
              className={classes.formControl}
              label="Short Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              name="short_description"
              required
            />
            <ErrorMessage
              name="short_description"
              component="div"
              style={{ color: "red" }}
            />

            <Field
              as={TextField}
              className={classes.formControl}
              label="Objective"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              name="objective"
              required
            />
            <ErrorMessage
              name="objective"
              component="div"
              style={{ color: "red" }}
            />

            <Field
              as={TextField}
              className={classes.formControl}
              label="Cost"
              name="cost"
              variant="outlined"
              fullWidth
              type="number"
              required
            />
            <ErrorMessage
              name="cost"
              component="div"
              style={{ color: "red" }}
            />

            <Field
              as={TextField}
              className={classes.formControl}
              label="Duration"
              variant="outlined"
              name="duration"
              fullWidth
              type="number"
              required
            />
            <ErrorMessage
              name="duration"
              component="div"
              style={{ color: "red" }}
            />

            <DropzoneArea
              onDrop={(files) => setFieldValue("images", files)}
              className={classes.formControl}
              acceptedFiles={["image/*"]}
              filesLimit={3}
              dropzoneText="Drag and drop an image here or click"
            />
            <br />
            
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id="course-level-label">Course Level</InputLabel>
              <Select
                labelId="course-level-label"
                variant="outlined"
                name="course_level"
                required
                value={values.course_level}
                onChange={(e) => setFieldValue("course_level", e.target.value)}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Expert">Expert</MenuItem>
              </Select>
            </FormControl>
            <ErrorMessage
              name="course_level"
              component="div"
              style={{ color: "red" }}
            />

            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Mode of Training</FormLabel>
              <RadioGroup
                row
                name="mode_of_trainee"
                value={values.mode_of_trainee}
                onChange={(e) => setFieldValue("mode_of_trainee", e.target.value)}
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

            <FormControl component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Certificate</FormLabel>
                  <RadioGroup
                    row
                    name="certificate"
                    value={values.certificate ? "Yes" : "No"}
                    onChange={(e) => setFieldValue("certificate", e.target.value === "Yes")}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
                <ErrorMessage
                  name="certificate"
                  component="div"
                  style={{ color: "red" }}
                />

            <Field
              as={TextField}
              className={classes.formControl}
              label="Number of Assessments"
              variant="outlined"
              name="number_of_assesment"
              fullWidth
              type="number"
              required
            />
            <ErrorMessage
              name="number_of_assesment"
              component="div"
              style={{ color: "red" }}
            />

            <Field
              as={TextField}
              className={classes.formControl}
              label="Number of Projects"
              variant="outlined"
              fullWidth
              type="number"
              name="projects"
              required
            />
            <ErrorMessage
              name="projects"
              component="div"
              style={{ color: "red" }}
            />

            <FormControl className={classes.formControl} fullWidth>
              <Autocomplete
              required
                id="category"
                options={categories || []}
                getOptionLabel={(option) => option.category_name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                value={values.category}
                onChange={(event, newValue) => setFieldValue("category", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Category"
                    fullWidth
                  />
                )}
              />
            </FormControl>
            <ErrorMessage name="category" component="div" style={{ color: "red" }} />

            <FormControl className={classes.formControl} fullWidth>
              <Autocomplete
              required
                id="instructor"
                options={instructors || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                value={values.instructor}
                onChange={(event, newValue) => setFieldValue("instructor", newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Instructor"
                    fullWidth
                    required
                  />
                )}
              />
            </FormControl>
            <ErrorMessage name="instructor" component="div" style={{ color: "red" }} />

            <FormControl className={classes.formControl} fullWidth>
              <Autocomplete
              
                id="tool_software"
                options={softwareTools || []}
                getOptionLabel={(option) => option.software_name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                value={values.tool_software}
                onChange={(event, newValue) => setFieldValue("tool_software", newValue)}
                required
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Software Tools"
                    fullWidth
                    required
                  />
                )}
              />
            </FormControl>
            <ErrorMessage name="tool_software" component="div" style={{ color: "red" }} />

            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#4CAF50", color: "white" }}
              fullWidth
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </Box>
      }
      />
    );
  };
  
export default CourseAddForm;
