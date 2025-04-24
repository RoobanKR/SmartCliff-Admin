import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Tooltip,
  useTheme,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Delete, HelpOutline } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import {
  fetchPlacementTrainingTrackById,
  updatePlacementTrainingTrack,
} from "../../../redux/slices/services/placementTrainingTrack/placementTrainingTrack";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

const PlacementTrainingTrackEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const [formData, setFormData] = useState({
    trackName: "",
    proposedHour: "",
    noOfDays: "",
    targetSemester: [],
    objecttive: "",
    trainingModuleLevels: [],
    trainingModuleSummary: [],
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );

  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [service, setService] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
  }, [dispatch]);

  const trackDetails = useSelector((state) =>
    state.placementTrainingTrack.tracks.find((t) => t._id === id)
  );

  useEffect(() => {
    if (!trackDetails) {
      dispatch(fetchPlacementTrainingTrackById(id));
    }
  }, [dispatch, id, trackDetails]);

  useEffect(() => {
    if (trackDetails) {
      // Create deep copies of arrays to avoid modifying Redux state directly
      const modulelevels = trackDetails.trainingModuleLevels ?
        JSON.parse(JSON.stringify(trackDetails.trainingModuleLevels)) : [];

      const moduleSummary = trackDetails.trainingModuleSummary ?
        JSON.parse(JSON.stringify(trackDetails.trainingModuleSummary)) : [];

      const targetSem = trackDetails.targetSemester ?
        [...trackDetails.targetSemester] : [];

      setFormData({
        trackName: trackDetails.trackName || "",
        proposedHour: trackDetails.proposedHour || "",
        noOfDays: trackDetails.noOfDays || "",
        targetSemester: targetSem,
        objecttive: trackDetails.objecttive || "",
        trainingModuleLevels: modulelevels,
        trainingModuleSummary: moduleSummary,
      });

      setSelectedBusinessService(trackDetails.business_service || null);
      setService(trackDetails.service || null);
    }
  }, [trackDetails]);

  useEffect(() => {
    if (selectedBusinessService) {
      setFilteredServices(
        serviceData.filter(
          (service) =>
            service.business_services?._id === selectedBusinessService._id
        )
      );
    } else {
      setFilteredServices([]);
    }
  }, [selectedBusinessService, serviceData]);

  const handleBusinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    setService(null);
  };

  const handleServiceChange = (_, newValue) => {
    setService(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox change for semesters
  const handleSemesterChange = (semester) => {
    setFormData((prevData) => {
      const currentTargetSemesters = [...prevData.targetSemester];

      if (currentTargetSemesters.includes(semester)) {
        // Remove semester if already selected
        return {
          ...prevData,
          targetSemester: currentTargetSemesters.filter(sem => sem !== semester)
        };
      } else {
        // Add semester if not selected
        return {
          ...prevData,
          targetSemester: [...currentTargetSemesters, semester]
        };
      }
    });
  };

  const handleModuleChange = (levelIndex, moduleIndex, field, value) => {
    setFormData(prevFormData => {
      // Create a deep copy of the training module levels
      const newModules = JSON.parse(JSON.stringify(prevFormData.trainingModuleLevels));

      // Update the specific field
      newModules[levelIndex].modules[moduleIndex][field] = value;

      // Return the updated form data
      return { ...prevFormData, trainingModuleLevels: newModules };
    });
  };

  const handleSummaryChange = (summaryIndex, field, value) => {
    setFormData(prevFormData => {
      // Create a deep copy of the training module summary
      const newSummary = JSON.parse(JSON.stringify(prevFormData.trainingModuleSummary));

      // Update the specific field
      newSummary[summaryIndex][field] = value;

      // Return the updated form data
      return { ...prevFormData, trainingModuleSummary: newSummary };
    });
  };

  const addModuleLevel = () => {
    setFormData({
      ...formData,
      trainingModuleLevels: [
        ...formData.trainingModuleLevels,
        {
          modules: [
            {
              modulename: "",
              TrainingComponentInHours: "",
              TrainingComponentInDays: "",
            },
          ],
        },
      ],
    });
  };

  const removeModuleLevel = (index) => {
    const newLevels = [...formData.trainingModuleLevels];
    newLevels.splice(index, 1);
    setFormData({ ...formData, trainingModuleLevels: newLevels });
  };

  const addModule = (levelIndex) => {
    setFormData((prevFormData) => {
      // Create a deep copy of the training module levels
      const newTrainingModuleLevels = JSON.parse(JSON.stringify(prevFormData.trainingModuleLevels));

      // Add a new module to the specified level
      newTrainingModuleLevels[levelIndex].modules.push({
        modulename: "",
        TrainingComponentInHours: "",
        TrainingComponentInDays: "",
      });

      // Return the updated form data
      return { ...prevFormData, trainingModuleLevels: newTrainingModuleLevels };
    });
  };

  const removeModule = (levelIndex, moduleIndex) => {
    setFormData(prevFormData => {
      // Create a deep copy of the training module levels
      const newModules = JSON.parse(JSON.stringify(prevFormData.trainingModuleLevels));

      // Remove the specified module
      newModules[levelIndex].modules.splice(moduleIndex, 1);

      // Return the updated form data
      return { ...prevFormData, trainingModuleLevels: newModules };
    });
  };

  const addSummary = () => {
    setFormData({
      ...formData,
      trainingModuleSummary: [
        ...formData.trainingModuleSummary,
        {
          moduleLevel: "",
          TrainingInHours: "",
          TrainingInDays: "",
          remarks: "",
        },
      ],
    });
  };

  const removeSummary = (index) => {
    setFormData(prevFormData => {
      // Create a deep copy of the training module summary
      const newSummary = JSON.parse(JSON.stringify(prevFormData.trainingModuleSummary));

      // Remove the specified summary
      newSummary.splice(index, 1);

      // Return the updated form data
      return { ...prevFormData, trainingModuleSummary: newSummary };
    });
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (
      !formData.trackName.trim() ||
      !formData.proposedHour ||
      !formData.noOfDays ||
      !service
    ) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    const updatedData = {
      ...formData,
      service: service?._id,
      business_service: selectedBusinessService?._id,
    };

    dispatch(updatePlacementTrainingTrack({ id, updatedData }))
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: "Training track updated successfully!",
          severity: "success",
        });

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/Placement-Training-Track-control");
        }, 1500);
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: `Failed to update training track: ${error}`,
          severity: "error",
        });
      })
      .finally(() => setLoading(false));
  };

  // List of available semesters
  const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  if (!trackDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={0}>
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
                  Training Track Edit Form
                </Typography>

                <Tooltip
                  title="This is where you can edit the training track details."
                  arrow
                >
                  <HelpOutline
                    sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }}
                  />
                </Tooltip>
              </Box>
            </Box>
            <Paper
              elevation={0}
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <FormControl fullWidth>
                  <Autocomplete
                    id="business-services"
                    options={businessServiceData || []}
                    getOptionLabel={(option) => option?.name || ""}
                    value={selectedBusinessService}
                    onChange={handleBusinessServiceChange}
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Business Services"
                        fullWidth
                      />
                    )}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <Autocomplete
                    id="service"
                    options={filteredServices || []}
                    getOptionLabel={(option) => option?.title || ""}
                    value={service}
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
                <TextField
                  label="Track Name"
                  name="trackName"
                  value={formData.trackName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Proposed Hours"
                  name="proposedHour"
                  type="number"
                  value={formData.proposedHour}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="No of Days"
                  name="noOfDays"
                  type="number"
                  value={formData.noOfDays}
                  onChange={handleChange}
                  required
                />

                {/* Target Semester using Checkboxes */}
                <FormControl component="fieldset">
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Target Semester
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: "#f9f9f9",
                      display: "flex",
                      flexWrap: "wrap"
                    }}
                  >
                    <FormGroup row>
                      {semesters.map((semester) => (
                        <FormControlLabel
                          key={semester}
                          control={
                            <Checkbox
                              checked={formData.targetSemester.includes(semester)}
                              onChange={() => handleSemesterChange(semester)}
                              name={semester}
                            />
                          }
                          label={`Semester ${semester}`}
                          sx={{ width: "25%", minWidth: "150px" }}
                        />
                      ))}
                    </FormGroup>
                  </Paper>
                </FormControl>

                <TextField
                  label="Objective"
                  name="objecttive"
                  multiline
                  rows={3}
                  value={formData.objecttive}
                  onChange={handleChange}
                  required
                />

                {/* Training Module Levels */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  Training Module Levels
                </Typography>
                {formData.trainingModuleLevels.map((level, levelIndex) => (
                  <Paper
                    key={levelIndex}
                    sx={{
                      padding: 2,
                      backgroundColor: "#f9f9f9",
                      position: "relative",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1">
                      Module Level {levelIndex + 1}
                    </Typography>

                    {/* Modules Inside a Level */}
                    {level.modules.map((module, moduleIndex) => (
                      <Box
                        key={moduleIndex}
                        sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}
                      >
                        <TextField
                          label="Module Name"
                          value={module.modulename}
                          onChange={(e) =>
                            handleModuleChange(
                              levelIndex,
                              moduleIndex,
                              "modulename",
                              e.target.value
                            )
                          }
                          required
                          sx={{ flexGrow: 1, minWidth: "200px" }}
                        />
                        <TextField
                          label="Hours"
                          type="number"
                          value={module.TrainingComponentInHours}
                          onChange={(e) =>
                            handleModuleChange(
                              levelIndex,
                              moduleIndex,
                              "TrainingComponentInHours",
                              e.target.value
                            )
                          }
                          required
                          sx={{ width: "100px" }}
                        />
                        <TextField
                          label="Days"
                          type="number"
                          value={module.TrainingComponentInDays}
                          onChange={(e) =>
                            handleModuleChange(
                              levelIndex,
                              moduleIndex,
                              "TrainingComponentInDays",
                              e.target.value
                            )
                          }
                          required
                          sx={{ width: "100px" }}
                        />
                        <IconButton
                          onClick={() => removeModule(levelIndex, moduleIndex)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ))}

                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => addModule(levelIndex)}
                        size="small"
                      >
                        Add Module
                      </Button>
                      <IconButton
                        onClick={() => removeModuleLevel(levelIndex)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addModuleLevel}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Add Module Level
                </Button>

                {/* Training Module Summary Section */}
                <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                  Training Module Summary
                </Typography>
                {formData.trainingModuleSummary.map((summary, summaryIndex) => (
                  <Paper
                    key={summaryIndex}
                    sx={{
                      padding: 2,
                      backgroundColor: "#f0f7ff",
                      position: "relative",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1">
                      Summary {summaryIndex + 1}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 1,
                      }}
                    >
                      <TextField
                        label="Module Level"
                        value={summary.moduleLevel}
                        onChange={(e) =>
                          handleSummaryChange(
                            summaryIndex,
                            "moduleLevel",
                            e.target.value
                          )
                        }
                        required
                      />
                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField
                          label="Training Hours"
                          type="number"
                          value={summary.TrainingInHours}
                          onChange={(e) =>
                            handleSummaryChange(
                              summaryIndex,
                              "TrainingInHours",
                              e.target.value
                            )
                          }
                          required
                          sx={{ width: "48%" }}
                        />
                        <TextField
                          label="Training Days"
                          type="number"
                          value={summary.TrainingInDays}
                          onChange={(e) =>
                            handleSummaryChange(
                              summaryIndex,
                              "TrainingInDays",
                              e.target.value
                            )
                          }
                          required
                          sx={{ width: "48%" }}
                        />
                      </Box>
                      <TextField
                        label="Remarks"
                        multiline
                        rows={2}
                        value={summary.remarks}
                        onChange={(e) =>
                          handleSummaryChange(
                            summaryIndex,
                            "remarks",
                            e.target.value
                          )
                        }
                        required
                      />
                      <IconButton
                        onClick={() => removeSummary(summaryIndex)}
                        sx={{ position: "absolute", top: 5, right: 5 }}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addSummary}
                  sx={{ alignSelf: "flex-start", mb: 3 }}
                >
                  Add Summary
                </Button>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: theme.palette.warning.main,
                    color: theme.palette.warning.contrastText,
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    mt: 3, // optional: top margin
                    "&:hover": {
                      backgroundColor: theme.palette.warning.dark,
                    },
                  }}
                >
                  {loading ? "Updating..." : "Update Training Track"}
                </Button>
              </Box>
            </Paper>
          </Paper>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      }
    />
  );
};

export default PlacementTrainingTrackEditForm;