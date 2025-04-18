import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  Autocomplete,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate } from "react-router-dom";
import { createOutcome } from "../../../redux/slices/mca/outcome/outcome";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { getAllCompanies } from "../../../redux/slices/mca/company/company";
import { getAllColleges } from "../../../redux/slices/mca/college/college";
import { HelpOutline } from "@material-ui/icons";

const OutcomesAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [icon, setIcon] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const degreeProgramData = useSelector((state) => state.degreeProgram.degreeProgramData);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const collegeData = useSelector((state) => state.college.colleges) || [];
  const companyData = useSelector((state) => state.companies.companies);
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredDegreePrograms, setFilteredDegreePrograms] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
    dispatch(getAllCompanies());
    dispatch(fetchDegreeProgramData());
    dispatch(getAllColleges());
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
  const handleCollegeChange = (_, newValue) => {
    setSelectedCollege(newValue);
  };

  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  };
  const handleIconChange = (files) => {
    setIcon(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('icon', icon);
    formData.append('title', title);
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

    if (selectedCollege && selectedCollege._id) {
      formData.append("college", selectedCollege._id);
    }

    try {
      await dispatch(createOutcome({ formData }));
      setSnackbarMessage('Outcome created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/Outcomes-control");
      }, 1500);
    } catch (error) {
      setSnackbarMessage('Failed to create outcome. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
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
                  Out Comes Add Form
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
            </Box>
            <form
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
              onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 2 }}>
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
              <FormControl fullWidth sx={{ mb: 2 }}>
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
              <FormControl fullWidth sx={{ mb: 2 }}>
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
              <FormControl fullWidth sx={{ mb: 2 }}>
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
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                  id="College"
                  options={collegeData || []}
                  getOptionLabel={(option) => option?.collegeName || ""}
                  value={selectedCollege}
                  onChange={handleCollegeChange}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
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
              <DropzoneArea
                onChange={handleIconChange}
                acceptedFiles={["image/png/*"]}
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an icon here or click"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                style={{
                  display: "block",
                  margin: "24px auto 0", // centers the button horizontally
                  backgroundColor: " #1976d2", // green
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Submit Out Come
              </Button>
            </form>
          </Paper>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}

          >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled">
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      }
    />
  );
};

export default OutcomesAddForm;