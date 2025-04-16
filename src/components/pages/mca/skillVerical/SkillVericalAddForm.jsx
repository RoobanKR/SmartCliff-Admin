import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  TextField,
  Typography,
  Paper,
  IconButton,
  Chip,
  Divider,
  Autocomplete,
  Snackbar, Alert,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; // Import Edit icon
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices } from '../../../redux/slices/services/services/Services';
import { getAllBussinessServices } from '../../../redux/slices/services/bussinessServices/BussinessSerives';
import { fetchDegreeProgramData } from '../../../redux/slices/mca/degreeProgram/degreeProgram';
import { getAllColleges } from '../../../redux/slices/mca/college/college';
import { createSkillVertical } from '../../../redux/slices/mca/skillVertical/skillVertical';
import { useNavigate } from 'react-router-dom';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';

const SkillVerticalAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [prerequisite, setPrerequisite] = useState('');
  const [coreSubject, setCoreSubject] = useState('');

  const [loading, setLoading] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // New state to track editing mode
  const [editingIndex, setEditingIndex] = useState(-1); // New state to track which vertical is being edited

  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
  const collegeData = useSelector((state) => state.college.colleges);

  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredDegreePrograms, setFilteredDegreePrograms] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({
    programName: '',
    service: '',
    business_service: '',
    degree_program: '',
    college: null,
    skillVerticals: []
  });

  // State for skill vertical being added
  const [currentVertical, setCurrentVertical] = useState({
    vertical: '',
    name: '',
    batchSize: '',
    prerequisites: [],
    coreSubjects: []
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchServices());
      dispatch(getAllBussinessServices());
      dispatch(fetchDegreeProgramData());
      dispatch(getAllColleges());
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (selectedBusinessService) {
      const filtered = serviceData.filter(
        (service) => service.business_services?._id === selectedBusinessService._id
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  }, [selectedBusinessService, serviceData]);

  useEffect(() => {
    if (selectedService) {
      const filteredPrograms = degreeProgramData.filter(
        (program) => program.service?._id === selectedService._id
      );
      setFilteredDegreePrograms(filteredPrograms);
    } else {
      setFilteredDegreePrograms(degreeProgramData);
    }
  }, [selectedService, degreeProgramData]);

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
    setFormData({
      ...formData,
      service: newValue?._id || ''
    });
  };

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    setFormData({
      ...formData,
      business_service: newValue?._id || ''
    });
  };

  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
    setFormData({
      ...formData,
      degree_program: newValue?._id || ''
    });
  };

  const handleCollegeChange = (_, newValue) => {
    setSelectedCollege(newValue);
    setFormData({
      ...formData,
      college: newValue?._id || null
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle changes to the current vertical being edited
  const handleVerticalChange = (e) => {
    const { name, value } = e.target;
    setCurrentVertical({
      ...currentVertical,
      [name]: value
    });
  };

  // Add prerequisite to the current vertical
  const addPrerequisite = () => {
    if (prerequisite.trim()) {
      setCurrentVertical({
        ...currentVertical,
        prerequisites: [...currentVertical.prerequisites, prerequisite.trim()]
      });
      setPrerequisite('');
    }
  };

  // Remove prerequisite from current vertical
  const removePrerequisite = (index) => {
    const newPrerequisites = [...currentVertical.prerequisites];
    newPrerequisites.splice(index, 1);
    setCurrentVertical({
      ...currentVertical,
      prerequisites: newPrerequisites
    });
  };

  // Add core subject to the current vertical
  const addCoreSubject = () => {
    if (coreSubject.trim()) {
      setCurrentVertical({
        ...currentVertical,
        coreSubjects: [...currentVertical.coreSubjects, coreSubject.trim()]
      });
      setCoreSubject('');
    }
  };

  // Remove core subject from current vertical
  const removeCoreSubject = (index) => {
    const newCoreSubjects = [...currentVertical.coreSubjects];
    newCoreSubjects.splice(index, 1);
    setCurrentVertical({
      ...currentVertical,
      coreSubjects: newCoreSubjects
    });
  };

  // Add or update the current vertical to the form data
  const addVertical = () => {
    if (currentVertical.vertical && currentVertical.name && currentVertical.batchSize) {
      if (isEditing) {
        // Update existing vertical
        const updatedVerticals = [...formData.skillVerticals];
        updatedVerticals[editingIndex] = currentVertical;
        setFormData({
          ...formData,
          skillVerticals: updatedVerticals
        });
        setIsEditing(false);
        setEditingIndex(-1);
        setSnackbar({ open: true, message: "Skill vertical updated successfully!", severity: "success" });
      } else {
        // Add new vertical
        setFormData({
          ...formData,
          skillVerticals: [...formData.skillVerticals, currentVertical]
        });
        setSnackbar({ open: true, message: "Skill vertical added!", severity: "success" });
      }

      // Reset current vertical
      setCurrentVertical({
        vertical: '',
        name: '',
        batchSize: '',
        prerequisites: [],
        coreSubjects: []
      });
    }
  };

  // Start editing a vertical
  const editVertical = (index) => {
    // Load the vertical data into the form at the top
    setCurrentVertical({ ...formData.skillVerticals[index] });
    setIsEditing(true);
    setEditingIndex(index);

    // Scroll to the top form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Show message to user
    setSnackbar({
      open: true,
      message: "Editing skill vertical. Make changes and click 'Update Skill Vertical'",
      severity: "info"
    });
  };

  // Remove a vertical from the form data
  const removeVertical = (index) => {
    const newSkillVerticals = [...formData.skillVerticals];
    newSkillVerticals.splice(index, 1);
    setFormData({
      ...formData,
      skillVerticals: newSkillVerticals
    });

    // If removing the vertical being edited, reset the edit mode
    if (index === editingIndex) {
      setIsEditing(false);
      setEditingIndex(-1);
      setCurrentVertical({
        vertical: '',
        name: '',
        batchSize: '',
        prerequisites: [],
        coreSubjects: []
      });
    }
  };

  // Submit the form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const skillVerticalData = {
        programName: formData.programName,
        service: selectedService?._id,
        business_service: selectedBusinessService?._id,
        degree_program: selectedProgram?._id,
        college: selectedCollege?._id,
        skillVerticals: formData.skillVerticals
      };

      await dispatch(createSkillVertical(skillVerticalData));
      setSnackbar({ open: true, message: "Skill vertical created successfully!", severity: "success" });
      setTimeout(() => {
        navigate('/degreeprogram/skill-vertical-control');
      }, 1500);
      // Reset form after successful submission
      setFormData({
        programName: 'Industry Driven MCA Program',
        service: '',
        business_service: '',
        degree_program: '',
        college: null,
        skillVerticals: []
      });

      setSelectedService(null);
      setSelectedBusinessService(null);
      setSelectedProgram(null);
      setSelectedCollege(null);

    } catch (error) {
      setSnackbar({ open: true, message: "Failed to create skill vertical.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <LeftNavigationBar
      Content={
        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 4 }}>
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
            >              Create Skill Vertical
            </Typography>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Program Name"
                        name="programName"
                        value={formData.programName}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="business-services"
                          options={businessServiceData || []}
                          getOptionLabel={(option) => option?.name || ""}
                          value={selectedBusinessService}
                          onChange={handleBussinessServiceChange}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Business Services"
                              fullWidth
                              required
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="service"
                          options={filteredServices || []}
                          getOptionLabel={(option) => option?.title || ""}
                          value={selectedService}
                          onChange={handleServiceChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Service"
                              fullWidth
                              required
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="degree_program"
                          options={filteredDegreePrograms || []}
                          getOptionLabel={(option) =>
                            option ? option.program_name : ""
                          }
                          value={selectedProgram}
                          onChange={handleProgramChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Program"
                              fullWidth
                              required
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="college"
                          options={collegeData || []}
                          getOptionLabel={(option) => (option ? option.collegeName : "")}
                          value={selectedCollege}
                          onChange={handleCollegeChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="College"
                              fullWidth
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {isEditing ? 'Update' : 'Add'} Skill Vertical
                </Typography>

                <Paper sx={{ p: 3, mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Vertical Category"
                        name="vertical"
                        value={currentVertical.vertical}
                        onChange={handleVerticalChange}
                        placeholder="e.g., Software Development"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Vertical Name"
                        name="name"
                        value={currentVertical.name}
                        onChange={handleVerticalChange}
                        placeholder="e.g., Full Stack Development"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Batch Size"
                        name="batchSize"
                        type="number" // Set the input type to number
                        value={currentVertical.batchSize}
                        onChange={handleVerticalChange}
                        placeholder="e.g., 30 students"
                        inputProps={{
                          min: 1, // Optional: Set a minimum value
                          step: 1 // Optional: Set step to 1 for whole numbers
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" style={{ display: 'flex' }} gutterBottom>
                        Prerequisites
                        <Tooltip title="Click the plus button to add a prerequisite" arrow>
                          <span
                            style={{
                              marginLeft: '4px',
                              marginTop: "3px",
                              cursor: 'pointer',
                              backgroundColor: 'gray',
                              color: 'white', // Change text color to white for better contrast
                              borderRadius: '50%', // Make it circular
                              width: '20px', // Set width
                              height: '20px', // Set height
                              display: 'flex', // Use flexbox to center the content
                              alignItems: 'center', // Center vertically
                              justifyContent: 'center', // Center horizontally
                              fontSize: '14px' // Adjust font size
                            }}
                          >?</span> {/* Question mark icon */}
                        </Tooltip>
                      </Typography>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <TextField
                          fullWidth
                          placeholder="Add prerequisite"
                          value={prerequisite}
                          onChange={(e) => setPrerequisite(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                        />
                        <IconButton onClick={addPrerequisite} color="primary">
                          <AddIcon />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {currentVertical.prerequisites.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            onDelete={() => removePrerequisite(index)}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" style={{ display: 'flex' }} gutterBottom>
                        Core Subjects
                        <Tooltip title="Click the plus button to add a core subject" arrow>
                          <span
                            style={{
                              marginLeft: '4px',
                              marginTop: "3px",
                              cursor: 'pointer',
                              backgroundColor: 'gray',
                              color: 'white', // Change text color to white for better contrast
                              borderRadius: '50%', // Make it circular
                              width: '20px', // Set width
                              height: '20px', // Set height
                              display: 'flex', // Use flexbox to center the content
                              alignItems: 'center', // Center vertically
                              justifyContent: 'center', // Center horizontally
                              fontSize: '14px' // Adjust font size
                            }}                          >?</span> {/* Question mark icon */}
                        </Tooltip>
                      </Typography>

                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <TextField
                          fullWidth
                          placeholder="Add core subject"
                          value={coreSubject}
                          onChange={(e) => setCoreSubject(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCoreSubject())}
                        />
                        <IconButton onClick={addCoreSubject} color="primary">
                          <AddIcon />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {currentVertical.coreSubjects.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            onDelete={() => removeCoreSubject(index)}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={addVertical}
                          disabled={
                            !currentVertical.vertical ||
                            !currentVertical.name ||
                            !currentVertical.batchSize ||
                            currentVertical.prerequisites.length === 0 || // Check if prerequisites array has at least one item
                            currentVertical.coreSubjects.length === 0 // Check if coreSubjects array has at least one item
                          }
                        >
                          {isEditing ? 'Update Skill Vertical' : 'Add Skill Vertical'}
                        </Button>

                        {isEditing && (
                          <Button
                            variant="outlined"
                            sx={{ ml: 2 }}
                            onClick={() => {
                              setIsEditing(false);
                              setEditingIndex(-1);
                              setCurrentVertical({
                                vertical: '',
                                name: '',
                                batchSize: '',
                                prerequisites: [],
                                coreSubjects: []
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        )}

                        <Tooltip title="Click to add the skill vertical" arrow>
                          <span
                            style={{
                              marginLeft: '8px', // Space between button and question mark
                              cursor: 'pointer',
                              backgroundColor: 'gray',
                              color: 'white', // Change text color to white for better contrast
                              borderRadius: '50%', // Make it circular
                              width: '20px', // Set width
                              height: '20px', // Set height
                              display: 'flex', // Use flexbox to center the content
                              alignItems: 'center', // Center vertically
                              justifyContent: 'center', // Center horizontally
                              fontSize: '14px' // Adjust font size
                            }}
                          >
                            ?
                          </span>
                        </Tooltip>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {formData.skillVerticals.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Added Skill Verticals
                    </Typography>

                    {formData.skillVerticals.map((vertical, index) => (
                      <Paper key={index} sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {vertical.name} ({vertical.vertical})
                          </Typography>
                          <Box>
                            {/* Edit icon positioned to the left of the delete icon */}
                            <IconButton
                              onClick={() => editVertical(index)}
                              color="primary"
                              size="small"
                              sx={{ mr: 1 }}
                              aria-label="edit skill vertical"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => removeVertical(index)}
                              color="error"
                              size="small"
                              aria-label="delete skill vertical"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        <Typography variant="body2">Batch Size: {vertical.batchSize}</Typography>

                        <Divider sx={{ my: 1 }} />

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight="bold">Prerequisites:</Typography>
                            {vertical.prerequisites.length > 0 ? (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                {vertical.prerequisites.map((item, idx) => (
                                  <Chip key={idx} label={item} size="small" />
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">None</Typography>
                            )}
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight="bold">Core Subjects:</Typography>
                            {vertical.coreSubjects.length > 0 ? (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                {vertical.coreSubjects.map((item, idx) => (
                                  <Chip key={idx} label={item} size="small" />
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">None</Typography>
                            )}
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Box>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading || formData.skillVerticals.length === 0 ||
                      !selectedService || !selectedBusinessService || !selectedProgram}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
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
      } />
  );
};

export default SkillVerticalAddForm;