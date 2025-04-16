import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { Autocomplete, FormControl, Typography, Snackbar, Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOurPartnerById, updateOurPartners } from "../../../redux/slices/services/ourPartners/ourPartners";
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
}));

const OurPartnersEditForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL

  const [companyName, setCompany] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [existingImage, setExistingImage] = useState(null); // State for existing image

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
      // Fetch the partner data by ID
      const partnerData = await dispatch(fetchOurPartnerById(id)).unwrap();
      setCompany(partnerData.companyName);
      console.log("Fetched partner data:", partnerData);
      setWebsiteLink(partnerData.websiteLink);
      setSelectedBusinessService(partnerData.business_service);
      setSelectedService(partnerData.service);
      setSelectedProgram(partnerData.degree_program);
      setExistingImage(partnerData.image); // Set existing image
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    // Filter services based on selected business service
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
    // Filter degree programs based on selected service
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("websiteLink", websiteLink);
    if (selectedBusinessService) {
      formData.append("business_service", selectedBusinessService._id);
    }
    if (selectedService) {
      formData.append("service", selectedService._id);
    }
    if (selectedProgram) {
      formData.append("degree_program", selectedProgram._id);
    }

    // Append each selected image to the FormData
    selectedImages.forEach((image) => {
      formData.append("image", image);
    });

    try {
      await dispatch(updateOurPartners({ id, formData })).unwrap();
      setSnackbar({
        open: true,
        message: "Partner updated successfully!",
        severity: 'success'
      });
      // Navigate to the next page after a short delay
      setTimeout(() => {
        navigate('/degreeprogram/our-partners-control'); // Replace with your desired route
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
            >            Edit Our Partners
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
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompany(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Website Link"
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
            />
            <DropzoneArea
              acceptedFiles={["image/*"]}
              filesLimit={1}
              dropzoneText="Drag and drop an image here or click"
              onChange={handleImageChange}
              initialFiles={existingImage ? [existingImage] : []} // Show existing image if available
            />
            {existingImage && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Image:
                </Typography>
                <Box
                  component="img"
                  src={existingImage}
                  sx={{
                    width: 100,
                    height: 'auto',
                    objectFit: 'cover',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1
                  }}
                />
              </Box>
            )}
            <Button
              type="submit"
              variant="contained"
              className={classes.submit}
              fullWidth
            >
              Update
            </Button>
          </form>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
      } />
  );
};

export default OurPartnersEditForm;