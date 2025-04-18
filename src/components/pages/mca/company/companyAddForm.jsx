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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { clearError, createCompany } from "../../../redux/slices/mca/company/company";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { HelpOutline } from "@material-ui/icons";

const CompanyAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   const [cookies] = useCookies(["token"]);

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [year, setYear] = useState("");
  const [logo, setLogo] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const { loading, error, isSuccess } = useSelector((state) => state.companies);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const [filteredServices, setFilteredServices] = useState([]);

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

  useEffect(() => {
    if (isSuccess) {
      setSubmitSuccess(true);
      setTimeout(() => {
        dispatch(clearError());
        navigate("/degreeprogram/company-control"); // Redirect to the company list or desired page
      }, 2000);
    }
  }, [isSuccess, dispatch, navigate]);

  const handleLogoChange = (files) => {
    setLogo(files[0]); // Assuming only one logo is uploaded
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const newErrors = {};
    if (!companyName) newErrors.companyName = "Company name is required";
    if (!description) newErrors.description = "Description is required";
    if (!website) newErrors.website = "Website is required";
    if (!year) newErrors.year = "Year is required";
    if (!logo) newErrors.logo = "Logo is required";
    if (!selectedService) newErrors.service = "Service is required";
    if (!selectedBusinessService) newErrors.business_service = "Business service is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("description", description);
    formData.append("website", website);
    formData.append("year", year);
    formData.append("logo", logo);
    formData.append("service", selectedService._id);
    formData.append("business_service", selectedBusinessService._id);

    try {
      await dispatch(createCompany(formData)).unwrap();
    } catch (err) {
      console.error("Failed to create company:", err);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };  // Extract unique job positions for dropdown filter


  return (
    <LeftNavigationBar
      Content={

        <Container component="main" maxWidth="md">
          {/* <Snackbar
            open={submitSuccess}
            autoHideDuration={2000}
            onClose={() => setSubmitSuccess(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}

          >
            <Alert severity="success">
              Company created successfully!
            </Alert>
          </Snackbar> */}
          <Paper elevation={0} >
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
                  Company Add Form
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
              <TextField
                margin="normal"
                required
                fullWidth
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                error={Boolean(errors.companyName)}
                helperText={errors.companyName}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={Boolean(errors.description)}
                helperText={errors.description}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                error={Boolean(errors.website)}
                helperText={errors.website}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                error={Boolean(errors.year)}
                helperText={errors.year}
                style={{ marginBottom: "20px" }}
              />
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
              <DropzoneArea
                onChange={handleLogoChange}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                dropzoneText="Drag and drop logo here or click"
              />
              {errors.logo && (
                <Typography variant="body2" color="error">
                  {errors.logo}
                </Typography>
              )}
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
                Submit Company
              </Button>
            </form>
          </Paper >
        </Container >
      } />
  );
};

export default CompanyAddForm;