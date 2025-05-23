import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Box,
  Tooltip,
} from "@mui/material";
import { Add, Delete, Clear } from "@mui/icons-material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  clearUpdateStatus,
  getServiceAboutById,
  updateServiceAbout,
} from "../../../redux/slices/services/about/about";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { HelpOutline } from "@material-ui/icons";

const ServiceAboutEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);

  const {
    selectedServiceAbout,
    loading,
    updateLoading,
    updateError,
    updateSuccess,
    successMessage,
  } = useSelector((state) => state.serviceAbout);

  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
  });

  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const serviceData = useSelector((state) => state.service.serviceData);

  const [touchedFields, setTouchedFields] = useState({
    business_service: false,
    service: false,
  });

  const [errors, setErrors] = useState({
    business_service: "",
    service: "",
  });

  const [features, setFeatures] = useState([
    { title: "", description: "", icon: null, iconChanged: false },
  ]);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Fetch initial data
  useEffect(() => {
    dispatch(getAllBussinessServices());
    dispatch(fetchServices());
    dispatch(getServiceAboutById(id));
  }, [dispatch, id]);

  // Set form data when service about is loaded
  useEffect(() => {
    if (selectedServiceAbout) {
      setFormData({
        heading: selectedServiceAbout.heading || "",
        subHeading: selectedServiceAbout.subHeading || "",
      });

      // Find and set the business service
      const businessService = businessServiceData.find(
        (bs) => bs._id === selectedServiceAbout.business_service
      );
      setSelectedBusinessService(businessService || null);

      // Find and set the service
      const service = serviceData.find(
        (s) => s._id === selectedServiceAbout.service
      );
      setSelectedService(service || null);

      // Set features with iconChanged flag to track changes
      setFeatures(
        selectedServiceAbout.feature && selectedServiceAbout.feature.length > 0
          ? selectedServiceAbout.feature.map((f) => ({
            title: f.title || "",
            description: f.description || "",
            icon: f.icon || null,
            iconChanged: false,
            existingIcon: f.icon || null,
          }))
          : [{ title: "", description: "", icon: null, iconChanged: false }]
      );

      // Set existing images
      setExistingImages(selectedServiceAbout.images || []);
    }
  }, [selectedServiceAbout, businessServiceData, serviceData]);

  // Filter services based on selected business service
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
    setTouchedFields((prev) => ({ ...prev, business_service: true }));
    setErrors((prev) => ({ ...prev, business_service: "" }));
  };

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
    setTouchedFields((prev) => ({ ...prev, service: true }));
    setErrors((prev) => ({ ...prev, service: "" }));
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
    if (files && files.length > 0) {
      const updatedFeatures = [...features];
      updatedFeatures[index].icon = files[0];
      updatedFeatures[index].iconChanged = true;
      setFeatures(updatedFeatures);
    }
  };

  const addFeature = () => {
    setFeatures([...features, { title: "", description: "", icon: null, iconChanged: false }]);
  };

  const removeFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  const handleNewImagesChange = (files) => {
    setNewImages(files);
  };

  // New function to remove an existing image
  const removeExistingImage = (index) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
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

    // Create a features array that only includes title and description
    // We'll handle icons separately to preserve binary data
    const formattedFeatures = features.map((f, index) => {
      // Only include basic feature data without icon information
      return {
        title: f.title,
        description: f.description,
        // If icon hasn't changed, we'll send the existing icon path/id, not the full URL
        // This way the backend knows not to update this icon
        icon: f.iconChanged ? null : f.existingIcon
      };
    });

    data.append("feature", JSON.stringify(formattedFeatures));

    // Only append icon files for features that have changed
    features.forEach((f, index) => {
      if (f.iconChanged && f.icon instanceof File) {
        data.append(`icon_${index}`, f.icon);
      }
    });

    // Append the existing images that should be kept
    if (existingImages.length > 0) {
      data.append("existingImages", JSON.stringify(existingImages));
    }

    // Append any new images that were uploaded
    if (newImages.length > 0) {
      newImages.forEach((img) => {
        if (img instanceof File) {
          data.append("images", img);
        }
      });
    }

    dispatch(updateServiceAbout({ token: cookies.token, id, formData: data }));
  };

  useEffect(() => {
    if (updateSuccess) {
      setTimeout(() => {
        dispatch(clearUpdateStatus());
        navigate("/Services-About-control");
      }, 2000);
    }
  }, [updateSuccess, navigate, dispatch]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Snackbar
            open={updateSuccess}
            autoHideDuration={2000}
            onClose={() => dispatch(clearUpdateStatus())}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert severity="success" variant="filled">{successMessage}</Alert>
          </Snackbar>

          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateError}
            </Alert>
          )}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            mt={3}
            mb={2}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
            >
              Back
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
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
                  fontSize: { xs: "28px", sm: "36px" },
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
                Service About Edit Form
              </Typography>

              <Tooltip
                title="Edit the about us content and image here"
                arrow
                placement="top"
              >
                <HelpOutline
                  sx={{
                    color: "#747474",
                    fontSize: "24px",
                    cursor: "pointer",
                    ml: 1,
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
            onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    id="business-services"
                    options={businessServiceData || []}
                    getOptionLabel={(option) => option?.name || ""}
                    value={selectedBusinessService}
                    onChange={handleBusinessServiceChange}
                    isOptionEqualToValue={(option, value) =>
                      option && value && option._id === value._id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Business Services"
                        fullWidth
                        error={Boolean(errors.business_service)}
                        helperText={
                          touchedFields.business_service && errors.business_service
                        }
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
                    isOptionEqualToValue={(option, value) =>
                      option && value && option._id === value._id
                    }
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
                    elevation={2}
                    sx={{ p: 2, mb: 2, position: "relative" }}
                  >
                    <IconButton
                      onClick={() => removeFeature(index)}
                      color="error"
                      size="small"
                      sx={{ position: "absolute", top: 5, right: 5 }}
                    >
                      <Delete />
                    </IconButton>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          Feature #{index + 1}
                        </Typography>
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
                          rows={3}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        {!feature.iconChanged && feature.existingIcon && (
                          <Box mb={2}>
                            <Typography variant="subtitle2" gutterBottom>
                              Current Icon:
                            </Typography>
                            <img
                              src={feature.existingIcon}
                              alt="Feature Icon"
                              style={{
                                width: "80px",
                                height: "auto",
                                marginBottom: "10px",
                                border: "1px solid #eee",
                                borderRadius: "4px",
                                padding: "5px"
                              }}
                            />
                          </Box>
                        )}

                        <Typography variant="subtitle2" gutterBottom>
                          {feature.existingIcon ? "Change Icon (Optional)" : "Add Icon"}
                        </Typography>
                        <DropzoneArea
                          acceptedFiles={["image/*"]}
                          filesLimit={1}
                          dropzoneText={feature.existingIcon
                            ? "Drag and drop a new icon here or click"
                            : "Drag and drop an icon here or click"
                          }
                          onChange={(files) => handleFeatureIconChange(index, files)}
                          showPreviewsInDropzone={true}
                          showFileNamesInPreview={true}
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
                  sx={{ mb: 3 }}
                >
                  Add Feature
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Existing Images
                </Typography>
                {existingImages.length > 0 ? (
                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                      {existingImages.map((img, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            sx={{
                              position: 'relative',
                              border: '1px solid #eee',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              p: 2,
                            }}
                          >
                            <IconButton
                              onClick={() => removeExistingImage(index)}
                              color="error"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                bgcolor: 'rgba(255,255,255,0.7)',
                                '&:hover': {
                                  bgcolor: 'rgba(255,255,255,0.9)',
                                }
                              }}
                            >
                              <Clear />
                            </IconButton>
                            <img
                              src={img}
                              alt={`Image ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                              }}
                            />
                            <Typography variant="caption" sx={{ mt: 1 }}>
                              Image {index + 1}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    No existing images
                  </Typography>
                )}

                <Typography variant="h6" gutterBottom>
                  Add New Images
                </Typography>
                <DropzoneArea
                  acceptedFiles={["image/*"]}
                  filesLimit={10}
                  dropzoneText="Drag and drop new images here or click"
                  onChange={handleNewImagesChange}
                  showPreviewsInDropzone={true}
                  showFileNamesInPreview={true}
                  maxFileSize={5000000}
                />
              </Grid>

              <Grid item xs={12}>
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
                  disabled={updateLoading}
                >
                  {updateLoading ? "Updating..." : "Update Service"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      }
    />
  );
};

export default ServiceAboutEditForm;