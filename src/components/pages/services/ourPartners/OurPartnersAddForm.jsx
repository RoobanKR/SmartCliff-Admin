import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { Autocomplete, FormControl, Typography, Snackbar, Alert, Tooltip, Container, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { createOurPartners } from "../../../redux/slices/services/ourPartners/ourPartners";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate } from "react-router-dom";
import { getAllCompanies } from "../../../redux/slices/mca/company/company";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
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
 
const OurPartnersAddForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const [companyName, setCompanyName] = useState("");
  const [type, setType] = useState("");
 
  const [websiteLink, setWebsiteLink] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const companyData = useSelector((state) => state.companies.companies);
 
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
      dispatch(getAllCompanies());
 
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
  const handleCompanyChange = (_, newValue) => {
    setSelectedCompany(newValue);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("type", type);
 
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
    if (selectedCompany && selectedCompany._id) {
      formData.append("company", selectedCompany._id);
    }
 
    selectedImages.forEach((image) => {
      formData.append("image", image);
    });
 
    try {
      const response = await dispatch(createOurPartners(formData)).unwrap();
      setSnackbar({ open: true, message: response.message[0].value, severity: 'success' });
      setTimeout(() => {
        navigate('/degreeprogram/our-partners-control');
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
 
  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };
 
  return (<LeftNavigationBar
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
                Our Partner Add Form
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
 
 
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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
              label="Website Link"
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
            />
            <DropzoneArea
              acceptedFiles={["image/*"]}
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
              Submit Our Partner
            </ Button>
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
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    } />
  );
};
 
export default OurPartnersAddForm;
 