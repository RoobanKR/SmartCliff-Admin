import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { createPlacementTrainingTrack } from "../../../redux/slices/services/placementTrainingTrack/placementTrainingTrack";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

const PlacementTrainingTrackAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trackName: "",
    proposedHour: "",
    noOfDays: "",
    targetSemester: [],
    objecttive: "",
    trainingModuleLevels: [
      { modules: [{ modulename: "", TrainingComponentInHours: "", TrainingComponentInDays: "" }] },
    ],
    trainingModuleSummary: [
      { moduleLevel: "", TrainingInHours: "", TrainingInDays: "", remarks: "" }
    ],
  });

  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);
  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector((state) => state.businessService.businessServiceData);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
  }, [dispatch]);

  useEffect(() => {
    if (businessServiceData.length > 0 && selectedBusinessService) {
      const matchedService = businessServiceData.find(
        (service) => service._id === selectedBusinessService._id
      );
      setSelectedBusinessService(matchedService || null);
    }
  }, [businessServiceData, selectedBusinessService]);

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    if (newValue) {
      const filtered = serviceData.filter(
        (service) => service.business_services?._id === newValue._id
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSemesterChange = (event) => {
    setFormData({ ...formData, targetSemester: event.target.value });
  };

  const handleModuleChange = (levelIndex, moduleIndex, field, value) => {
    const newModules = [...formData.trainingModuleLevels];
    newModules[levelIndex].modules[moduleIndex][field] = value;
    setFormData({ ...formData, trainingModuleLevels: newModules });
  };

  // New handler for summary fields
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
        { modules: [{ modulename: "", TrainingComponentInHours: "", TrainingComponentInDays: "" }] },
      ],
    });
  };

  const removeModuleLevel = (index) => {
    const newLevels = [...formData.trainingModuleLevels];
    newLevels.splice(index, 1);
    setFormData({ ...formData, trainingModuleLevels: newLevels });
  };

  const addModule = (levelIndex) => {
    const newModules = [...formData.trainingModuleLevels];
    newModules[levelIndex].modules.push({
      modulename: "",
      TrainingComponentInHours: "",
      TrainingComponentInDays: "",
    });
    setFormData({ ...formData, trainingModuleLevels: newModules });
  };

  const removeModule = (levelIndex, moduleIndex) => {
    const newModules = [...formData.trainingModuleLevels];
    newModules[levelIndex].modules.splice(moduleIndex, 1);
    setFormData({ ...formData, trainingModuleLevels: newModules });
  };

  // New functions for summary management
  const addSummary = () => {
    setFormData({
      ...formData,
      trainingModuleSummary: [
        ...formData.trainingModuleSummary,
        { moduleLevel: "", TrainingInHours: "", TrainingInDays: "", remarks: "" }
      ],
    });
  };

  const removeSummary = (index) => {
    const newSummary = [...formData.trainingModuleSummary];
    newSummary.splice(index, 1);
    setFormData({ ...formData, trainingModuleSummary: newSummary });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the selected business service and service are included in the payload
    const payload = {
      ...formData,
      business_service: selectedBusinessService ? selectedBusinessService._id : null,
      service: selectedService ? selectedService._id : null,
    };

    try {
      await dispatch(createPlacementTrainingTrack(payload)).unwrap();
      alert("Training track created successfully!");

      // Reset form
      setFormData({
        trackName: "",
        proposedHour: "",
        noOfDays: "",
        targetSemester: [],
        objecttive: "",
        trainingModuleLevels: [
          { modules: [{ modulename: "", TrainingComponentInHours: "", TrainingComponentInDays: "" }] },
        ],
        trainingModuleSummary: [
          { moduleLevel: "", TrainingInHours: "", TrainingInDays: "", remarks: "" }
        ],
      });
      setSelectedService(null);
      setSelectedBusinessService(null);
      setFilteredServices([]);

      // Redirect to the next page after successful submission
      navigate("/Placement-Training-Track-control");
    } catch (error) {
      console.error("Error creating training track:", error);
      alert("Failed to create training track. Please try again.");
    }
  };
    
  return (
    <LeftNavigationBar
      Content={
        <Paper sx={{ padding: 3, maxWidth: 800, margin: "auto", mt: 4 }}>
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
            Create Placement Training Track
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth>
              <Autocomplete
                id="Business Services"
                options={businessServiceData || []}
                getOptionLabel={(option) => option?.name || ""}
                value={selectedBusinessService}
                onChange={handleBussinessServiceChange}
                renderInput={(params) => <TextField {...params} label="Business Services" variant="outlined" />}
              />
            </FormControl>

            <FormControl fullWidth>
              <Autocomplete
                id="service"
                options={filteredServices || []}
                getOptionLabel={(option) => option?.title || ""}
                value={selectedService}
                onChange={handleServiceChange}
                renderInput={(params) => <TextField {...params} label="Service" variant="outlined" required />}
              />
            </FormControl>
            
            {/* Track Name */}
            <TextField label="Track Name" name="trackName" value={formData.trackName} onChange={handleChange} required />

            {/* Proposed Hours */}
            <TextField label="Proposed Hours" name="proposedHour" type="number" value={formData.proposedHour} onChange={handleChange} required />

            {/* No of Days */}
            <TextField label="No of Days" name="noOfDays" type="number" value={formData.noOfDays} onChange={handleChange} required />

            {/* Target Semester */}
            <FormControl fullWidth>
              <InputLabel id="semester-label">Target Semester</InputLabel>
              <Select
                labelId="semester-label"
                multiple
                value={formData.targetSemester}
                onChange={handleSemesterChange}
                displayEmpty
              >
                {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => (
                  <MenuItem key={sem} value={sem}>{sem}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Objective */}
            <TextField label="Objective" name="objecttive" multiline rows={3} value={formData.objecttive} onChange={handleChange} required />

            {/* Module Levels */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Training Module Levels</Typography>
            {formData.trainingModuleLevels.map((level, levelIndex) => (
              <Paper key={levelIndex} sx={{ padding: 2, backgroundColor: "#f9f9f9", position: "relative", mb: 2 }}>
                <Typography variant="subtitle1">Module Level {levelIndex + 1}</Typography>

                {/* Modules Inside a Level */}
                {level.modules.map((module, moduleIndex) => (
                  <Box key={moduleIndex} sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
                    <TextField 
                      label="Module Name" 
                      value={module.modulename} 
                      onChange={(e) => handleModuleChange(levelIndex, moduleIndex, "modulename", e.target.value)} 
                      required 
                      sx={{ flexGrow: 1, minWidth: "200px" }}
                    />
                    <TextField 
                      label="Hours" 
                      type="number" 
                      value={module.TrainingComponentInHours} 
                      onChange={(e) => handleModuleChange(levelIndex, moduleIndex, "TrainingComponentInHours", e.target.value)} 
                      required 
                      sx={{ width: "100px" }}
                    />
                    <TextField 
                      label="Days" 
                      type="number" 
                      value={module.TrainingComponentInDays} 
                      onChange={(e) => handleModuleChange(levelIndex, moduleIndex, "TrainingComponentInDays", e.target.value)} 
                      required 
                      sx={{ width: "100px" }}
                    />
                    <IconButton onClick={() => removeModule(levelIndex, moduleIndex)}>
                      <Delete />
                    </IconButton>
                  </Box>
                ))}

                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" startIcon={<Add />} onClick={() => addModule(levelIndex)} size="small">
                    Add Module
                  </Button>
                  <IconButton onClick={() => removeModuleLevel(levelIndex)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            ))}

            <Button variant="contained" startIcon={<Add />} onClick={addModuleLevel} sx={{ alignSelf: "flex-start" }}>
              Add Module Level
            </Button>

            {/* Training Module Summary Section */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>Training Module Summary</Typography>
            {formData.trainingModuleSummary.map((summary, summaryIndex) => (
              <Paper key={summaryIndex} sx={{ padding: 2, backgroundColor: "#f0f7ff", position: "relative", mb: 2 }}>
                <Typography variant="subtitle1">Summary {summaryIndex + 1}</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                  <TextField 
                    label="Module Level" 
                    value={summary.moduleLevel} 
                    onChange={(e) => handleSummaryChange(summaryIndex, "moduleLevel", e.target.value)} 
                    required 
                  />
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField 
                      label="Training Hours" 
                      type="number" 
                      value={summary.TrainingInHours} 
                      onChange={(e) => handleSummaryChange(summaryIndex, "TrainingInHours", e.target.value)} 
                      required 
                      sx={{ width: "48%" }}
                    />
                    <TextField 
                      label="Training Days" 
                      type="number" 
                      value={summary.TrainingInDays} 
                      onChange={(e) => handleSummaryChange(summaryIndex, "TrainingInDays", e.target.value)} 
                      required 
                      sx={{ width: "48%" }}
                    />
                  </Box>
                  <TextField 
                    label="Remarks" 
                    multiline 
                    rows={2} 
                    value={summary.remarks} 
                    onChange={(e) => handleSummaryChange(summaryIndex, "remarks", e.target.value)} 
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

            <Button variant="contained" startIcon={<Add />} onClick={addSummary} sx={{ alignSelf: "flex-start", mb: 3 }}>
              Add Summary
            </Button>

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
          </Box>
        </Paper>
      }
    />
  );
};

export default PlacementTrainingTrackAddForm;