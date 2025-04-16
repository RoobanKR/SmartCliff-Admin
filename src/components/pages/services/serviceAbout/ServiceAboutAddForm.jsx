import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Container,
  Snackbar,
  Alert,
  FormControl,
  Autocomplete,
  Grid,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { DropzoneArea } from "material-ui-dropzone";
import axios from "axios";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  clearUpdateStatus,
  createServiceAbout,
} from "../../../redux/slices/services/about/about";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { fetchServices } from "../../../redux/slices/services/services/Services";

const ServiceAboutAddForm = () => {
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

  const { loading, error, successMessage } = useSelector(
    (state) => state.serviceAbout
  );

  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    business_service: "",
    service: "",
  });
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const serviceData = useSelector((state) => state.service.serviceData);

  const [selectedService, setSelectedService] = useState(null);

  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const [touchedFields, setTouchedFields] = useState({
    bussiness_service: false,
  });
  const [errors, setErrors] = useState({
    bussiness_service: "",
  });

  const [features, setFeatures] = useState([
    { title: "", description: "", icon: null },
  ]);
  const [images, setImages] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  
  useEffect(() => {
    dispatch(getAllBussinessServices());
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (businessServiceData.length > 0 && selectedBusinessService) {
      const matchedService = businessServiceData.find(
        (service) => service._id === selectedBusinessService._id
      );
      setSelectedBusinessService(matchedService || null);
    }
  }, [businessServiceData, dispatch]);

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    setTouchedFields((prev) => ({ ...prev, service: true }));
    setErrors((prev) => ({ ...prev, service: "" }));

    if (newValue) {
      const filtered = serviceData.filter(
        (service) => service.business_services?._id === newValue._id
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index, e) => {
    const updatedFeatures = [...features];
    updatedFeatures[index][e.target.name] = e.target.value;
    setFeatures(updatedFeatures);
  };

  const handleFeatureIconChange = (index, files) => {
    const updatedFeatures = [...features];
    updatedFeatures[index].icon = files[0];
    setFeatures(updatedFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, { title: "", description: "", icon: null }]);
  };

  const removeFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  const handleImagesChange = (files) => {
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("heading", formData.heading);
    data.append("subHeading", formData.subHeading);

    if (selectedBusinessService) {
      data.append("business_service", selectedBusinessService._id);
    }

    if (selectedService) {
      data.append("service", selectedService._id);
    }

    const formattedFeatures = features.map((f) => ({
      title: f.title,
      description: f.description,
    }));
    data.append("feature", JSON.stringify(formattedFeatures));

    features.forEach((f, index) => {
      if (f.icon) data.append(`icon_${index}`, f.icon);
    });

    images.forEach((img) => data.append("images", img));

    try {
      const result = await dispatch(
        createServiceAbout({ token: cookies.token, formData: data })
      ).unwrap();
      if (result) {
        setSubmitSuccess(true);
      }
    } catch (err) {
      console.error("Failed to create service:", err);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      setTimeout(() => {
        dispatch(clearUpdateStatus());
        navigate("/Services-About-control");
      }, 2000);
    }
  }, [submitSuccess, navigate, dispatch]);

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Snackbar
            open={submitSuccess}
            autoHideDuration={2000}
            onClose={() => setSubmitSuccess(false)}
          >
            <Alert severity="success">
              {typeof successMessage === "object"
                ? JSON.stringify(successMessage)
                : successMessage || "Service created successfully"}
            </Alert>
          </Snackbar>

          <Paper
            elevation={3}
            sx={{ padding: 3, maxWidth: 800, margin: "auto" }}
          >
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
              Create Service About
            </Typography>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                          error={Boolean(errors.service)}
                          helperText={touchedFields.service && errors.service}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
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
                          error={touchedFields.service && Boolean(errors.service)}
                          helperText={touchedFields.service && errors.service}
                          onBlur={() =>
                            setTouchedFields((prev) => ({ ...prev, service: true }))
                          }
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Heading"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sub Heading"
                    name="subHeading"
                    value={formData.subHeading}
                    onChange={handleChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Features
                  </Typography>
                  
                  {features.map((feature, index) => (
                    <Paper
                      key={index}
                      elevation={1}
                      sx={{ padding: 2, marginBottom: 2 }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={11}>
                          <Typography variant="subtitle1">
                            Feature #{index + 1}
                          </Typography>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            onClick={() => removeFeature(index)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Feature Title"
                            name="title"
                            value={feature.title}
                            onChange={(e) => handleFeatureChange(index, e)}
                            required
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Feature Description"
                            name="description"
                            value={feature.description}
                            onChange={(e) => handleFeatureChange(index, e)}
                            required
                            multiline
                            rows={2}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>
                            Feature Icon
                          </Typography>
                          <DropzoneArea
                            acceptedFiles={["image/*"]}
                            filesLimit={1}
                            dropzoneText="Drag and drop an icon here or click"
                            onChange={(files) => handleFeatureIconChange(index, files)}
                            maxFileSize={5000000}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                  
                  <Button 
                    startIcon={<Add />} 
                    onClick={addFeature}
                    variant="outlined"
                    sx={{ mt: 1, mb: 3 }}
                  >
                    Add Feature
                  </Button>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Service Images
                  </Typography>
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    filesLimit={10}
                    dropzoneText="Drag and drop images here or click"
                    onChange={handleImagesChange}
                    maxFileSize={5000000}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </Grid>
              </Grid>
            </form>
            {error && <Alert severity="error">{error}</Alert>}
          </Paper>
        </Container>
      }
    />
  );
};

export default ServiceAboutAddForm;