
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
  Snackbar,
  Alert,
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
import { useNavigate, useParams } from 'react-router-dom';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { getSkillVerticalById, updateSkillVertical } from '../../../redux/slices/mca/skillVertical/skillVertical';
import { HelpOutline } from '@mui/icons-material';

const SkillVerticalEditForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL parameters

  const [prerequisite, setPrerequisite] = useState('');
  const [coreSubject, setCoreSubject] = useState('');

  const [loading, setLoading] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);



  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );

  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
  const collegeData = useSelector((state) => state.college.colleges);
  const skillVerticalData = useSelector((state) => state.skillVertical.selectedSkillVertical); // Fetch the skill vertical data

  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredDegreePrograms, setFilteredDegreePrograms] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);

  const [formData, setFormData] = useState({
    programName: 'Industry Driven MCA Program',
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
      await dispatch(fetchServices());
      await dispatch(getAllBussinessServices());
      await dispatch(fetchDegreeProgramData());
      await dispatch(getAllColleges());

      // If an ID is provided, fetch the existing skill vertical data
      if (id) {
        await dispatch(getSkillVerticalById(id)); // Fetch the skill vertical by ID
      }
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    if (skillVerticalData) {
      // Populate the form with the fetched skill vertical data
      setFormData({
        programName: skillVerticalData.programName,
        service: skillVerticalData.service,
        business_service: skillVerticalData.business_service,
        degree_program: skillVerticalData.degree_program,
        college: skillVerticalData.college,
        skillVerticals: skillVerticalData.skillVerticals || []
      });

      // Set selected values for dropdowns
      setSelectedBusinessService(skillVerticalData.business_service);
      setSelectedService(skillVerticalData.service);
      setSelectedProgram(skillVerticalData.degree_program);
      setSelectedCollege(skillVerticalData.college);
    }
  }, [skillVerticalData]);

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
    setSelectedService(newValue || null); // Ensure null instead of undefined
    setFormData({
      ...formData,
      service: newValue?._id || ''
    });
  };

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue || null); // Ensure null instead of undefined
    setFormData({
      ...formData,
      business_service: newValue?._id || ''
    });
  };

  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue || null); // Ensure null instead of undefined
    setFormData({
      ...formData,
      degree_program: newValue?._id || ''
    });
  };

  const handleCollegeChange = (_, newValue) => {
    setSelectedCollege(newValue || null); // Ensure null instead of undefined
    setFormData({
      ...formData,
      college: newValue?._id || null
    });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleVerticalChange = (e) => {
    const { name, value } = e.target;
    setCurrentVertical({
      ...currentVertical,
      [name]: value
    });
  };

  const addPrerequisite = () => {
    if (prerequisite.trim()) {
      setCurrentVertical({
        ...currentVertical,
        prerequisites: [...currentVertical.prerequisites, prerequisite.trim()]
      });
      setPrerequisite('');
    }
  };

  const removePrerequisite = (index) => {
    const newPrerequisites = [...currentVertical.prerequisites];
    newPrerequisites.splice(index, 1);
    setCurrentVertical({
      ...currentVertical,
      prerequisites: newPrerequisites
    });
  };

  const addCoreSubject = () => {
    if (coreSubject.trim()) {
      setCurrentVertical({
        ...currentVertical,
        coreSubjects: [...currentVertical.coreSubjects, coreSubject.trim()]
      });
      setCoreSubject('');
    }
  };

  const removeCoreSubject = (index) => {
    const newCoreSubjects = [...currentVertical.coreSubjects];
    newCoreSubjects.splice(index, 1);
    setCurrentVertical({
      ...currentVertical,
      coreSubjects: newCoreSubjects
    });
  };

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
      }

      // Reset form
      setCurrentVertical({
        vertical: '',
        name: '',
        batchSize: '',
        prerequisites: [],
        coreSubjects: []
      });
    }
  };

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Create payload with proper null checks
      const skillVerticalData = {
        programName: formData.programName || "Industry Driven MCA Program",
        service: selectedService?._id || null,
        business_service: selectedBusinessService?._id || null,
        degree_program: selectedProgram?._id || null,
        college: selectedCollege?._id || null,
        skillVerticals: formData.skillVerticals || []
      };

      console.log("Updating Skill Vertical with data:", skillVerticalData);

      if (id) {
        // Dispatch the update action without using await
        dispatch(updateSkillVertical({ id, formData: skillVerticalData }))
          .unwrap() // This properly unwraps the Promise from the async thunk
          .then((updatedSkillVertical) => {
            // Success case
            console.log("Update successful:", updatedSkillVertical);
            setSnackbar({
              open: true,
              message: "Skill vertical updated successfully!",
              severity: "success"
            });

            // Navigate after update
            setTimeout(() => {
              navigate('/degreeprogram/skill-vertical-control');
            }, 1500);
          })
          .catch((error) => {
            // Error case
            console.error("Update failed:", error);
            setSnackbar({
              open: true,
              message: error.message || "Failed to update skill vertical.",
              severity: "error"
            });
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        throw new Error("No ID provided for update operation");
      }
    } catch (error) {
      console.error("Error in handleSubmit setup:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to create or update skill vertical.",
        severity: "error"
      });
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };


  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Box >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              mt={2}
              mb={2}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
              >
                Back
              </Button>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flex: 1
              }}>
                <Typography
                  variant="h4"
                  sx={{
                    position: "relative",
                    padding: 0,
                    margin: 0,
                    fontWeight: 300,
                    fontSize: { xs: "32px", sm: "40px" },
                    color: "#747474",
                    textAlign: "center",
                    textTransform: "uppercase",
                    paddingBottom: "5px",
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
                  Skill Vertical Edit Form
                </Typography>

                <Tooltip
                  title="This is where you can edit degree program details and images."
                  arrow
                >
                  <HelpOutline
                    sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }}
                  />
                </Tooltip>
              </Box>
            </Box>

            <form
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
              onSubmit={handleSubmit}>
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
                            option?._id === value?._id
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
                          isOptionEqualToValue={(option, value) =>
                            option?._id === value?._id
                          }
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
                            currentVertical.prerequisites.length === 0 ||
                            currentVertical.coreSubjects.length === 0
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
                            <Button
                              onClick={() => editVertical(index)}
                              color="primary"
                              size="small"
                              sx={{ mr: 1 }}
                              variant="outlined"

                              aria-label="edit skill vertical"
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              onClick={() => removeVertical(index)}
                              color="error"
                              size="small"
                              variant="outlined"
                              aria-label="delete skill vertical"
                            >
                              <DeleteIcon />
                            </Button>
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
                    style={{
                      display: "block",
                      margin: "24px auto 0", // centers the button horizontally
                      backgroundColor: "#ff6d00", // orange
                      color: "#fff",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                    disabled={loading || formData.skillVerticals.length === 0 ||
                      !selectedService || !selectedBusinessService || !selectedProgram}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Update Skill Vertical'}
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
      }
    />
  );
};

export default SkillVerticalEditForm;