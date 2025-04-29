import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Snackbar,
  Alert,
  Container,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DropzoneArea } from 'material-ui-dropzone';
import { fetchSoftwareTools, selectSoftwareTools } from '../../redux/slices/softwareTools/softwareTools';
import { fetchCategories, selectCategories } from '../../redux/slices/category/category';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../../redux/slices/course/course';
import LeftNavigationBar from '../../navbars/LeftNavigationBar';
import { HelpOutline } from '@mui/icons-material';

const CourseAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const categories = useSelector(selectCategories);
  const allSoftwareTools = useSelector(selectSoftwareTools);

  const [filteredSoftwareTools, setFilteredSoftwareTools] = useState([]);
  const [formData, setFormData] = useState({
    slug: '',
    course_name: '',
    short_description: '',
    category: '',
    objective: '',
    duration: '',
    mode_of_training: 'online', // Default to 'online'
    number_of_assessments: '',
    projects: '',
    courseOutline: [{ module: '' }],
    courseSummary: [{ elements: '', hours: '' }],
    image: null,
    tool_software: [],
  });

  // Keep track of the image preview
  const [imagePreview, setImagePreview] = useState(null);
  const [initialFiles, setInitialFiles] = useState([]);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchSoftwareTools());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (formData.category) {
      const toolsForCategory = allSoftwareTools.filter(tool =>
        tool.category && tool.category.some(cat => cat._id === formData.category)
      );
      setFilteredSoftwareTools(toolsForCategory);
    } else {
      setFilteredSoftwareTools(allSoftwareTools);
    }
  }, [formData.category, allSoftwareTools]);

  useEffect(() => {
    // Update initialFiles whenever image changes
    if (formData.image) {
      setInitialFiles([formData.image]);
    } else {
      setInitialFiles([]);
    }
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      setFormData({ ...formData, image: files[0] });

      // Create and store image preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, image: null });
      setImagePreview(null);
    }
  };

  const handleOutlineChange = (index, value) => {
    const newOutline = [...formData.courseOutline];
    newOutline[index].module = value;
    setFormData({ ...formData, courseOutline: newOutline });
  };

  const handleSummaryChange = (index, field, value) => {
    const newSummary = [...formData.courseSummary];
    newSummary[index][field] = value;
    setFormData({ ...formData, courseSummary: newSummary });
  };

  const addOutline = () => {
    setFormData({
      ...formData,
      courseOutline: [...formData.courseOutline, { module: '' }],
    });
  };

  const removeOutline = (index) => {
    const newOutline = formData.courseOutline.filter((_, i) => i !== index);
    setFormData({ ...formData, courseOutline: newOutline });
  };

  const addSummary = () => {
    setFormData({
      ...formData,
      courseSummary: [...formData.courseSummary, { elements: '', hours: '' }],
    });
  };

  const removeSummary = (index) => {
    const newSummary = formData.courseSummary.filter((_, i) => i !== index);
    setFormData({ ...formData, courseSummary: newSummary });
  };

  // Handler for closing the snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Show snackbar with custom message and severity
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach(key => {
      if (!['courseOutline', 'courseSummary', 'tool_software', 'image'].includes(key)) {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    if (formData.tool_software && Array.isArray(formData.tool_software)) {
      const toolIds = formData.tool_software.map(tool => tool._id);
      formDataToSend.append('tool_software', JSON.stringify(toolIds));
    }

    if (formData.courseOutline && Array.isArray(formData.courseOutline)) {
      const modules = formData.courseOutline.map(item => item.module);
      formDataToSend.append('courseOutline', JSON.stringify({ modules }));
    }

    if (formData.courseSummary && Array.isArray(formData.courseSummary)) {
      formDataToSend.append('courseSummary', JSON.stringify(formData.courseSummary));
    }

    try {
      setLoading(true);
      const result = await dispatch(createCourse(formDataToSend)).unwrap();

      // Check if there is a success message in the response
      if (result && result.message) {
        const successMsg = result.message.find(msg => msg.key === "Success" || msg.key === "SUCCESS");
        if (successMsg) {
          showSnackbar(successMsg.value, 'success');
        } else {
          showSnackbar('Course added successfully!', 'success');
        }

        // Redirect after a short delay to allow the user to see the message
        setTimeout(() => {
          navigate('/Course-control');
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);

      // Handle different error formats
      if (error.message && typeof error.message === 'object') {
        const errorMsg = error.message.find(msg => msg.key === 'error');
        if (errorMsg) {
          setError(errorMsg.value);
          showSnackbar(errorMsg.value, 'error');
        } else {
          setError('An error occurred while adding the course');
          showSnackbar('An error occurred while adding the course', 'error');
        }
      } else if (error.data && error.data.message) {
        const errorMessages = error.data.message;
        if (Array.isArray(errorMessages)) {
          const errorMsg = errorMessages.find(msg => msg.key === 'error');
          const errorText = errorMsg ? errorMsg.value : 'An error occurred while adding the course';
          setError(errorText);
          showSnackbar(errorText, 'error');
        } else {
          setError('An error occurred while adding the course');
          showSnackbar('An error occurred while adding the course', 'error');
        }
      } else {
        setError('Network error. Please try again.');
        showSnackbar('Network error. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={0}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mt={2} mb={2}>
              <Button variant="outlined" color="primary" onClick={handleBack}>
                Back
              </Button>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', flex: 1 }}>
                <Typography variant="h4" sx={{ position: "relative", padding: 0, margin: 0, fontWeight: 300, fontSize: { xs: "32px", sm: "40px" }, color: "#747474", textAlign: "center", textTransform: "uppercase", paddingBottom: "5px", "&::before": { content: '""', width: "28px", height: "5px", display: "block", position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, "&::after ": { content: '""', width: "100px", height: "1px", display: "block", position: "relative", marginTop: "5px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, }}>
                 Course Add From
                </Typography>
                <Tooltip title="This is where you can add the Course." arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Basic Details" />
            <Tab label="Course Outline & Summary" />
          </Tabs>
          <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
            {activeTab === 0 && (
              <Grid container spacing={2} sx={{ mt: 2 }}>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Course Name"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Short Description"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    multiple
                    options={filteredSoftwareTools}
                    getOptionLabel={(option) => option.software_name || ''}
                    value={formData.tool_software}
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
                  <TextField
                    fullWidth
                    label="Objective"
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Duration (in hours)"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="mode-of-training-label">Mode of Training</InputLabel>
                    <Select
                      labelId="mode-of-training-label"
                      name="mode_of_training"
                      value={formData.mode_of_training}
                      onChange={handleChange}
                    >
                      <MenuItem value="online">Online</MenuItem>
                      <MenuItem value="offline">Offline</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Number of Assessments"
                    name="number_of_assessments"
                    type="number"
                    value={formData.number_of_assessments}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Projects"
                    name="projects"
                    type="number"
                    value={formData.projects}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Course Image
                  </Typography>
                  {imagePreview && (
                    <Box mb={2}>
                      <Typography variant="caption" color="textSecondary">
                        Current selected image:
                      </Typography>
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Course preview"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          marginTop: 1,
                          borderRadius: 1
                        }}
                      />
                    </Box>
                  )}
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    filesLimit={1}
                    dropzoneText="Drag and drop an image here or click"
                    onChange={handleFileChange}
                    name="image"
                    initialFiles={initialFiles}
                    required
                    showPreviewsInDropzone={false}
                  />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary" onClick={() => setActiveTab(1)}>
                    Next
                  </Button>
                </Grid>
              </Grid>
            )}
            {activeTab === 1 && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Typography variant="h6">Course Outline</Typography>
                  {formData.courseOutline.map((outline, index) => (
                    <Box key={index} display="flex" alignItems="center" marginBottom={2}>
                      <TextField
                        label={`Module ${index + 1}`}
                        value={outline.module}
                        onChange={(e) => handleOutlineChange(index, e.target.value)}
                        required
                        fullWidth
                      />
                      <IconButton onClick={() => removeOutline(index)}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button onClick={addOutline} startIcon={<AddIcon />} variant="outlined">
                    Add Module
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Course Summary</Typography>
                  {formData.courseSummary.map((summary, index) => (
                    <Box key={index} display="flex" alignItems="center" marginBottom={2}>
                      <TextField
                        label={`Elements ${index + 1}`}
                        value={summary.elements}
                        onChange={(e) => handleSummaryChange(index, 'elements', e.target.value)}
                        required
                        fullWidth
                      />
                      <TextField
                        label={`Hours ${index + 1}`}
                        value={summary.hours}
                        onChange={(e) => handleSummaryChange(index, 'hours', e.target.value)}
                        required
                        fullWidth
                      />
                      <IconButton onClick={() => removeSummary(index)}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button onClick={addSummary} startIcon={<AddIcon />} variant="outlined">
                    Add Summary
                  </Button>
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined" color="primary" onClick={() => setActiveTab(0)}>
                    Preview Tab
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Course'}
                  </Button>
                </Grid>

              </Grid>
            )}
          </form>

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
              hiii
            </Alert>
          </Snackbar>
        </Paper>
        </Container>
      } />
  );
};

export default CourseAddForm;