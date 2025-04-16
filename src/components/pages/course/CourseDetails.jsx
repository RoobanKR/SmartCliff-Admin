import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCategories, selectCategories } from '../../redux/slices/category/category';
import { useDispatch, useSelector } from 'react-redux';
import { DropzoneArea } from 'material-ui-dropzone';
import { fetchSoftwareTools, selectSoftwareTools } from '../../redux/slices/softwareTools/softwareTools';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../../redux/slices/course/course';
import LeftNavigationBar from '../../navbars/LeftNavigationBar';

// TabPanel component to handle tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CourseForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const categories = useSelector(selectCategories);
  const allSoftwareTools = useSelector(selectSoftwareTools);
  
  const [filteredSoftwareTools, setFilteredSoftwareTools] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  
  const [formData, setFormData] = useState({
    slug: '',
    course_name: '',
    short_description: '',
    category: '',
    image: '',
    objective: '',
    duration: 0,
    mode_of_training: 'online',
    number_of_assessments: 0,
    projects: 0,
    tool_software: [], // Store full objects instead of IDs
    courseOutline: [''], // New field for course outline
    courseSummary: { elements: [''], hours: [''] }, // New field for course summary
  });

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleCourseOutlineChange = (index, value) => {
    const updatedOutline = [...formData.courseOutline];
    updatedOutline[index] = value;
    setFormData({ ...formData, courseOutline: updatedOutline });
  };

  const addCourseOutline = () => {
    setFormData({ ...formData, courseOutline: [...formData.courseOutline, ''] });
  };

  const removeCourseOutline = (index) => {
    const updatedOutline = [...formData.courseOutline];
    updatedOutline.splice(index, 1);
    setFormData({ ...formData, courseOutline: updatedOutline });
  };

  const handleCourseSummaryChange = (field, index, value) => {
    const updatedSummary = { ...formData.courseSummary };
    updatedSummary[field][index] = value;
    setFormData({ ...formData, courseSummary: updatedSummary });
  };

  const addCourseSummary = (field) => {
    const updatedSummary = { ...formData.courseSummary };
    updatedSummary[field].push(''); // Add a new empty string to the array
    setFormData({ ...formData, courseSummary: updatedSummary });
  };

  const removeCourseSummary = (field, index) => {
    const updatedSummary = { ...formData.courseSummary };
    updatedSummary[field].splice(index, 1);
    setFormData({ ...formData, courseSummary: updatedSummary });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      if (!formData.course_name || !formData.slug || !formData.category || !image) {
        setError('Please fill in all required fields and upload an image');
        setLoading(false);
        return;
      }
  
      const courseFormData = new FormData();
      courseFormData.append('image', image);
      courseFormData.append('slug', formData.slug);
      courseFormData.append('course_name', formData.course_name);
      courseFormData.append('short_description', formData.short_description);
      courseFormData.append('category', formData.category);
      courseFormData.append('objective', formData.objective);
      courseFormData.append('duration', formData.duration);
      courseFormData.append('mode_of_training', formData.mode_of_training);
      courseFormData.append('number_of_assessments', formData.number_of_assessments);
      courseFormData.append('projects', formData.projects);
  
      // Format tool software as an array of IDs
      const toolSoftwareIds = formData.tool_software.map(tool => tool._id);
      courseFormData.append('tool_software', JSON.stringify(toolSoftwareIds));
  
      // Format course outline as an array of objects
      const formattedCourseOutline = formData.courseOutline.map(outline => ({ modules: [outline] }));
      courseFormData.append('courseOutline', JSON.stringify(formattedCourseOutline));
  
      // Format course summary as an object
      const formattedCourseSummary = {
        elements: formData.courseSummary.elements,
        hours: formData.courseSummary.hours,
      };
      courseFormData.append('courseSummary', JSON.stringify(formattedCourseSummary));
  
      const response = await dispatch(createCourse(courseFormData));
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
  return (
    <LeftNavigationBar
      Content={
        <Box>
          <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Course Details" />
                  <Tab label="Course Outline & Summary" />
                </Tabs>
              </Box>

              <form onSubmit={handleSubmit}>
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
                        helperText="URL friendly identifier (e.g., web-development-101)"
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
                    <Grid item xs={12}>
                      <DropzoneArea
                        acceptedFiles={["image/*"]}
                        filesLimit={1}
                        dropzoneText="Drag and drop an image here or click"
                        onChange={(files) => setImage(files[0])}
                        name="image"
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
                        onChange={handleNumberChange}
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
                        on Change={handleNumberChange}
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
                        onChange={handleNumberChange}
                        required
                        margin="normal"
                      />
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
                  </Grid>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, p: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Button onClick={handleCancel} variant="outlined" sx={{ mr: 1 }}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Course'}
                    </Button>
                  </Box>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                  <Typography variant="h6" gutterBottom>
                    Course Outline
                  </Typography>
                  {formData.courseOutline.map((outline, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TextField
                        fullWidth
                        label={`Module ${index + 1}`}
                        value={outline}
                        onChange={(e) => handleCourseOutlineChange(index, e.target.value)}
                        margin="normal"
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeCourseOutline(index)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addCourseOutline}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  >
                    Add Module
                  </Button>

                  <Typography variant="h6" gutterBottom>
                    Course Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      {formData.courseSummary.elements.map((element, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TextField
                            fullWidth
                            label={`Element ${index + 1}`}
                            value={element}
                            onChange={(e) => handleCourseSummaryChange('elements', index, e.target.value)}
                            margin="normal"
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeCourseSummary('elements', index)}
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => addCourseSummary('elements')}
                        variant="outlined"
                        sx={{ mt: 1 }}
                      >
                        Add Element
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {formData.courseSummary.hours.map((hour, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <TextField
                            fullWidth
                            label={`Hour ${index + 1}`}
                            value={hour}
                            onChange={(e) => handleCourseSummaryChange('hours', index, e.target.value)}
                            margin="normal"
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeCourseSummary('hours', index)}
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => addCourseSummary('hours')}
                        variant="outlined"
                        sx={{ mt: 1 }}
                      >
                        Add Hour
                      </Button>
                    </Grid>
                  </Grid>
                </TabPanel>
              </form>
            </Paper>
          </Container>
          {error && (
            <Box sx={{ mb: 2, p: 2, bgcolor: '#ffebee', color: '#c62828', borderRadius: 1 }}>
              {error}
            </Box>
          )}
        </Box>
      }
    />
  );
};

export default CourseForm;