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

const CourseAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  });

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchSoftwareTools());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (formData.category) {
      // Filter software tools based on category
      const toolsForCategory = allSoftwareTools.filter(tool => 
        tool.category && tool.category.some(cat => cat._id === formData.category)
      );
      setFilteredSoftwareTools(toolsForCategory);
    } else {
      // If no category selected, show all options
      setFilteredSoftwareTools(allSoftwareTools);
    }
  }, [formData.category, allSoftwareTools]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (files) => {
    setFormData({ ...formData, image: files[0] });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Handle all fields except objects and arrays
    Object.keys(formData).forEach(key => {
      if (!['courseOutline', 'courseSummary', 'tool_software', 'image'].includes(key)) {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    // Handle image separately
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
  
    // Handle tool_software as an array of IDs
    if (formData.tool_software && Array.isArray(formData.tool_software)) {
      const toolIds = formData.tool_software.map(tool => tool._id);
      formDataToSend.append('tool_software', JSON.stringify(toolIds));
    }
    
    // Handle courseOutline properly
    if (formData.courseOutline && Array.isArray(formData.courseOutline)) {
      const modules = formData.courseOutline.map(item => item.module);
      formDataToSend.append('courseOutline', JSON.stringify({ modules }));
    }
    
    // Handle courseSummary properly
    if (formData.courseSummary && Array.isArray(formData.courseSummary)) {
      formDataToSend.append('courseSummary', JSON.stringify(formData.courseSummary));
    }
  
    try {
      const response = await dispatch(createCourse(formDataToSend));
      if (response.status === 201) {
        alert('Course added successfully!');
        navigate('/Course-control');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
  
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessages = error.response.data.message;
        if (Array.isArray(errorMessages)) {
          const errorMsg = errorMessages.find(msg => msg.key === 'error');
          setError(errorMsg ? errorMsg.value : 'An error occurred while adding the course');
        } else {
          setError('An error occurred while adding the course');
        }
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };  

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <LeftNavigationBar
    Content={

    <Paper elevation={3} style={{ padding: '20px' }}>
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
        Create Course
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Basic Details" />
        <Tab label="Course Outline & Summary" />
      </Tabs>
      <form onSubmit={handleSubmit}>
        {activeTab === 0 && (
          <Grid container spacing={2}>
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
              <DropzoneArea
                acceptedFiles={["image/*"]}
                filesLimit={1}
                dropzoneText="Drag and drop an image here or click"
                onChange={handleFileChange}
                name="image"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={() => setActiveTab(1)}>
                Next
              </Button>
            </Grid>
          </Grid>
        )}
        {activeTab === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Course Outline</Typography>
              {formData.courseOutline.map((outline, index) => (
                <Box key={index} display="flex" alignItems="center">
                  <TextField
                    label={`Module ${index + 1}`}
                    value={outline.module}
                    onChange={(e) => handleOutlineChange(index, e.target.value)}
                    required
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
                <Box key={index} display="flex" alignItems="center">
                  <TextField
                    label={`Elements ${index + 1}`}
                    value={summary.elements}
                    onChange={(e) => handleSummaryChange(index, 'elements', e.target.value)}
                    required
                  />
                  <TextField
                    label={`Hours ${index + 1}`}
                    value={summary.hours}
                    onChange={(e) => handleSummaryChange(index, 'hours', e.target.value)}
                    required
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
          </Grid>
        )}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Create Course
          </Button>
        </Grid>
      </form>
    </Paper>
    }/>
  );
};

export default CourseAddForm;