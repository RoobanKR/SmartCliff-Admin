import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Divider,
  Stack,
  Alert,
  Snackbar,
  Tooltip,
  useTheme,
  Container,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  getYearlyServiceById,
  updateYearlyService,
} from "../../../redux/slices/aboutpage/yearlyServices/yearlyServices";
import { HelpOutline } from "@mui/icons-material";

const YearlyServiceEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const yearlyService = useSelector(
    (state) => state.yearlyService.selectedService
  );

  const [formData, setFormData] = useState({
    year: "",
    services: [],
  });

  // Fetch yearly service data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchYearlyService = async () => {
        try {
          await dispatch(getYearlyServiceById(id));
          setLoading(false);
        } catch (error) {
          console.error("Error fetching yearly service:", error);
          setSnackbar({
            open: true,
            message:
              error.response?.data?.message?.[0]?.value ||
              "Failed to load yearly service data",
            severity: "error",
          });
          setLoading(false);
        }
      };

      fetchYearlyService();
    }
  }, [id, isEditMode, dispatch]);

  // Set form data when yearly service is fetched
  useEffect(() => {
    if (yearlyService) {
      try {
        // Safely extract data from yearlyService with strict type checking
        const year = yearlyService.year ? yearlyService.year.toString() : "";

        // Ensure services is an array and properly formatted with string conversion
        const services = Array.isArray(yearlyService.services)
          ? yearlyService.services.map(s => ({
            businessService: typeof s.businessService === 'string' ? s.businessService : "",
            service: Array.isArray(s.service)
              ? s.service.map(subS => typeof subS === 'string' ? subS : "")
              : []
          }))
          : [];

        setFormData({
          year,
          services
        });
      } catch (error) {
        console.error("Error processing yearly service data:", error);
        // Set default values if there's an error
        setFormData({
          year: "",
          services: []
        });
      }
    }
  }, [yearlyService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedServices = [...prev.services];
      updatedServices[index] = { ...updatedServices[index], [field]: value.toString() };
      return { ...prev, services: updatedServices };
    });
  };

  const handleAddService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { businessService: "", service: [] }],
    }));
  };

  const handleRemoveService = (index) => {
    setFormData((prev) => {
      const updatedServices = [...prev.services];
      updatedServices.splice(index, 1);
      return { ...prev, services: updatedServices };
    });
  };

  const handleAddSubService = (index) => {
    setFormData((prev) => {
      const updatedServices = [...prev.services];
      // Create a new service object with a new service array
      updatedServices[index] = {
        ...updatedServices[index],
        service: [...(updatedServices[index].service || []), ""]
      };
      return { ...prev, services: updatedServices };
    });
  };

  const handleSubServiceChange = (index, subIndex, value) => {
    setFormData((prev) => {
      const updatedServices = [...prev.services];
      // Ensure service array exists
      if (!Array.isArray(updatedServices[index].service)) {
        updatedServices[index].service = [];
      }

      // Create a new service array
      const updatedService = [...updatedServices[index].service];
      updatedService[subIndex] = value.toString();

      // Update the service object with the new service array
      updatedServices[index] = {
        ...updatedServices[index],
        service: updatedService
      };

      return { ...prev, services: updatedServices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.year) {
      setSnackbar({
        open: true,
        message: "Year is required",
        severity: "error",
      });
      return;
    }

    // Validate each service
    for (let i = 0; i < formData.services.length; i++) {
      const service = formData.services[i];
      if (!service.businessService || !Array.isArray(service.service) || service.service.length === 0) {
        setSnackbar({
          open: true,
          message: `Business service and at least one service are required for all services`,
          severity: "error",
        });
        return;
      }
    }

    setSubmitting(true);

    try {
      // Create a simplified formData that ensures all values are strings
      const simplifiedFormData = {
        year: formData.year.toString(),
        services: formData.services.map(s => ({
          businessService: s.businessService.toString(),
          service: Array.isArray(s.service) ? s.service.map(subS =>
            typeof subS === 'string' ? subS : subS.toString()
          ) : []
        }))
      };

      // Create FormData object for submission
      const form = new FormData();
      form.append("year", simplifiedFormData.year);
      form.append("services", JSON.stringify(simplifiedFormData.services));

      // Dispatch the updateYearlyService action
      const successMessage = await dispatch(
        updateYearlyService({ id, formData: form })
      ).unwrap();

      setSnackbar({
        open: true,
        message: successMessage || "Service updated successfully",
        severity: "success",
      });

      // Redirect after successful submission with a slight delay
      setTimeout(() => {
        navigate("/about/yearly-service-control");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Extract error message from the response
      const errorMessage =
        error.response?.data?.message?.[0]?.value || "An error occurred";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

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
                  History Data Edit Form
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
              onSubmit={handleSubmit}
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                marginTop: "20px",
                borderRadius: "8px",
              }}
            >
              <Grid container spacing={3}>
                {/* Main Details */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>

                {/* Services */}
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h5" gutterBottom>
                      Services
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddService}
                      sx={{ mb: 2 }}
                    >
                      Add Service
                    </Button>
                  </Stack>

                  {formData.services.map((service, index) => (
                    <Paper
                      key={index}
                      elevation={2}
                      sx={{ p: 2, mb: 3, background: "#F5F5F5" }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h6">
                              Service #{index + 1}
                            </Typography>
                            <IconButton
                              onClick={() => handleRemoveService(index)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Business Service"
                            value={typeof service.businessService === 'string' ? service.businessService : ""}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "businessService",
                                e.target.value
                              )
                            }
                            required
                            margin="normal"
                          />

                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => handleAddSubService(index)}
                            sx={{ mt: 2 }}
                          >
                            Add Sub-Service
                          </Button>

                          {Array.isArray(service.service) && service.service.map((subService, subIndex) => (
                            <TextField
                              key={subIndex}
                              fullWidth
                              label={`Sub-Service ${subIndex + 1}`}
                              value={typeof subService === 'string' ? subService : ""}
                              onChange={(e) =>
                                handleSubServiceChange(
                                  index,
                                  subIndex,
                                  e.target.value
                                )
                              }
                              margin="normal"
                            />
                          ))}
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Grid>
              </Grid>

              {/* Submit Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    backgroundColor: theme.palette.warning.main,
                    color: theme.palette.warning.contrastText,
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    mt: 3,
                    "&:hover": {
                      backgroundColor: theme.palette.warning.dark,
                    },
                  }}
                >
                  {submitting ? <CircularProgress size={24} /> : "Update Yearly Service"}
                </Button>
              </Box>
            </form>

            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

export default YearlyServiceEditForm;