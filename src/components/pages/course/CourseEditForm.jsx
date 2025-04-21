import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Tab,
  Tabs,
  MenuItem,
  IconButton,
  Paper,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchCategories,
  selectCategories,
} from "../../redux/slices/category/category";
import { useDispatch, useSelector } from "react-redux";
import { DropzoneArea } from "material-ui-dropzone";
import {
  fetchSoftwareTools,
  selectSoftwareTools,
} from "../../redux/slices/softwareTools/softwareTools";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCourse,
  fetchCourseById,
  updateCourse,
} from "../../redux/slices/course/course";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

// TabPanel component to handle tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
      {...other}
      style={{ display: value === index ? 'block' : 'none' }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CourseEditForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams(); // Get course ID from URL params
  const isEditMode = Boolean(courseId);

  const [activeTab, setActiveTab] = useState(0);
  const categories = useSelector(selectCategories);
  const allSoftwareTools = useSelector(selectSoftwareTools);
  const [loading, setLoading] = useState(false);
  const [fetchingCourse, setFetchingCourse] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [formData, setFormData] = useState({
    slug: "",
    course_name: "",
    short_description: "",
    category: "",
    objective: "",
    duration: 0,
    mode_of_training: "online",
    number_of_assessments: 0,
    projects: 0,
    courseOutline: [{ module: "" }],
    courseSummary: [{ elements: "", hours: "" }],
    tool_software: [], // Initialize as an empty array
  });

  const [filteredSoftwareTools, setFilteredSoftwareTools] = useState([]);

  useEffect(() => {
    if (formData.category) {
      // Filter software tools based on category
      const toolsForCategory = allSoftwareTools.filter(
        (tool) =>
          tool.category &&
          tool.category.some((cat) => cat._id === formData.category)
      );
      setFilteredSoftwareTools(toolsForCategory);
    } else {
      // If no category selected, show all options
      setFilteredSoftwareTools(allSoftwareTools);
    }
  }, [formData.category, allSoftwareTools]);

  // Fetch course data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setFetchingCourse(true);
      dispatch(fetchCourseById(courseId))
        .unwrap()
        .then((courseData) => {
          console.log("Fetched course data:", courseData);
          setFormData({
            slug: courseData.slug || "",
            course_name: courseData.course_name || "",
            short_description: courseData.short_description || "",
            category: courseData.category?._id || "",
            objective: courseData.objective || "",
            duration: courseData.duration || 0,
            mode_of_training: courseData.mode_of_training || "online",
            number_of_assessments: courseData.number_of_assessments || 0,
            projects: courseData.projects || 0,
            courseOutline: courseData.courseOutline.modules.map((module) => ({
              module,
            })),
           // In your useEffect that fetches course data
courseSummary: courseData.courseSummary ? courseData.courseSummary.map(item => ({ ...item })) : [],
            tool_software: courseData.tool_software || [],
          });

          if (courseData.image) {
            setExistingImage(courseData.image);
          }
        })
        .catch((err) => {
          console.error("Error fetching course:", err);
          setError("Failed to load course data");
          showSnackbar("Failed to load course data", "error");
        })
        .finally(() => {
          setFetchingCourse(false);
        });
    }
  }, [dispatch, courseId, isEditMode]);

  useEffect(() => {
    dispatch(fetchSoftwareTools());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      setImage(files[0]);
    } else {
      setImage(null);
    }
  };

  const handleOutlineChange = (index, value) => {
    const newOutline = [...formData.courseOutline];
    newOutline[index].module = value;
    setFormData({ ...formData, courseOutline: newOutline });
  };

  const addOutline = () => {
    setFormData({
      ...formData,
      courseOutline: [...formData.courseOutline, { module: "" }],
    });
  };

  const removeOutline = (index) => {
    const newOutline = formData.courseOutline.filter((_, i) => i !== index);
    setFormData({ ...formData, courseOutline: newOutline });
  };

  const handleSummaryChange = (index, field, value) => {
    const newSummary = formData.courseSummary.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormData({ ...formData, courseSummary: newSummary });
  };
  const addSummary = () => {
    setFormData({
      ...formData,
      courseSummary: [...formData.courseSummary, { elements: "", hours: "" }],
    });
  };

  const removeSummary = (index) => {
    const newSummary = formData.courseSummary.filter((_, i) => i !== index);
    setFormData({ ...formData, courseSummary: newSummary });
  };

  // Show snackbar with custom message and severity
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handler for closing the snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const courseFormData = new FormData();
      if (image) {
        courseFormData.append("image", image);
      }
      courseFormData.append("slug", formData.slug);
      courseFormData.append("course_name", formData.course_name);
      courseFormData.append("short_description", formData.short_description);
      courseFormData.append("category", formData.category);
      courseFormData.append("objective", formData.objective);
      courseFormData.append("duration", formData.duration);
      courseFormData.append("mode_of_training", formData.mode_of_training);
      courseFormData.append(
        "number_of_assessments",
        formData.number_of_assessments
      );
      courseFormData.append("projects", formData.projects);

      if (formData.tool_software && Array.isArray(formData.tool_software)) {
        const toolIds = formData.tool_software.map((tool) => tool._id);
        courseFormData.append("tool_software", JSON.stringify(toolIds));
      }

      if (formData.courseOutline && Array.isArray(formData.courseOutline)) {
        const modules = formData.courseOutline.map((item) => item.module);
        courseFormData.append("courseOutline", JSON.stringify({ modules }));
      }

      // Handle courseSummary properly
      if (formData.courseSummary && Array.isArray(formData.courseSummary)) {
        courseFormData.append(
          "courseSummary",
          JSON.stringify(formData.courseSummary)
        );
      }

      let response;
      if (isEditMode) {
        response = await dispatch(
          updateCourse({ courseId, courseFormData })
        ).unwrap();
        showSnackbar("Course updated successfully!");
      } else {
        response = await dispatch(createCourse(courseFormData)).unwrap();
        showSnackbar("Course added successfully!");
      }

      // Navigate after a short delay to allow the user to see the message
      setTimeout(() => {
        navigate("/Course-control");
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);

      // Handle different error formats
      if (error.message && typeof error.message === 'object') {
        const errorMsg = error.message.find(msg => msg.key === 'error');
        if (errorMsg) {
          setError(errorMsg.value);
          showSnackbar(errorMsg.value, 'error');
        } else {
          setError('An error occurred while updating the course');
          showSnackbar('An error occurred while updating the course', 'error');
        }
      } else if (error.data && error.data.message) {
        const errorMessages = error.data.message;
        if (Array.isArray(errorMessages)) {
          const errorMsg = errorMessages.find(msg => msg.key === 'error');
          const errorText = errorMsg ? errorMsg.value : 'An error occurred while updating the course';
          setError(errorText);
          showSnackbar(errorText, 'error');
        } else {
          setError('An error occurred while updating the course');
          showSnackbar('An error occurred while updating the course', 'error');
        }
      } else {
        setError('Network error. Please try again.');
        showSnackbar('Network error. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCourse) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading course data...
        </Typography>
      </Box>
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              {isEditMode ? "Edit Course" : "Add New Course"}
            </Typography>
            {error && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "#ffebee",
                  color: "#c62828",
                  borderRadius: 1,
                }}
              >
                {error}
              </Box>
            )}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Basic Information" />
                <Tab label="Course Outline & Summary" />
              </Tabs>
            </Box>
            <form onSubmit={handleSubmit}>
              {/* Basic Information Tab */}
              <TabPanel value={activeTab} index={0}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Course Name"
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleInputChange}
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Short Description"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      required
                      multiline
                      rows={2}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        label="Category"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.category_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      multiple
                      options={filteredSoftwareTools}
                      getOptionLabel={(option) => option.software_name || ""}
                      value={formData.tool_software} // Ensure this is an array
                      onChange={(e, newValue) => {
                        setFormData({ ...formData, tool_software: newValue });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tools & Software"
                          margin="normal"
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option.software_name}
                            {...getTagProps({ index })}
                            key={index}
                          />
                        ))
                      }
                      disabled={!formData.category}
                    />
                    {!formData.category && (
                      <Typography variant="caption" color="error">
                        Please select a category first
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Course Image
                    </Typography>
                    {existingImage && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" display="block" gutterBottom>
                          Current image:
                        </Typography>
                        <img
                          src={existingImage}
                          alt="Current course"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '200px',
                            marginBottom: '16px',
                            borderRadius: '4px'
                          }}
                        />
                      </Box>
                    )}
                    <DropzoneArea
                      acceptedFiles={["image/*"]}
                      filesLimit={1}
                      dropzoneText={`${isEditMode ? "Replace current image or " : ""}Drag and drop an image here or click`}
                      onChange={handleFileChange}
                      showPreviews={true}
                      showPreviewsInDropzone={false}
                      showFileNames={true}
                      maxFileSize={5000000}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Course Objective"
                      name="objective"
                      value={formData.objective}
                      onChange={handleInputChange}
                      required
                      multiline
                      rows={3}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Duration (hours)"
                      name="duration"
                      type="number"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="mode-label">Mode of Training</InputLabel>
                      <Select
                        labelId="mode-label"
                        name="mode_of_training"
                        value={formData.mode_of_training}
                        onChange={handleInputChange}
                        required
                        label="Mode of Training"
                      >
                        <MenuItem value="online">Online</MenuItem>
                        <MenuItem value="offline">Offline</MenuItem>
                        <MenuItem value="hybrid">Hybrid</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Number of Assessments"
                      name="number_of_assessments"
                      type="number"
                      value={formData.number_of_assessments}
                      onChange={handleInputChange}
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Projects"
                      name="projects"
                      type="number"
                      value={formData.projects}
                      onChange={handleInputChange}
                      required
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
                  <Button
                    onClick={() => setActiveTab(1)}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    Next
                  </Button>
                </Box>
              </TabPanel>

              {/* Course Outline & Summary Tab */}
              <TabPanel value={activeTab} index={1}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Course Outline</Typography>
                    {formData.courseOutline.map((outline, index) => (
                      <Box key={index} display="flex" alignItems="center" sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          label={`Module ${index + 1}`}
                          value={outline.module}
                          onChange={(e) =>
                            handleOutlineChange(index, e.target.value)
                          }
                          required
                        />
                        <IconButton
                          onClick={() => removeOutline(index)}
                          disabled={formData.courseOutline.length <= 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      onClick={addOutline}
                      startIcon={<AddIcon />}
                      variant="outlined"
                      sx={{ mt: 1, mb: 3 }}
                    >
                      Add Module
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Course Summary</Typography>
                    {formData.courseSummary.map((summary, index) => (
                      <Box key={index} display="flex" alignItems="center" sx={{ mb: 2 }}>
                        <TextField
                          label={`Elements ${index + 1}`}
                          value={summary.elements}
                          onChange={(e) =>
                            handleSummaryChange(
                              index,
                              "elements",
                              e.target.value
                            )
                          }
                          required
                          sx={{ mr: 2, flexGrow: 1 }}
                        />
                        <TextField
                          label={`Hours ${index + 1}`}
                          value={summary.hours}
                          onChange={(e) =>
                            handleSummaryChange(index, "hours", e.target.value)
                          }
                          required
                          sx={{ width: '120px', mr: 1 }}
                        />
                        <IconButton
                          onClick={() => removeSummary(index)}
                          disabled={formData.courseSummary.length <= 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      onClick={addSummary}
                      startIcon={<AddIcon />}
                      variant="outlined"
                      sx={{ mt: 1 }}
                    >
                      Add Summary
                    </Button>
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                  <Button
                    onClick={() => setActiveTab(0)}
                    variant="outlined"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading
                      ? isEditMode
                        ? "Updating..."
                        : "Saving..."
                      : isEditMode
                        ? "Update Course"
                        : "Save Course"}
                  </Button>
                </Box>
              </TabPanel>
            </form>
          </Paper>

          {/* Snackbar for feedback messages */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      }
    />
  );
};

export default CourseEditForm;