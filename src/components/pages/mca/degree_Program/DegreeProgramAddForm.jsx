import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  Alert,
  Autocomplete,
  Box,
  Container,
  FormControl,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createDegreeProgram } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { getAllCompanies } from "../../../redux/slices/mca/company/company";
import { getAllColleges } from "../../../redux/slices/mca/college/college";
import { HelpOutline } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
}));

const DegreeProgramAddForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.degreeProgram.loading);
  const error = useSelector((state) => state.degreeProgram.error);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [programName, setProgramName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const companyData = useSelector((state) => state.companies.companies);
  const collegeData = useSelector((state) => state.college.colleges) || [];

  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
    dispatch(getAllCompanies());
    dispatch(getAllColleges());
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
  const handleCompanyChange = (_, newValue) => {
    setSelectedCompany(newValue);
  };
  const handleCollegeChange = (_, newValue) => {
    setSelectedCollege(newValue);
  };

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);

    // Filter services based on selected business service
    if (newValue) {
      const filtered = serviceData.filter(
        (service) => service.business_services?._id === newValue._id
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  };

  const handleImageChange = (files) => {
    setSelectedImages(files);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("program_name", programName);
    formData.append("slogan", slogan);
    if (selectedBusinessService) {
      formData.append("business_service", selectedBusinessService._id);
    }
    if (selectedCollege) {
      formData.append("college", selectedCollege._id);
    }

    if (selectedCompany) {
      formData.append("company", selectedCompany._id);
    }

    if (selectedService) {
      formData.append("service", selectedService._id);
    }

    // Append each selected image to the FormData
    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const result = await dispatch(createDegreeProgram({ formData })).unwrap();

      setSnackbarMessage("Degree Program created successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/Degree_Program-control"); // Change to your desired route
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);

      setSnackbarMessage("Failed to create Degree Program.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
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
                  Degree Program Add Form
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
            <br />
            <form
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
              onSubmit={handleSubmit}
            >
              <FormControl fullWidth>
                <Autocomplete
                  id="Business Services"
                  options={businessServiceData || []}
                  getOptionLabel={(option) => option?.name || ""}
                  value={selectedBusinessService}
                  style={{ marginBottom: "20px" }}
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
              <FormControl fullWidth>
                <Autocomplete
                  id="service"
                  options={filteredServices || []}
                  getOptionLabel={(option) => option?.title || ""}
                  value={selectedService}
                  onChange={handleServiceChange}
                  style={{ marginBottom: "20px" }}
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
              <FormControl fullWidth>
                <Autocomplete
                  id="Company"
                  options={companyData || []}
                  style={{ marginBottom: "20px" }}
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
              <FormControl fullWidth>
                <Autocomplete
                  id="College"
                  options={collegeData || []}
                  style={{ marginBottom: "20px" }}
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

              <TextField
                variant="outlined"
                required
                fullWidth
                id="programName"
                label="Program Name"
                name="programName"
                value={programName}
                style={{ marginBottom: "20px" }}
                onChange={(e) => setProgramName(e.target.value)}
              />
              <TextField
                variant="outlined"
                style={{ marginBottom: "20px" }}
                required
                fullWidth
                id="slogan"
                label="Slogan"
                name="slogan"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
              />
              <DropzoneArea
                onChange={handleImageChange}
                acceptedFiles={["image/*"]}
                filesLimit={3}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an image here or click"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="slug"
                label="Slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                Submit College
              </Button>
            </form>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                elevation={6}
                variant="filled"
                onClose={handleCloseSnackbar}
                severity={snackbarSeverity}
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

export default DegreeProgramAddForm;
