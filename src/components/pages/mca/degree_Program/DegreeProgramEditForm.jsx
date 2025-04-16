import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { Autocomplete, FormControl, Grid, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchDegreeProgramById,
  updateDegreeProgram,
} from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { getAllCompanies } from "../../../redux/slices/mca/company/company";
import { getAllColleges } from "../../../redux/slices/mca/college/college";

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

const DegreeProgramEditForm = () => {
  const { degreeProgramId } = useParams();

  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const degreeProgram = useSelector(
    (state) => state.degreeProgram.selectedDegreeProgram
  );

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [programName, setProgramName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [service, setService] = useState(null);
  const [initialServiceId, setInitialServiceId] = useState(null);
  const [college, setCollege] = useState(null);
  const [company, setCompany] = useState(null);
  const collegeData = useSelector((state) => state.college.colleges) || [];
  const serviceData = useSelector((state) => state.service.serviceData);
  const companyData = useSelector((state) => state.companies.companies);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  // Snackbar States
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    dispatch(fetchDegreeProgramById(degreeProgramId));
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
    dispatch(getAllCompanies());
    dispatch(getAllColleges());
  }, [dispatch, degreeProgramId]);

  useEffect(() => {
    if (selectedBusinessService) {
      setFilteredServices(
        serviceData.filter(
          (service) => service.business_services?._id === selectedBusinessService._id
        )
      );
    } else {
      setFilteredServices([]);
    }
  }, [selectedBusinessService, serviceData]);

  useEffect(() => {
    if (degreeProgram) {
      setProgramName(degreeProgram.program_name || "");
      setSlogan(degreeProgram.slogan || "");
      setTitle(degreeProgram.title || "");
      setSlug(degreeProgram.slug || "");
      setDescription(degreeProgram.description || "");
      setExistingImages(degreeProgram.images || []);
      setCompany(degreeProgram.company || null);

      // Fix for college - check if it's an array and take the first item
      if (degreeProgram.college && Array.isArray(degreeProgram.college) && degreeProgram.college.length > 0) {
        setCollege(degreeProgram.college[0]); // Set the first college from the array
      } else {
        setCollege(null);
      }

      if (businessServiceData.length > 0 && degreeProgram.business_service) {
        const businessService = businessServiceData.find(
          (bs) => bs._id === degreeProgram.business_service._id
        );
        setSelectedBusinessService(businessService || null);
      }

      if (degreeProgram.service && degreeProgram.service._id) {
        setInitialServiceId(degreeProgram.service._id);
      }
    }
  }, [dispatch, degreeProgramId, degreeProgram, businessServiceData]);

  useEffect(() => {
    if (initialServiceId && filteredServices.length > 0) {
      const serviceObj = filteredServices.find(s => s._id === initialServiceId);
      if (serviceObj) {
        setService(serviceObj);
      }
      setInitialServiceId(null);
    }
  }, [initialServiceId, filteredServices]);

  const handleBusinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    setService(null);
  };

  const handleServiceChange = (_, newValue) => {
    setService(newValue);
  };

  const handleCompanyChange = (_, newValue) => {
    setCompany(newValue);
  };

  const handleCollegeChange = (_, newValue) => {
    setCollege(newValue);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("program_name", programName);
    formData.append("slogan", slogan);
    if (service) formData.append("service", service._id);
    if (company) formData.append("company", company._id);
    if (college) formData.append("college", college._id);

    if (selectedBusinessService) formData.append("business_service", selectedBusinessService._id);

    if (newImages.length > 0) {
      for (const image of newImages) {
        formData.append("images", image);
      }
    } else {
      for (const imageUrl of existingImages) {
        const fileNameWithTimestamp = imageUrl.split("/").pop();
        const fileNameWithoutTimestamp = fileNameWithTimestamp.replace(
          /^\d+_/,
          ""
        );
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const file = new File([arrayBuffer], fileNameWithoutTimestamp, {
          type: response.headers.get("content-type"),
        });

        formData.append("images", file);
      }
    }
    try {
      await dispatch(updateDegreeProgram({ degreeProgramId, formData }));
      // Show success snackbar
      setSnackbarMessage("Degree Program updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Navigate after a slight delay to allow the user to see the success message
      setTimeout(() => {
        navigate(`/Degree_Program-control`);
      }, 1500);
    } catch (error) {
      setError(error.message);
      // Show error snackbar
      setSnackbarMessage(`Failed to update: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleImageChange = (images) => {
    setNewImages(images);
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
            >
            Degree Program Edit Form
          </Typography>
          <br />
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  id="business-services"
                  options={businessServiceData || []}
                  getOptionLabel={(option) => option?.name || ""}
                  value={selectedBusinessService}
                  onChange={handleBusinessServiceChange}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderInput={(params) => <TextField {...params} variant="outlined" label="Business Services" fullWidth />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <FormControl fullWidth>
                <Autocomplete
                  id="service"
                  options={filteredServices || []}
                  getOptionLabel={(option) => option?.title || ""}
                  value={service}
                  onChange={handleServiceChange}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderInput={(params) => <TextField {...params} variant="outlined" label="Service" fullWidth required />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  id="company"
                  options={companyData || []}
                  getOptionLabel={(option) => option?.companyName || ""}
                  value={company}
                  onChange={handleCompanyChange}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderInput={(params) => <TextField {...params} variant="outlined" label="Company" fullWidth />}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  id="college"
                  options={collegeData || []}
                  getOptionLabel={(option) => option?.collegeName || ""}
                  value={college}
                  onChange={handleCollegeChange}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderInput={(params) => <TextField {...params} variant="outlined" label="College" fullWidth />}
                />
              </FormControl>
            </Grid>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="programName"
              label="Program Name"
              name="programName"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="slogan"
              label="Slogan"
              name="slogan"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
            />
            <DropzoneArea
              acceptedFiles={["image/*"]}
              filesLimit={5}
              dropzoneText="Drag and drop images here or click"
              onChange={handleImageChange}
            />
            <Typography
              variant="subtitle1"
              color="textSecondary"
              style={{ marginTop: "16px" }}
            >
              Existing Images:
            </Typography>
            {existingImages.map((imageUrl, index) => {
              const fileName = imageUrl.split("/").pop();
              return (
                <Typography key={index} style={{ marginLeft: "16px" }}>
                  {fileName}
                </Typography>
              );
            })}
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
              style={{ backgroundColor: "#4CAF50", color: "white" }}
              fullWidth
              className={classes.submit}
            >
              Submit
            </Button>
            {error && (
              <Typography variant="body1" color="error">
                Failed to submit: {error}
              </Typography>
            )}
          </form>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Paper>
      }
    />
  );
};

export default DegreeProgramEditForm;