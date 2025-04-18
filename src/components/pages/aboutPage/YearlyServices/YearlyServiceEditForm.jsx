import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  Paper,
  Grid,
  CircularProgress,
  Divider,
  Stack,
  Alert,
  Snackbar,
  Tooltip,
  useTheme,
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
  ); // Get the current yearly service from the Redux store

  const [formData, setFormData] = useState({
    year: "",
    services: [],
  });

  // Fetch yearly service data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchYearlyService = async () => {
        try {
          await dispatch(getYearlyServiceById(id)); // Fetch yearly service by ID
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
      setFormData({
        year: yearlyService.year || "",
        services: yearlyService.services.map((s) => ({
          businessService: s.businessService || "",
          service: s.service || [],
        })),
      });
    }
  }, [yearlyService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedServices = [...prev.services];
      updatedServices[index] = { ...updatedServices[index], [field]: value };
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
      updatedServices[index].service.push("");
      return { ...prev, services: updatedServices };
    });
  };

  const handleSubServiceChange = (index, subIndex, value) => {
    setFormData((prev) => {
      const updatedServices = [...prev.services];
      updatedServices[index].service[subIndex] = value;
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
      if (!service.businessService || !service.service.length) {
        setSnackbar({
          open: true,
          message: `Business service and service are required for all services`,
          severity: "error",
        });
        return;
      }
    }

    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("year", formData.year);

      // Prepare services for submission
      const servicesForSubmit = formData.services.map((s) => ({
        businessService: s.businessService,
        service: s.service,
      }));

      form.append("services", JSON.stringify(servicesForSubmit));

      // Dispatch the updateYearlyService action
      const successMessage = await dispatch(
        updateYearlyService({ id, formData: form })
      ).unwrap();

      setSnackbar({
        open: true,
        message: successMessage,
        severity: "success",
      });

      // Redirect after successful submission
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

  return (
    <LeftNavigationBar
      Content={
        <>
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
              History Data <br></br> Edit Form
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
          <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
            <Paper elevation={0}>
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
                              value={service.businessService}
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

                            {service.service.map((subService, subIndex) => (
                              <TextField
                                key={subIndex}
                                fullWidth
                                label={`Sub-Service ${subIndex + 1}`}
                                value={subService}
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
                    sx={{
                      backgroundColor: theme.palette.warning.main,
                      color: theme.palette.warning.contrastText,
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto",
                      mt: 3, // optional: top margin
                      "&:hover": {
                        backgroundColor: theme.palette.warning.dark,
                      },
                    }}
                  >
                    Update Testimonial Data
                  </Button>
                </Box>
              </form>
            </Paper>

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
          </Box>
        </>
      }
    />
  );
};

export default YearlyServiceEditForm;
