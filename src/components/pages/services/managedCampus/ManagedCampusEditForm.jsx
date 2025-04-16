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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { fetchExecutionHighlights } from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import { fetchExecutionOverview } from "../../../redux/slices/services/executionOverview/ExecutionOverview";
import { getAllClient } from "../../../redux/slices/services/client/Client";
import { getAllGallery } from "../../../redux/slices/services/gallery/Gallery";
import { createTestimonial, getAllTestimonial } from "../../../redux/slices/services/testimonial/Testimonial";
import { createManagedCampus, getManagedCampusById, updateManagedCampus } from "../../../redux/slices/services/managedCampus/managedCampus";

const ManagedCampusEditForm = () => {
    const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedExecutionHighlights, setSelectedExecutionHighlights] = useState([]);
  const [selectedExecutionOverview, setSelectedExecutionOverview] = useState([]); // Single selection
  const [selectedOurClient, setSelectedOurClient] = useState([]); // Multiple selection
  const [selectedGallery, setSelectedGallery] = useState([]); // Single selection
  const [selectedTestimonial, setSelectedTestimonial] = useState([]); // Multiple selection
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);

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
  const managedCampusById = useSelector(
    (state) => state.managedCampus.managedCampusById
  );
  useEffect(() => {
    dispatch(getManagedCampusById(id));

    dispatch(fetchServices());
    dispatch(fetchExecutionHighlights());
    dispatch(fetchExecutionOverview());
    dispatch(getAllClient());
    dispatch(getAllGallery());
    dispatch(getAllTestimonial());
  }, [dispatch,id]);
  useEffect(() => {
    if (managedCampusById) {
      setSelectedService(managedCampusById.service || null);
      setSelectedSubtitle(managedCampusById.sub_title || '');
      setSelectedExecutionHighlights(managedCampusById.execution_highlights || []);
      setSelectedExecutionOverview(managedCampusById.execution_overview || []);
      setSelectedOurClient(managedCampusById.our_client || []);
      setSelectedGallery(managedCampusById.gallery || []);
      setSelectedTestimonial(managedCampusById.service_testimonial || []);
    }
  }, [managedCampusById]);
  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };
  const handleStackChange = (_, newValue) => {
    setSelectedExecutionHighlights(newValue);
  };
  const handleExecutionOverviewChange = (_, newValue) => {
    setSelectedExecutionOverview(newValue);
  };
  const handleOurClientChange = (_, newValue) => {
    setSelectedOurClient(newValue);
  };
  const handleGalleryChange = (_, newValue) => {
    setSelectedGallery(newValue);
  };
  const handleSubtitleChange = (_, newValue) => {
    setSelectedSubtitle(newValue);
  };
  const handleTestimonialChange = (_, newValue) => {
    setSelectedTestimonial(newValue);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("sub_title", selectedSubtitle.title);

    formData.append("service", selectedService._id);
    const selectedExecutionHighlightsIds = selectedExecutionHighlights ? selectedExecutionHighlights.map(executionHighlights => executionHighlights._id) : [];
    const executionHighlightsIds = selectedExecutionHighlightsIds.join(",");
    formData.append("execution_highlights", executionHighlightsIds);
    
    const selectedExecutionOverviewIds = selectedExecutionOverview ? selectedExecutionOverview.map(executionOverviews => executionOverviews._id) : [];
    const executionOverviewsIds = selectedExecutionOverviewIds.join(",");
    formData.append("execution_overview", executionOverviewsIds);    
    // Single selection
    const selectedOurClientIds = selectedOurClient ? selectedOurClient.map(client => client._id) : [];
    const ourClients = selectedOurClientIds.join(",");
    formData.append("our_client", ourClients);


 const selectedGalleryIds = selectedGallery ? selectedGallery.map(galleries => galleries._id) : [];
    const gallerys = selectedGalleryIds.join(",");
    formData.append("gallery", gallerys);    


    const selectedTestimonialIds = selectedTestimonial ? selectedTestimonial.map(testimonial => testimonial._id) : [];
    const testimonials = selectedTestimonialIds.join(",");
    formData.append("service_testimonial", testimonials);

    dispatch(updateManagedCampus({formData,id}));
    navigate("/managed_Campus-control");
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
                  onChange={handleSubtitleChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Subtitle"
                      fullWidth
                    />
                  )}
                />
              </FormControl>  

              <FormControl fullWidth>
                <Autocomplete
                  id="service"
                  options={serviceData || []}
                  getOptionLabel={(option) => (option ? option.title : "")}
                  value={selectedService}
                  onChange={handleServiceChange}
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
              <FormControl fullWidth>
                <Autocomplete
                  id="Execution Highlights"
                  multiple
                  options={executionHighlights || []}
                  getOptionLabel={(option) => (option ? option.stack : "")}
                  value={selectedExecutionHighlights}
                  onChange={handleStackChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Execution Highlights"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              <br />
              <FormControl fullWidth>
                <Autocomplete
                  id="Execution Overview"
                  multiple
                  options={executionOverviews || []}
                  getOptionLabel={(option) => (option ? option.batchName : "")}
                  value={selectedExecutionOverview}
                  onChange={handleExecutionOverviewChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Execution Overview"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              <br />
              <FormControl fullWidth>
                <Autocomplete
                  id="Our Client"
                  multiple
                  options={clients || []}
                  getOptionLabel={(option) => (option ? option.name : "")}
                  value={selectedOurClient}
                  onChange={handleOurClientChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Our Client"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <Autocomplete
                  id="Gallery"
                  multiple
                  options={galleries || []}
                  getOptionLabel={(option) => (option ? option.name : "")}
                  value={selectedGallery}
                  onChange={handleGalleryChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Gallery"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <Autocomplete
                  id="Testimonial"
                  multiple
                  options={testimonials || []}
                  getOptionLabel={(option) => (option ? option.name : "")}
                  value={selectedTestimonial}
                  onChange={handleTestimonialChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Testimonial"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#4CAF50", color: "white" }}
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

export default ManagedCampusEditForm;
