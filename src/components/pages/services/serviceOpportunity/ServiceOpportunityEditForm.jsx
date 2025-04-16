import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Autocomplete,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { clearUpdateStatus, getServiceOpportunityById, updateServiceOpportunity } from "../../../redux/slices/services/serviceOpportunity/serviceOpportunity";

const ServiceOpportunitiesEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { updateSuccess, successMessage, error, ServiceOpportunityById, loading } = useSelector(
    (state) => state.serviceOpportunities
  );
  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const [company_name, setCompanyName] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [existingImages, setExistingImages] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  // Fetch services and business services on mount
  useEffect(() => {
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
    if (id) {
      dispatch(getServiceOpportunityById(id));
    }
  }, [dispatch, id]);
  
  // Update form fields when data is loaded
  useEffect(() => {
    if (ServiceOpportunityById) {
      setCompanyName(ServiceOpportunityById.company_name || "");
      setDescription(ServiceOpportunityById.description || "");
      setExistingImages(ServiceOpportunityById.image || "");
      
      // Find the matching service
      if (serviceData && serviceData.length > 0 && ServiceOpportunityById.service) {
        const matchingService = serviceData.find(s => s._id === ServiceOpportunityById.service._id);
        setSelectedService(matchingService || null);
      }
      
      // Find the matching business service
      if (businessServiceData && businessServiceData.length > 0 && ServiceOpportunityById.business_service) {
        const businessService = businessServiceData.find(
          (bs) => bs._id === ServiceOpportunityById.business_service._id
        );
        setSelectedBusinessService(businessService || null);
      }
    }
  }, [ServiceOpportunityById, serviceData, businessServiceData]);
  
  // Filter services based on selected business service
  useEffect(() => {
    if (selectedBusinessService && serviceData) {
      setFilteredServices(
        serviceData.filter(
          (service) => service.business_services?._id === selectedBusinessService._id
        )
      );
    } else {
      setFilteredServices([]);
    }
  }, [selectedBusinessService, serviceData]);

  const handleBusinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    setSelectedService(null);
  };

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("company_name", company_name);
    if (image) {
      formData.append("image", image);
    }
    formData.append("description", description);
    if (selectedBusinessService) formData.append("business_service", selectedBusinessService._id);
    if (selectedService) formData.append("service", selectedService._id);
  
    try {
      await dispatch(updateServiceOpportunity({ serviceOpportunityId: id, formData })).unwrap();
    } catch (error) {
      console.error("Error updating service opportunity:", error);
    }
  };
  
  useEffect(() => {
    if (updateSuccess) {
      setOpenSnackbar(true);
      setTimeout(() => {
        dispatch(clearUpdateStatus());
        navigate("/Services-Opportunity-control");
      }, 2000);
    }
  }, [updateSuccess, navigate, dispatch]);
  
  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Snackbar
              open={openSnackbar}
              autoHideDuration={2000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert severity="success">{successMessage}</Alert>
            </Snackbar>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Typography
              gutterBottom
              variant="h4"
              textAlign={"center"}
              component="div"
              fontFamily={"Serif"}
            >
              Services Opportunity Edit Form
            </Typography>
            <br></br>
            
            {loading ? (
              <Typography>Loading...</Typography>
            ) : (
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Autocomplete
                        id="business-services"
                        options={businessServiceData || []}
                        getOptionLabel={(option) => (option && typeof option === 'object' ? option.name || "" : "")}
                        value={selectedBusinessService}
                        onChange={handleBusinessServiceChange}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        renderInput={(params) => <TextField {...params} variant="outlined" label="Business Services" fullWidth />}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Autocomplete
                        id="service"
                        options={filteredServices || []}
                        getOptionLabel={(option) => (option && typeof option === 'object' ? option.title || "" : "")}
                        value={selectedService}
                        onChange={handleServiceChange}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        renderInput={(params) => <TextField {...params} variant="outlined" label="Service" fullWidth required />}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      variant="outlined"
                      required
                      value={company_name}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div style={{marginTop: '16px'}}>
                      <DropzoneArea
                        onChange={(fileArray) => setImage(fileArray[0])}
                        acceptedFiles={["image/*"]}
                        filesLimit={1}
                        showPreviews={false}
                        showPreviewsInDropzone={true}
                        dropzoneText="Drag and drop an image here or click"
                      />
                    </div>
                   
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      style={{ marginTop: "16px" }}
                    >
                      Existing Image:
                    </Typography>
                    {existingImages && (
                      <Typography style={{ marginLeft: "16px" }}>
                        {typeof existingImages === 'string' ? existingImages.split("/").pop() : ''}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      variant="outlined"
                      required
                      multiline
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                >
                  Update
                </Button>
              </form>
            )}
          </Paper>
        </Container>
      }
    />
  );
};

export default ServiceOpportunitiesEditForm;