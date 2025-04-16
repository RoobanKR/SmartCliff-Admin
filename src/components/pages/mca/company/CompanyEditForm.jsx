import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { Autocomplete, FormControl, Typography, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { getCompanyById, updateCompany } from "../../../redux/slices/mca/company/company";

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
  existingImages: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  image: {
    width: '100%',
    height: 'auto',
    marginBottom: theme.spacing(1),
  },
}));

const CompanyEditForm = () => {
  const { companyId } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const company = useSelector((state) => state.companies.selectedCompany);

  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector((state) => state.businessService.businessServiceData);

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [year, setYear] = useState("");
  const [logo, setLogo] = useState(null);
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
    }
  }, [company]);

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

  const handleBusinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
  };

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };

  const handleLogoChange = (files) => {
    setLogo(files[0]); // Assuming only one logo is uploaded
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("description", description);
    formData.append("website", website);
    formData.append("year", year);
    if (logo) formData.append("logo", logo);
    if (selectedService) formData.append("service", selectedService._id);
    if (selectedBusinessService) formData.append("business_service", selectedBusinessService._id);

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

  return (
    <LeftNavigationBar
      Content={
        <>
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
            >
              Edit Company
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
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
              />
              <FormControl fullWidth>
                <Autocomplete
                  id="business-services"
                  options={businessServiceData || []}
                  getOptionLabel={(option) => option?.name || ""}
                  value={selectedBusinessService}
                  onChange={handleBusinessServiceChange}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Business Services" fullWidth />
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
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Service" fullWidth />
                  )}
                />
              </FormControl>
              <DropzoneArea
                onChange={handleLogoChange}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                dropzoneText="Drag and drop logo here or click"
              />
              {company && company.logo && (
                <div className={classes.existingImages}>
                  <Typography variant="subtitle1">Existing Logo:</Typography>
                  <img
                    src={`${company.logo}`}
                    alt="Existing Logo"
                    className={classes.image}
                  />
                </div>
              )}
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#4CAF50", color: "white" }}
                fullWidth
                className={classes.submit}
              >
                Update
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
        </>
      }
    />
  );
};

export default CompanyEditForm;
