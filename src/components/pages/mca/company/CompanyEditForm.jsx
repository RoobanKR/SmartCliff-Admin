import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import {
  Autocomplete,
  FormControl,
  Typography,
  Snackbar,
  Tooltip,
  Box,
  Container,
  IconButton,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import {
  getCompanyById,
  updateCompany,
} from "../../../redux/slices/mca/company/company";
import { HelpOutline } from "@material-ui/icons";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  logoContainer: {
    position: "relative",
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logoImage: {
    maxWidth: "200px",
    maxHeight: "200px",
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  removeLogoButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
}));

const CompanyEditForm = () => {
  const { companyId } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const company = useSelector((state) => state.companies.selectedCompany);

  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [year, setYear] = useState("");
  const [logo, setLogo] = useState(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);
  const [error, setError] = useState(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (companyId) {
      dispatch(getCompanyById(companyId));
    }
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
  }, [dispatch, companyId]);

  useEffect(() => {
    if (company) {
      setCompanyName(company.companyName || "");
      setDescription(company.description || "");
      setWebsite(company.website || "");
      setYear(company.year || "");
      setSelectedBusinessService(company.business_service || null);
      setSelectedService(company.service || null);

      // Handle logo URL
      if (company.logo) {
        // If logo is a relative path, prepend the base URL
        const fullLogoUrl = company.logo.startsWith("http")
          ? company.logo
          : `${process.env.REACT_APP_BASE_URL}/${company.logo}`;
        setExistingLogoUrl(fullLogoUrl);
      }
    }
  }, [company]);

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

  const handleBusinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
  };

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };

  const handleLogoChange = (files) => {
    if (files[0]) {
      setLogo(files[0]);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveLogo = () => {
    setExistingLogoUrl("");
    setLogo(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("description", description);
    formData.append("website", website);
    formData.append("year", year);

    // Handle logo upload or removal
    if (logo) {
      formData.append("logo", logo);
    } else if (!existingLogoUrl) {
      // If no logo is present, send a flag to remove the existing logo
      formData.append("removeLogo", "true");
    }

    if (selectedService) formData.append("service", selectedService._id);
    if (selectedBusinessService)
      formData.append("business_service", selectedBusinessService._id);

    try {
      await dispatch(updateCompany({ id: companyId, formData }));
      setSnackbarMessage("Company updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate("/degreeprogram/company-control");
      }, 1500);
    } catch (error) {
      setSnackbarMessage(`Failed to update: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
                  Company Edit Form
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
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
              onSubmit={handleSubmit}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="companyName"
                label="Company Name"
                name="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="website"
                label="Website"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="year"
                label="Year"
                name="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                style={{ marginBottom: "20px" }}
              />
              <FormControl fullWidth>
                <Autocomplete
                  id="business-services"
                  options={businessServiceData || []}
                  getOptionLabel={(option) => option?.name || ""}
                  value={selectedBusinessService}
                  onChange={handleBusinessServiceChange}
                  style={{ marginBottom: "20px" }}
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
                    />
                  )}
                />
              </FormControl>

              {/* Logo Preview Section */}
              {(existingLogoUrl || logoPreview) && (
                <div className={classes.logoContainer}>
                  <Typography variant="subtitle1">Current Logo:</Typography>
                  <img
                    src={logoPreview || existingLogoUrl}
                    alt="Company Logo"
                    className={classes.logoImage}
                  />
                  <IconButton
                    className={classes.removeLogoButton}
                    onClick={handleRemoveLogo}
                    color="secondary"
                  >
                    <ClearIcon />
                  </IconButton>
                </div>
              )}

              <DropzoneArea
                onChange={handleLogoChange}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop a new logo image here or click (Optional)"
              />

              <Button
                type="submit"
                variant="contained"
                style={{
                  display: "block",
                  margin: "24px auto 0", // centers the button horizontally
                  backgroundColor: " #ff6d00", // green
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Update Company
              </Button>
            </form>
          </Paper>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      }
    />
  );
};

export default CompanyEditForm;
