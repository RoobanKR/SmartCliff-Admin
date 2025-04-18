
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { Autocomplete, FormControl, Typography, Snackbar, Alert, Box, IconButton, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { createOurSponsors } from "../../../redux/slices/services/ourSponsors/ourSponsors";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

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

  const [company, setCompany] = useState("");
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
    formData.append("company", company);
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

  return (
    <LeftNavigationBar
      Content={
        <Paper className={classes.paper} elevation={3}>
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
            >            Add Our Sponsors
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
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
              label="Company"
              value={company}
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
              <TextField
                variant="outlined"
                fullWidth
                label="Contributions"
                value={contributionInput}
                onChange={handleContributionInputChange}
                onKeyDown={handleContributionKeyDown}
                placeholder="Press Enter or comma to add a contribution"
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddButtonClick}
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
              className={classes.submit}
              fullWidth
            >
              Submit
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
      }
    />
  );
};

export default OurSponsorsAddForm;