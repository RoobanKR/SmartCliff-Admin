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
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  addExecutionHighlights,
  resetExecutionHighlights,
  selectExecutionHighlightsState,
} from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import * as Yup from "yup";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { clearUpdateStatus } from "../../../redux/slices/services/about/about";
import { useCookies } from "react-cookie";
import { createServiceOpportunity } from "../../../redux/slices/services/serviceOpportunity/serviceOpportunity";

const ServiceOpportunityAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const [company_name, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);

  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const [filteredServices, setFilteredServices] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const executionHighlightsState = useSelector(
    (state) => state.executionHighlights?.executionHighlights
  );
  const loading = executionHighlightsState?.loading || false;
  const error = executionHighlightsState?.error || null;
  const isSuccess = executionHighlightsState?.isSuccess || false;
  const [touchedFields, setTouchedFields] = useState({
    company_name: false,
    description: false,
    image: false,
    service: false,
    business_service: false,
  });
  const serviceData = useSelector((state) => state.service.serviceData);
  const [errors, setErrors] = useState({
    company_name: "",
    description: "",
    image: "",
    service: "",
    business_service: "",
  });

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
  }, [businessServiceData, dispatch]);

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };
  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    setTouchedFields((prev) => ({ ...prev, service: true }));
    setErrors((prev) => ({ ...prev, service: "" }));

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update state for the respective field
    switch (name) {
      case "company_name":
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            company_name: "Company name must contain only letters",
          }));
        } else {
          setErrors((prev) => ({ ...prev, company_name: "" }));
        }
        setCompanyName(value);
        break;
      case "description":
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            description: "Description must be a number",
          }));
        } else {
          setErrors((prev) => ({ ...prev, description: "" }));
        }
        setDescription(value);
        break;
      default:
        break;
    }

    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleImageChange = (files) => {
    setImages(files);
    setTouchedFields((prev) => ({ ...prev, image: true }));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty and display error message
    if (!company_name.trim()) {
      setErrors((prev) => ({
        ...prev,
        company_name: "company name is required",
      }));
      return;
    }
    if (!description.trim()) {
      setErrors((prev) => ({
        ...prev,
        description: "description is required",
      }));
      return;
    }
    if (!selectedService) {
      setErrors((prev) => ({ ...prev, service: "Service is required" }));
      return;
    }
    if (images.length === 0) {
      setErrors((prev) => ({ ...prev, image: "Image is required" }));
      return;
    }

    const formData = new FormData();
    formData.append("company_name", company_name);
    formData.append("description", description);
    for (let i = 0; i < images.length; i++) {
      formData.append("image", images[i]);
    }
    formData.append("service", selectedService._id);
    if (selectedBusinessService) {
      formData.append("business_service", selectedBusinessService._id);
    }

    try {
      const result = await dispatch(
        createServiceOpportunity({ token: cookies.token, formData })
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
        navigate("/Services-Opportunity-control");
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
              {typeof isSuccess === "object"
                ? JSON.stringify(isSuccess)
                : isSuccess || "Service created successfully"}
            </Alert>
          </Snackbar>

          <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
            <Typography
              gutterBottom
              variant="h4"
              align="center"
              component="div"
              style={{ fontFamily: "Serif" }}
            >
              Service Opportunity Add Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth>
                <Autocomplete
                  id="Business Services"
                  options={businessServiceData || []}
                  getOptionLabel={(option) => option?.name || ""}
                  value={selectedBusinessService}
                  onChange={handleBussinessServiceChange}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  } // ✅ Fix: Proper comparison
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
              <br /> <br />
              <FormControl fullWidth>
                <Autocomplete
                  id="service"
                  options={filteredServices || []} // Use filteredServices here
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
              <DropzoneArea
                onChange={handleImageChange}
                acceptedFiles={["image/*"]}
                filesLimit={5}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop images here or click"
              />
              {touchedFields.image && errors.image && (
                <Typography variant="body2" color="error">
                  {errors.image}
                </Typography>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="company_name"
                label="Company Name"
                name="company_name"
                value={company_name}
                onChange={handleChange}
                error={Boolean(errors.company_name)}
                helperText={touchedFields.company_name && errors.company_name}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, company_name: true }))
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                value={description}
                onChange={handleChange}
                error={Boolean(errors.description)}
                helperText={touchedFields.description && errors.description}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, description: true }))
                }
              />
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

export default ServiceOpportunityAddForm;
