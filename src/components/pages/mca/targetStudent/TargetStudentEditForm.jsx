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
  Tooltip,
  IconButton,
  Container,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import {
  updateTargetStudent,
  getTargetStudentById,
} from "../../../redux/slices/mca/targetStudent/targetStudent";
import { HexColorPicker } from "react-colorful";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate, useParams } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { getAllCompanies } from "../../../redux/slices/mca/company/company";
import { HelpOutline } from "@mui/icons-material";

const TargetStudentEditForm = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [description, setDescription] = useState("");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const targetStudent = useSelector(
    (state) => state.targetStudent.selectedTargetStudent
  );
  const [degreeProgram, setDegreeProgram] = useState(null);
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );

  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const companyData = useSelector((state) => state.companies.companies);
  const collegeData = useSelector((state) => state.college.colleges) || [];
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredDegreePrograms, setFilteredDegreePrograms] = useState([]);

  const isValidColor = (color) => {
    const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}$/; // Hex color pattern
    const rgbaPattern =
      /^rgba?\(\s*(\d{1,3}\s*,\s*){2}\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/; // RGBA pattern
    return hexPattern.test(color) || rgbaPattern.test(color);
  };
  useEffect(() => {
    dispatch(getTargetStudentById(id));
    dispatch(fetchDegreeProgramData());
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
    dispatch(getAllCompanies());
  }, [dispatch, id]);
  useEffect(() => {
    if (targetStudent) {
      setDescription(targetStudent.description);
      setBgColor(targetStudent.bgColor);
      setSelectedIcon(null); // Reset icon if needed
      if (targetStudent.degree_program) {
        const matchingProgram = degreeProgramData.find(
          (prog) =>
            prog._id === targetStudent.degree_program._id ||
            prog._id === targetStudent.degree_program
        );
        setDegreeProgram(matchingProgram || null);
      }

      // For business_service, find the matching object from businessServiceData
      if (targetStudent.business_service) {
        const matchingBS = businessServiceData.find(
          (bs) =>
            bs._id === targetStudent.business_service._id ||
            bs._id === targetStudent.business_service
        );
        setSelectedBusinessService(matchingBS || null);
      }

      // For service, find the matching object from serviceData
      if (targetStudent.service) {
        const matchingService = serviceData.find(
          (srv) =>
            srv._id === targetStudent.service._id ||
            srv._id === targetStudent.service
        );
        setSelectedService(matchingService || null);
      }

      // For company, find the matching object from companyData
      if (targetStudent.company) {
        const matchingCompany = companyData.find(
          (comp) =>
            comp._id === targetStudent.company._id ||
            comp._id === targetStudent.company
        );
        setSelectedCompany(matchingCompany || null);
      }

      // For college, find the matching object from collegeData
    }
  }, [
    targetStudent,
    degreeProgramData,
    businessServiceData,
    serviceData,
    companyData,
    collegeData,
  ]);
  useEffect(() => {
    if (selectedBusinessService) {
      const filtered = serviceData.filter(
        (service) =>
          service.business_services?._id === selectedBusinessService._id
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

  const handleProgramChange = (_, newValue) => {
    setDegreeProgram(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", description);
    formData.append("bgColor", bgColor);
    if (selectedService && selectedService._id) {
      formData.append("service", selectedService._id);
    }

    if (selectedIcon) {
      formData.append("icon", selectedIcon);
    }

    // Safely check if degreeProgram exists and has an _id property
    if (degreeProgram && degreeProgram._id) {
      formData.append("degree_program", degreeProgram._id);
    }

    // Safely check if selectedBusinessService exists and has an _id property
    if (selectedBusinessService && selectedBusinessService._id) {
      formData.append("business_service", selectedBusinessService._id);
    }

    // Safely check if selectedCompany exists and has an _id property
    if (selectedCompany && selectedCompany._id) {
      formData.append("company", selectedCompany._id);
    }

    try {
      const response = await dispatch(updateTargetStudent({ id, formData }));

      // Check if the response is successful
      if (response.meta.requestStatus === "fulfilled") {
        // Safely access the message property
        let successMessage = "Target student updated successfully";

        // Check if response.payload and response.payload.message exist
        if (response.payload && response.payload.message) {
          if (
            Array.isArray(response.payload.message) &&
            response.payload.message.length > 0
          ) {
            successMessage = response.payload.message[0].value;
          } else if (typeof response.payload.message === "string") {
            successMessage = response.payload.message;
          }
        }

        setSnackbarMessage(successMessage);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/degreeprogram/target-student-control");
        }, 1500);
      } else {
        // Handle the case where the response is not fulfilled
        let errorMessage = "Unknown error occurred";

        if (response.payload && response.payload.message) {
          if (
            Array.isArray(response.payload.message) &&
            response.payload.message.length > 0
          ) {
            errorMessage = response.payload.message[0].value;
          } else if (typeof response.payload.message === "string") {
            errorMessage = response.payload.message;
          }
        }

        setSnackbarMessage("Error updating form: " + errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error updating form:", error);
      // Safely handle errors that might not have the expected structure
      let errorMessage = "An unexpected error occurred";

      if (error.response && error.response.data) {
        if (error.response.data.message) {
          if (
            Array.isArray(error.response.data.message) &&
            error.response.data.message.length > 0
          ) {
            errorMessage = error.response.data.message[0].value;
          } else if (typeof error.response.data.message === "string") {
            errorMessage = error.response.data.message;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbarMessage("Error updating form: " + errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleBack = () => {
    navigate(-1);
  };

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
              <Button variant="outlined" color="primary" onClick={handleBack}>
                Back
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  flex: 1,
                }}
              >
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
                    "&::after ": {
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
                  Target Student Edit Form
                </Typography>
                <Tooltip
                  title="This is where you can add the execution count for the service."
                  arrow
                >
                  <HelpOutline
                    sx={{
                      color: "#747474",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Box>
            </Box>
            <form
              onSubmit={handleSubmit}
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
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
              <br />
              <br />
              <FormControl fullWidth>
                <Autocomplete
                  id="degree_program"
                  options={filteredDegreePrograms || []}
                  getOptionLabel={(option) => option?.program_name || ""}
                  value={degreeProgram}
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
              <br />
              <br />
              <FormControl fullWidth>
                <Autocomplete
                  id="company"
                  options={companyData || []}
                  getOptionLabel={(option) => option?.companyName || ""}
                  value={selectedCompany}
                  onChange={(_, newValue) => setSelectedCompany(newValue)}
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
              />
              <HexColorPicker
                color={bgColor}
                onChange={setBgColor}
                style={{ width: "100%", marginBottom: "10px" }}
              />
              <Box
                sx={{
                  p: 1,
                  bgcolor: bgColor,
                  color: getContrastColor(bgColor),
                  textAlign: "center",
                  borderRadius: 1,
                }}
              >
                {bgColor}
              </Box>
              <Grid>
                <DropzoneArea
                  onChange={(files) => setSelectedIcon(files[0])}
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  dropzoneText="Drag and drop an icon here or click"
                />
                {targetStudent && targetStudent.icon && (
                  <Box>
                    <img
                      src={targetStudent.icon} // Assuming the icon URL is stored in targetStudent.icon
                      alt="Existing Icon"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        marginBottom: "10px",
                      }}
                    />
                    <Tooltip title="Remove Existing Icon" arrow>
                      <IconButton
                        color="secondary"
                        onClick={() => setSelectedIcon(null)} // Clear the selected icon
                        style={{ marginTop: "10px" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Grid>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#ff6d00",
                  color: "#fff",
                  padding: "8px 24px",
                  textTransform: "uppercase",
                  borderRadius: "4px",
                  mt: 2,
                  "&:hover": {
                    backgroundColor: "#e65100",
                  },
                }}
                fullWidth
              >
                Update
              </Button>
            </form>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbarSeverity}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

// Define getContrastColor function
const getContrastColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#FFFFFF";
};

export default TargetStudentEditForm;
