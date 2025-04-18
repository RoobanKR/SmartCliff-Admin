import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Autocomplete,
  FormControl,
  InputLabel,
  Tooltip,
  useTheme,
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
      setFormData({
        trackName: trackDetails.trackName || "",
        proposedHour: trackDetails.proposedHour || "",
        noOfDays: trackDetails.noOfDays || "",
        targetSemester: trackDetails.targetSemester || [],
        objecttive: trackDetails.objecttive || "",
        trainingModuleLevels: trackDetails.trainingModuleLevels || [],
        trainingModuleSummary: trackDetails.trainingModuleSummary || [],
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

  const handleSemesterChange = (event) => {
    setFormData({ ...formData, targetSemester: event.target.value });
  };

  const handleModuleChange = (levelIndex, moduleIndex, field, value) => {
    const newModules = [...formData.trainingModuleLevels];
    newModules[levelIndex].modules[moduleIndex][field] = value;
    setFormData({ ...formData, trainingModuleLevels: newModules });
  };

  const handleSummaryChange = (summaryIndex, field, value) => {
    const newSummary = [...formData.trainingModuleSummary];
    newSummary[summaryIndex][field] = value;
    setFormData({ ...formData, trainingModuleSummary: newSummary });
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
      const newTrainingModuleLevels = prevFormData.trainingModuleLevels.map(
        (level, idx) =>
          idx === levelIndex
            ? {
                ...level,
                modules: [
                  ...level.modules,
                  {
                    modulename: "",
                    TrainingComponentInHours: "",
                    TrainingComponentInDays: "",
                  },
                ],
              }
            : level
      );

      return { ...prevFormData, trainingModuleLevels: newTrainingModuleLevels };
    });
  };

  const removeModule = (levelIndex, moduleIndex) => {
    const newModules = [...formData.trainingModuleLevels];
    newModules[levelIndex].modules.splice(moduleIndex, 1);
    setFormData({ ...formData, trainingModuleLevels: newModules });
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
    const newSummary = [...formData.trainingModuleSummary];
    newSummary.splice(index, 1);
    setFormData({ ...formData, trainingModuleSummary: newSummary });
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
      alert("Please fill all required fields");
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
        alert("Training track updated successfully!");
        navigate("/Placement-Training-Track-control");
      })
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  };

  if (!trackDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <LeftNavigationBar
      Content={
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={2}
            mb={1}
          >
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: "Merriweather, serif",
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
              Training Track <br /> Edit Form
            </Typography>

            <Tooltip
              title="This is where you can add the execution count for the service."
              arrow
            >
              <HelpOutline
                sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }}
              />
            </Tooltip>
          </Box>
          <Paper
            elevation={0}
            sx={{ padding: 2, maxWidth: 800, margin: "auto" }}
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
              <Select
                multiple
                value={formData.targetSemester}
                onChange={handleSemesterChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Semester
                </MenuItem>
                {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map(
                  (sem) => (
                    <MenuItem key={sem} value={sem}>
                      {sem}
                    </MenuItem>
                  )
                )}
              </Select>
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
              {formData.trainingModuleLevels.map((level, levelIndex) => (
                <Paper
                  key={levelIndex}
                  sx={{
                    padding: 2,
                    backgroundColor: "#f9f9f9",
                    position: "relative",
                  }}
                >
                  <Typography variant="h6">
                    Module Level {levelIndex + 1}
                  </Typography>
                  {level.modules.map((module, moduleIndex) => (
                    <Box
                      key={moduleIndex}
                      sx={{ display: "flex", gap: 2, mt: 1 }}
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
                      />
                      <IconButton
                        onClick={() => removeModule(levelIndex, moduleIndex)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => addModule(levelIndex)}
                    sx={{ mt: 2 }}
                  >
                    Add Module
                  </Button>
                  <IconButton
                    onClick={() => removeModuleLevel(levelIndex)}
                    sx={{ position: "absolute", top: 5, right: 5 }}
                  >
                    <Delete />
                  </IconButton>
                </Paper>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addModuleLevel}
              >
                Add Module Level
              </Button>

              {/* Training Module Summary Section */}
              <Typography variant="h6" sx={{ mt: 4 }}>
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

              <Button
                type="submit"
                variant="contained"
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
                Submit Training Track
              </Button>
            </Box>
          </Paper>
        </>
      }
    />
  );
};

export default PlacementTrainingTrackEditForm;
