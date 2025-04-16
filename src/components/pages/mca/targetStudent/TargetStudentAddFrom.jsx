"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Autocomplete,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  FormControl,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { createTargetStudent } from "../../../redux/slices/mca/targetStudent/targetStudent";
import { HexColorPicker } from "react-colorful";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { getAllCompanies } from "../../../redux/slices/mca/company/company";

const TargetStudentAddFrom = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [bgColor, setBgColor] = useState("#FFFFFF"); // Default color
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const degreeProgramData = useSelector((state) => state.degreeProgram.degreeProgramData);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const collegeData = useSelector((state) => state.college.colleges) || [];

  const companyData = useSelector((state) => state.companies.companies);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredDegreePrograms, setFilteredDegreePrograms] = useState([]);
  const isValidColor = (color) => {
    const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}$/; // Hex color pattern
    const rgbaPattern = /^rgba?\(\s*(\d{1,3}\s*,\s*){2}\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/; // RGBA pattern
    return hexPattern.test(color) || rgbaPattern.test(color);
  };

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
    dispatch(getAllCompanies());
    dispatch(fetchDegreeProgramData());


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
  };

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
  };

  const handleCompanyChange = (_, newValue) => {
    setSelectedCompany(newValue);
  };

  const presetColors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A6",
    "#FFD700",
    "#1976d2",
  ];

  const handlePresetColorSelect = (color) => {
    setBgColor(color);
  };

  useEffect(() => {
    if (businessServiceData.length > 0 && selectedBusinessService) {
      const matchedService = businessServiceData.find(
        (service) => service._id === selectedBusinessService._id
      );
      setSelectedBusinessService(matchedService || null);
    }
  }, [businessServiceData, selectedBusinessService]);


  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  };
  // const handleCollegeChange = (_, newValue) => {
  //   setSelectedCollege(newValue);
  // };

  const handleIconChange = (files) => {
    setSelectedIcon(files[0]); // Assuming only one file is uploaded
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", description);
    formData.append("bgColor", bgColor);
    if (selectedProgram && selectedProgram._id) {
      formData.append("degree_program", selectedProgram._id);
    }

    if (selectedService && selectedService._id) {
      formData.append("service", selectedService._id);
    }

    if (selectedBusinessService && selectedBusinessService._id) {
      formData.append("business_service", selectedBusinessService._id);
    }

    if (selectedCompany && selectedCompany._id) {
      formData.append("company", selectedCompany._id);
    }

    if (selectedIcon) {
      formData.append("icon", selectedIcon);
    }

    try {
      const response = await dispatch(createTargetStudent(formData));
      setSnackbarMessage(response.payload.message[0].value); // Assuming the response structure
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/degreeprogram/target-student-control');
      }, 1500);

      // Optionally navigate to another page here
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbarMessage("Error submitting form: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  return (
    <LeftNavigationBar
      Content={

        <Paper style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
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
            >            Add Target Student
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid  >
              <FormControl fullWidth>
                <Autocomplete
                  id="Business Services"
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
                    />
                  )}
                />
              </FormControl>
              <br /> <br />
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
              <br /><br />
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
                    />
                  )}
                />
              </FormControl>
              <br /><br />
              <FormControl fullWidth>
                <Autocomplete
                  id="Company"
                  options={companyData || []}
                  getOptionLabel={(option) => option?.companyName || ""}
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Company"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Typography variant="subtitle1" gutterBottom>
              Background Color
            </Typography>

            {/* Predefined Colors */}
            <Box sx={{ mb: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {presetColors.map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: color,
                    borderRadius: "50%",
                    cursor: "pointer",
                    border:
                      bgColor === color ? "3px solid black" : "2px solid white",
                  }}
                  onClick={() => handlePresetColorSelect(color)}
                />
              ))}
            </Box>

            {/* Manual Hex Input */}
            <TextField
        fullWidth
        label="Enter Hex or RGBA Color"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
        error={!isValidColor(bgColor)} // Validate color format
        helperText={
          !isValidColor(bgColor)
            ? "Enter a valid hex color (e.g., #FF5733) or RGBA (e.g., rgba(244, 157, 55, 0.2))"
            : ""
        }
        margin="normal"
      />            {/* Color Picker */}
            <HexColorPicker
              color={bgColor}
              onChange={setBgColor}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            {/* Color Preview */}
            <Box
              sx={{
                p: 1,
                bgcolor: bgColor,
                color: getContrastColor(bgColor), // You need to define this function
                textAlign: "center",
                borderRadius: 1,
              }}
            >
              {bgColor}
            </Box>
            <Grid  >
              <DropzoneArea
                onChange={handleIconChange}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                dropzoneText="Drag and drop an icon here or click"
              />
            </Grid>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </form>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Paper>
      } />
  );
};

// Define getContrastColor function
const getContrastColor = (hexColor) => {
  // Simple contrast color calculation
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#FFFFFF"; // Return black or white based on brightness
};

export default TargetStudentAddFrom;
