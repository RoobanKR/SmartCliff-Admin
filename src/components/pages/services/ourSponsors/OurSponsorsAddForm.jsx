
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { Autocomplete, FormControl, Typography, Snackbar, Alert, Box, IconButton, Chip, Container, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { createOurSponsors } from "../../../redux/slices/services/ourSponsors/ourSponsors";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { HelpOutline } from "@material-ui/icons";
import AddIcon from "@mui/icons-material/Add"; // Import the Add icon

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
  contributionsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  contributionChip: {
    margin: '4px',
  },
}));

const OurSponsorsAddForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [companyName, setCompany] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [contributions, setContributions] = useState([]);
  const [contributionInput, setContributionInput] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
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

  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredDegreePrograms, setFilteredDegreePrograms] = useState([]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchServices());
      dispatch(getAllBussinessServices());
      dispatch(fetchDegreeProgramData());
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
  };

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
  };

  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  };

  const handleImageChange = (files) => {
    setSelectedImages(files);
  };

  const handleContributionInputChange = (e) => {
    setContributionInput(e.target.value);
  };

  const handleContributionKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && contributionInput.trim() !== "") {
      e.preventDefault();
      addContribution(contributionInput.trim());
    }
  };

  const addContribution = (contribution) => {
    if (contribution && !contributions.includes(contribution)) {
      setContributions([...contributions, contribution]);
      setContributionInput("");
    }
  };

  const removeContribution = (indexToRemove) => {
    setContributions(contributions.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("type", type);
    formData.append("category", category);
    formData.append("contributions", JSON.stringify(contributions));
    if (selectedBusinessService) {
      formData.append("business_service", selectedBusinessService._id);
    }
    if (selectedService) {
      formData.append("service", selectedService._id);
    }
    if (selectedProgram) {
      formData.append("degree_program", selectedProgram._id);
    }

    selectedImages.forEach((logo) => {
      formData.append("logo", logo);
    });

    try {
      const response = await dispatch(createOurSponsors(formData)).unwrap();
      setSnackbar({ open: true, message: response.message[0].value, severity: 'success' });
      setTimeout(() => {
        navigate('/degreeprogram/our-sponsor-control');
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message?.[0]?.value || 'An error occurred';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddButtonClick = () => {
    if (contributionInput.trim() !== "") {
      addContribution(contributionInput.trim());
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
                  Our Sponsor Add Form
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
            <form style={{
              border: "2px dotted #D3D3D3",
              padding: "20px",
              borderRadius: "8px",
            }} onSubmit={handleSubmit}>
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

              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompany(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="Contributions"
                    value={contributionInput}
                    onChange={handleContributionInputChange}
                    onKeyDown={handleContributionKeyDown}
                    placeholder="Press Enter or comma to add a contribution"
                  />
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddButtonClick}
                  startIcon={<AddIcon />}
                  sx={{ ml: 2 }}
                >
                  Add
                </Button>
              </Box>


              <Box className={classes.contributionsContainer}>
                {contributions.map((contribution, index) => (
                  <Chip
                    key={index}
                    label={contribution}
                    onDelete={() => removeContribution(index)}
                    className={classes.contributionChip}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <DropzoneArea
                acceptedFiles={["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp", "image/svg+xml"]}
                filesLimit={1}
                dropzoneText="Drag and drop an image here or click"
                onChange={handleImageChange}
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
                Submit Our Sponsor
              </Button>
            </form>
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: '100%' }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

export default OurSponsorsAddForm;