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
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { fetchExecutionHighlights } from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import { fetchExecutionOverview } from "../../../redux/slices/services/executionOverview/ExecutionOverview";
import { getAllClient } from "../../../redux/slices/services/client/Client";
import { getAllGallery } from "../../../redux/slices/services/gallery/Gallery";
import {
  createTestimonial,
  getAllTestimonial,
} from "../../../redux/slices/services/testimonial/Testimonial";
import { createManagedCampus } from "../../../redux/slices/services/managedCampus/managedCampus";

const ManagedCampusAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedExecutionHighlights, setSelectedExecutionHighlights] =
    useState([]);
  const [selectedExecutionOverview, setSelectedExecutionOverview] = useState(
    []
  );
  const [selectedOurClient, setSelectedOurClient] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState([]);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [errors, setErrors] = useState({
    subtitle: "",
    service: "",
    executionHighlights: "",
    executionOverview: "",
    ourClient: "",
    gallery: "",
    testimonial: "",
  });
  const [touchedFields, setTouchedFields] = useState({
    subtitle: false,
    service: false,
    executionHighlights: false,
    executionOverview: false,
    ourClient: false,
    gallery: false,
    testimonial: false,
  });

  const serviceData = useSelector((state) => state.service.serviceData);
  const executionHighlights = useSelector(
    (state) => state.executionHighlights.executionHighlights
  );
  const executionOverviews = useSelector(
    (state) => state.executionOverviews.executionOverviews
  );
  const clients = useSelector((state) => state.clients.clients);
  const galleries = useSelector((state) => state.gallery.galleries);
  const testimonials = useSelector((state) => state.testimonial.testimonials);
  const filteredExecutionHighlights = executionHighlights.filter(
    (highlight) =>
      selectedService && highlight.service._id === selectedService._id
  );
  const filteredExecutionOverview = executionOverviews.filter(
    (overview) =>
      selectedService && overview.service._id === selectedService._id
  );

  const filteredOurClient = clients.filter(
    (client) => selectedService && client.service._id === selectedService._id
  );
  const filteredGallery = galleries.filter(
    (gallery) => selectedService && gallery.service._id === selectedService._id
  );

  const filteredTestimonial = testimonials.filter(
    (testimonial) =>
      selectedService && testimonial.service._id === selectedService._id
  );

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchExecutionHighlights());
    dispatch(fetchExecutionOverview());
    dispatch(getAllClient());
    dispatch(getAllGallery());
    dispatch(getAllTestimonial());
  }, [dispatch]);

  const handleFieldTouch = (fieldName) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    let isValid = true;

    // Validate subtitle
    if (!selectedSubtitle) {
      formErrors.subtitle = "Subtitle is required";
      isValid = false;
    }

    // Validate service
    if (!selectedService) {
      formErrors.service = "Service is required";
      isValid = false;
    }

    // Validate execution highlights
    if (selectedExecutionHighlights.length === 0) {
      formErrors.executionHighlights = "Execution Highlights are required";
      isValid = false;
    }

    // Validate execution overview
    if (selectedExecutionOverview.length === 0) {
      formErrors.executionOverview = "Execution Overview is required";
      isValid = false;
    }

    // Validate our clients
    if (selectedOurClient.length === 0) {
      formErrors.ourClient = "Our Clients are required";
      isValid = false;
    }

    // Validate gallery
    if (selectedGallery.length === 0) {
      formErrors.gallery = "Gallery is required";
      isValid = false;
    }

    // Validate testimonial
    if (selectedTestimonial.length === 0) {
      formErrors.testimonial = "Testimonials are required";
      isValid = false;
    }

    setErrors(formErrors);

    if (isValid) {
      const formData = new FormData();
      formData.append("sub_title", selectedSubtitle.title);
      formData.append("service", selectedService._id);
      formData.append(
        "execution_highlights",
        selectedExecutionHighlights.map((highlight) => highlight._id).join(",")
      );
      formData.append(
        "execution_overview",
        selectedExecutionOverview.map((overview) => overview._id).join(",")
      );
      formData.append(
        "our_client",
        selectedOurClient.map((client) => client._id).join(",")
      );
      formData.append(
        "gallery",
        selectedGallery.map((gallery) => gallery._id).join(",")
      );
      formData.append(
        "service_testimonial",
        selectedTestimonial.map((testimonial) => testimonial._id).join(",")
      );
      dispatch(createManagedCampus(formData));
      navigate("/managed_Campus-control");
    }
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
            <Typography
              gutterBottom
              variant="h4"
              align="center"
              component="div"
              style={{ fontFamily: "Serif" }}
            >
              Add Managed Campus
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="subtitle"
                      options={[
                        { title: "Internship" },
                        { title: "Value Added" },
                        { title: "TAP" },
                      ]}
                      getOptionLabel={(option) => (option ? option.title : "")}
                      value={selectedSubtitle}
                      onChange={(_, newValue) => setSelectedSubtitle(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Subtitle"
                          fullWidth
                          error={Boolean(errors.subtitle)}
                          helperText={touchedFields.subtitle && errors.subtitle}
                          onBlur={() => handleFieldTouch("subtitle")}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="service"
                      options={serviceData || []}
                      getOptionLabel={(option) => (option ? option.title : "")}
                      value={selectedService}
                      onChange={(_, newValue) => setSelectedService(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Service"
                          fullWidth
                          error={Boolean(errors.service)}
                          helperText={touchedFields.service && errors.service}
                          onBlur={() => handleFieldTouch("service")}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="execution-highlights"
                      multiple
                      options={filteredExecutionHighlights}
                      getOptionLabel={(option) => option.stack}
                      value={selectedExecutionHighlights}
                      onChange={(_, newValue) =>
                        setSelectedExecutionHighlights(newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Execution Highlights"
                          variant="outlined"
                          fullWidth
                          error={Boolean(errors.executionHighlights)}
                          helperText={
                            touchedFields.executionHighlights &&
                            errors.executionHighlights
                          }
                          onBlur={() => handleFieldTouch("executionHighlights")}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="execution-overview"
                      multiple
                      options={filteredExecutionOverview}
                      getOptionLabel={(option) => option.batchName}
                      value={selectedExecutionOverview}
                      onChange={(_, newValue) =>
                        setSelectedExecutionOverview(newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Execution Overview"
                          variant="outlined"
                          fullWidth
                          error={Boolean(errors.executionOverview)}
                          helperText={
                            touchedFields.executionOverview &&
                            errors.executionOverview
                          }
                          onBlur={() => handleFieldTouch("executionOverview")}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="clients"
                      multiple
                      options={filteredOurClient}
                      getOptionLabel={(option) => option.name}
                      value={selectedOurClient}
                      onChange={(_, newValue) => setSelectedOurClient(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Our Clients"
                          variant="outlined"
                          fullWidth
                          error={Boolean(errors.ourClient)}
                          helperText={
                            touchedFields.ourClient && errors.ourClient
                          }
                          onBlur={() => handleFieldTouch("ourClient")}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="gallery"
                      multiple
                      options={filteredGallery}
                      getOptionLabel={(option) => option.name}
                      value={selectedGallery}
                      onChange={(_, newValue) => setSelectedGallery(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Gallery"
                          variant="outlined"
                          fullWidth
                          error={Boolean(errors.gallery)}
                          helperText={touchedFields.gallery && errors.gallery}
                          onBlur={() => handleFieldTouch("gallery")}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="testimonial"
                      multiple
                      options={filteredTestimonial}
                      getOptionLabel={(option) => option.name}
                      value={selectedTestimonial}
                      onChange={(_, newValue) =>
                        setSelectedTestimonial(newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Testimonial"
                          variant="outlined"
                          fullWidth
                          error={Boolean(errors.testimonial)}
                          helperText={
                            touchedFields.testimonial && errors.testimonial
                          }
                          onBlur={() => handleFieldTouch("testimonial")}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  marginTop: 20,
                }}
                fullWidth
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default ManagedCampusAddForm;
