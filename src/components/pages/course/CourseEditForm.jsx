import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Box,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseById,
  selectCourses,
} from "../../redux/slices/course/course";
import { useParams } from "react-router-dom";
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import {
  fetchCategories,
  selectCategories,
} from "../../redux/slices/category/category";
import {
  fetchSoftwareTools,
  selectSoftwareTools,
} from "../../redux/slices/softwareTools/softwareTools";
import { fetchInstructors } from "../../redux/slices/instructor/instructor";
import { DropzoneArea } from "material-ui-dropzone";
import axios from "axios";

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

const CourseEditForm = () => {
  const classes = useStyles();
  const { courseId } = useParams();
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const [course_id, setCourse_id] = useState("");
  const [course_name, setcourse_name] = useState("");
  const [slug, setSlug] = useState("");
  const [short_description, setshort_description] = useState("");
  const [objective, setobjective] = useState("");
  const [cost, setcost] = useState("");
  const [duration, setduration] = useState("");
  const [mode_of_trainee, setmode_of_trainee] = useState("");
  const [course_level, setcourse_level] = useState("");
  const [number_of_assesment, setnumber_of_assesment] = useState("");
  const [projects, setprojects] = useState("");
  const [certificate, setCertificate] = useState(false);
  const categories = useSelector(selectCategories);
  const [selectedCategory, setSelectedCategory] = useState("");
  const toolSoftware = useSelector(selectSoftwareTools);
  const [selectedToolSoftwareIds, setSelectedToolSoftwareIds] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const instructors = useSelector((state) => state.instructors.instructors);
  const [selectedInstructor, setSelectedInstructor] = useState([]);
  const instructorsArray = instructors || [];

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await dispatch(fetchCourseById(courseId));
        dispatch(fetchCategories());
        dispatch(fetchSoftwareTools());
        dispatch(fetchInstructors());
        console.log("Before updating state - courses:", courses);
        const instructorId = response.payload.instructor[0]._id;

        setCourse_id(response.payload.course_id || "");
        setcourse_name(response.payload.course_name || "");
        setSlug(response.payload.slug || "");
        setshort_description(response.payload.short_description || "");
        setobjective(response.payload.objective || "");
        setcost(response.payload.cost || "");
        setduration(response.payload.duration || "");
        setmode_of_trainee(response.payload.mode_of_trainee || "");
        setcourse_level(response.payload.course_level || "");
        setCertificate(!!response.payload.certificate);
        setnumber_of_assesment(response.payload.number_of_assesment || "");
        setprojects(response.payload.projects || "");
        setExistingImages(response.payload.images || []);
        const initialCategory = response.payload.category;
        const initialSelectedCategory = categories.find(
          (cat) => cat._id === initialCategory._id
        );
        setSelectedCategory(initialSelectedCategory);
        const initialToolSoftware = response.payload.tool_software;
        const initialSelectedToolSoftwareIds = Array.isArray(
          initialToolSoftware
        )
          ? initialToolSoftware.map((tool) => tool._id)
          : [];

        setSelectedToolSoftwareIds(initialSelectedToolSoftwareIds);

        const initialInstructors = response.payload.instructors;
        const initialSelectedInstructorIds = Array.isArray(initialInstructors)
          ? initialInstructors.map((instructors) => instructors._id)
          : [];
        setSelectedInstructor(instructorId);

        console.log(
          "Initial Selected Instructors:",
          initialSelectedInstructorIds
        );

        // Log the instructor name
        if (initialInstructors && initialInstructors.length > 0) {
          const instructorName = initialInstructors[0].name;
          console.log("Instructor Name in Course:", instructorName);
        }

        const initialInstructor = response.payload.instructor[0];
        setSelectedInstructor(initialInstructor); // Set initial instructor object
        console.log("After updating state - courses:", courses);
        if (initialInstructor) {
          console.log("Instructor Name in Course:", initialInstructor.name);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [dispatch]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(); // Create a FormData instance to handle file uploads

    // Append simple text fields to FormData
    formData.append("course_id", course_id);
    formData.append("course_name", course_name);
    formData.append("slug", slug);
    formData.append("short_description", short_description);
    formData.append("objective", objective);
    formData.append("cost", cost);
    formData.append("duration", duration);
    formData.append("mode_of_trainee", mode_of_trainee);
    formData.append("course_level", course_level);
    formData.append("certificate", certificate);
    formData.append("number_of_assesment", number_of_assesment);
    formData.append("projects", projects);

    // Append category and tool software
    if (selectedCategory) {
      formData.append("category", selectedCategory._id);
    }

    if (Array.isArray(selectedToolSoftwareIds)) {
      selectedToolSoftwareIds.forEach(id => {
        formData.append("tool_software", id); 
      });
    }    

    // Append instructor if selected
    if (selectedInstructor) {
      formData.append("instructor", selectedInstructor._id);
    }

    // Append new images
    if (newImages.length > 0) {
      for (const images of newImages) {
        formData.append("images", images);
      }
    } else {
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

        formData.append("images", file);
      }
    }

    try {
      await axios.put(`http://localhost:5353/update/course/${courseId}`, formData);
      console.log("Request was successful");
    } catch (error) {
      console.error("Error sending PUT request:", error);
    }
    
  };

  const renderAutocomplete = categories.length > 0;
  return (
    <LeftNavigationBar
      Content={
        <Box className={classes.formContainer}>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Typography
              gutterBottom
              variant="h4"
              align="center"
              component="div"
              style={{ fontFamily: "Serif" }}
            >
              Course Information
            </Typography>
            <br></br>
            <TextField
              className={classes.formControl}
              label="Course Id"
              variant="outlined"
              fullWidth
              name="course_id"
              value={course_id}
              onChange={(e) => setCourse_id(e.target.value)}
              required
            />
            <TextField
              className={classes.formControl}
              label="Course Name"
              variant="outlined"
              fullWidth
              name="course_name"
              value={course_name}
              onChange={(e) => setcourse_name(e.target.value)}
              required
            />
            <TextField
              className={classes.formControl}
              label="slug"
              variant="outlined"
              fullWidth
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
            <TextField
              className={classes.formControl}
              label="Short Description"
              variant="outlined"
              fullWidth
              multiline
              name="short_description"
              value={short_description}
              onChange={(e) => setshort_description(e.target.value)}
              required
            />
            <TextField
              className={classes.formControl}
              label="Objective"
              variant="outlined"
              fullWidth
              multiline
              name="objective"
              value={objective}
              onChange={(e) => setobjective(e.target.value)}
              required
            />
            <TextField
              className={classes.formControl}
              label="Cost"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              name="cost"
              value={cost}
              onChange={(e) => setcost(e.target.value)}
              required
            />
            <TextField
              className={classes.formControl}
              label="Duration (hours)"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              name="duration"
              value={duration}
              onChange={(e) => setduration(e.target.value)}
              required
            />
            <FormControl className={classes.formControl}>
              <InputLabel id="course-level-label" style={{ marginLeft: "3%" }}>
                Course Level
              </InputLabel>
              <Select
                labelId="course-level-label"
                id="course-level"
                variant="outlined"
                fullWidth
                name="course_level"
                value={course_level}
                onChange={(e) => setcourse_level(e.target.value)}
              >
                <MenuItem value="Beginer">Beginer</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Mode of Training</FormLabel>
              <RadioGroup
                row
                name="mode_of_trainee"
                value={mode_of_trainee}
                onChange={(e) => setmode_of_trainee(e.target.value)}
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
              <FormLabel component="legend">Certificate (optional)</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name="certificate"
                    checked={certificate}
                    onChange={() => setCertificate(!certificate)}
                  />
                }
                label="Yes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name="certificate"
                    checked={!certificate}
                    onChange={() => setCertificate(!certificate)}
                  />
                }
                label="No"
              />
            </FormControl>
            <TextField
              className={classes.formControl}
              label="no of assessment"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              name="number_of_assesment"
              value={number_of_assesment}
              onChange={(e) => setnumber_of_assesment(e.target.value)}
              required
            />
            <TextField
              className={classes.formControl}
              label="No Of Project"
              variant="outlined"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              name="projects"
              value={projects}
              onChange={(e) => setprojects(e.target.value)}
              required
            />
            {renderAutocomplete && (
              <Autocomplete
                id="category"
                options={categories}
                getOptionLabel={(option) => option.category_name || ""}
                value={selectedCategory}
                onChange={(_, newValue) => setSelectedCategory(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Category"
                    fullWidth
                  />
                )}
              />
            )}
            <FormControl fullWidth>
              <Autocomplete
                id="toolSoftware"
                options={toolSoftware}
                getOptionLabel={(option) => option.software_name || ""}
                value={toolSoftware.filter((tool) =>
                  selectedToolSoftwareIds.includes(tool._id)
                )}
                onChange={(_, newValue) => {
                  setSelectedToolSoftwareIds(newValue.map((tool) => tool._id));
                }}
                multiple
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Tool Software"
                    fullWidth
                  />
                )}
              />
            </FormControl>
            <Autocomplete
              id="instructor"
              options={instructorsArray}
              getOptionLabel={(option) => option.name || ""}
              value={selectedInstructor}
              onChange={(event, newValue) => setSelectedInstructor(newValue)} // Update the handler
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Instructor"
                  fullWidth
                />
              )}
            />{" "}
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    filesLimit={5}
                    dropzoneText="Drag and drop image here or click"
                    onChange={(fileArray) => setNewImages(fileArray)}
                  />
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
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#4CAF50", color: "white" }}
              fullWidth
            >
              Submit
            </Button>
          </form>
        </Box>
      }
    />
  );
};

export default CourseEditForm;
