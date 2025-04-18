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
  Box,
  useTheme,
  Tooltip,
} from "@mui/material";
import { Add, Delete, HelpOutline } from "@mui/icons-material";
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
import { createServiceProcess } from "../../../redux/slices/services/process/process";
import { fetchServices } from "../../../redux/slices/services/services/Services";

const ServicProcessAddForm = () => {
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const theme = useTheme();

  // Get state from Redux
  const { loading, error, successMessage } = useSelector(
    (state) => state.serviceAbout
  );

  const [formData, setFormData] = useState({
    business_service: "",
  });
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const serviceData = useSelector((state) => state.service.serviceData);

  const [selectedService, setSelectedService] = useState(null);

  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const [touchedFields, setTouchedFields] = useState({
    bussiness_service: false,
    service: false,
  });
  const [errors, setErrors] = useState({
    bussiness_service: "",
    service: "",
  });

  const [process, setProcess] = useState([{ heading: "", icon: null }]);
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
    setTouchedFields((prev) => ({ ...prev, service: true }));
    setErrors((prev) => ({ ...prev, service: "" }));
  };

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    setTouchedFields((prev) => ({ ...prev, bussiness_service: true }));
    setErrors((prev) => ({ ...prev, bussiness_service: "" }));

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

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Process Change
  const handleProcessChange = (index, e) => {
    const updatedProcess = [...process];
    updatedProcess[index][e.target.name] = e.target.value;
    setProcess(updatedProcess);
  };

  // Handle Process Icon Upload with DropzoneArea
  const handleFeatureIconChange = (index, files) => {
    if (files && files.length > 0) {
      const updatedProcess = [...process];
      updatedProcess[index].icon = files[0];
      setProcess(updatedProcess);
    }
  };

  // Add New Process
  const addFeature = () => {
    setProcess([...process, { heading: "", icon: null }]);
  };

  // Remove Process
  const removeFeature = (index) => {
    const updatedProcess = process.filter((_, i) => i !== index);
    setProcess(updatedProcess);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    if (selectedBusinessService) {
      data.append("business_service", selectedBusinessService._id);
    }

    if (selectedService) {
      data.append("service", selectedService._id);
    }

    // Convert process into JSON
    const formattedProcess = process.map((p) => ({
      heading: p.heading,
    }));
    data.append("process", JSON.stringify(formattedProcess));

    // Append process icons using indexed keys
    process.forEach((p, index) => {
      if (p.icon) data.append(`icon_${index}`, p.icon);
    });

    try {
      const result = await dispatch(
        createServiceProcess({ token: cookies.token, formData: data })
      ).unwrap();
      if (result) {
        setSubmitSuccess(true);
      }
    } catch (err) {
      console.error("Failed to create service process:", err);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      setTimeout(() => {
        dispatch(clearUpdateStatus());
        navigate("/Services-Process-control");
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
                : successMessage || "Service process created successfully"}
            </Alert>
          </Snackbar>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={2}
            mb={1}
          >
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
              Service Process Details
              <br /> Add Form
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
          <Paper
            elevation={0}
            sx={{ padding: 2, maxWidth: 800, margin: "auto" }}
          >
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="business-services"
                      options={businessServiceData || []}
                      getOptionLabel={(option) => option?.name || ""}
                      value={selectedBusinessService}
                      onChange={handleBussinessServiceChange}
                      isOptionEqualToValue={(option, value) =>
                        option && value && option._id === value._id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Business Services"
                          fullWidth
                          error={Boolean(errors.bussiness_service)}
                          helperText={
                            touchedFields.bussiness_service &&
                            errors.bussiness_service
                          }
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
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
                          error={
                            touchedFields.service && Boolean(errors.service)
                          }
                          helperText={touchedFields.service && errors.service}
                          onBlur={() =>
                            setTouchedFields((prev) => ({
                              ...prev,
                              service: true,
                            }))
                          }
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Process Steps
                  </Typography>

                  {process.map((processItem, index) => (
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
                            Process Step #{index + 1}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Process Heading"
                            name="heading"
                            value={processItem.heading}
                            onChange={(e) => handleProcessChange(index, e)}
                            required
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>
                            Process Icon
                          </Typography>
                          <DropzoneArea
                            acceptedFiles={["image/*"]}
                            filesLimit={1}
                            dropzoneText="Drag and drop an icon here or click"
                            onChange={(files) =>
                              handleFeatureIconChange(index, files)
                            }
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
                    Add Process Step
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto",
                      mt: 3, // optional: top margin
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Submit Process Data
                  </Button>
                </Grid>
              </Grid>
            </form>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Container>
      }
    />
  );
};

export default ServicProcessAddForm;
