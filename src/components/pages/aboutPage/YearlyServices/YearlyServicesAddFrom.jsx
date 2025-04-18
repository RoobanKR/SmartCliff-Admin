import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createYearlyService } from "../../../redux/slices/aboutpage/yearlyServices/yearlyServices";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { HelpOutline } from "@mui/icons-material";

const YearlyServiceAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [year, setYear] = useState("");
  const [services, setServices] = useState([
    { businessService: "", service: [""] },
  ]);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const theme = useTheme();

  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];
    if (field === "businessService") {
      newServices[index].businessService = value;
    } else {
      newServices[index].service[0] = value; // Assuming only one service per business service for simplicity
    }
    setServices(newServices);
  };

  const handleAddService = () => {
    setServices([...services, { businessService: "", service: [""] }]);
  };

  const handleRemoveService = (index) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
  };

  const handleAddSubService = (index) => {
    const newServices = [...services];
    newServices[index].service.push(""); // Add a new empty service
    setServices(newServices);
  };

  const handleSubServiceChange = (index, subIndex, value) => {
    const newServices = [...services];
    newServices[index].service[subIndex] = value; // Update the specific sub-service
    setServices(newServices);
  };

  const handleRemoveSubService = (index, subIndex) => {
    const newServices = [...services];
    newServices[index].service.splice(subIndex, 1); // Remove the sub-service
    setServices(newServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate input
    if (
      !year ||
      services.some(
        (s) => !s.businessService || s.service.some((service) => !service)
      )
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Prepare the data to be sent to the backend
    const formData = {
      year,
      services: services.map((s) => ({
        businessService: s.businessService,
        service: s.service.filter(Boolean), // Ensure service array is not empty
      })),
    };

    try {
      await dispatch(createYearlyService(formData)).unwrap();
      setYear("");
      setServices([{ businessService: "", service: [""] }]);
      setSnackbar({
        open: true,
        message: "Yearly service created successfully!",
        severity: "success",
      });

      // Navigate to the control page after successful submission
      navigate("/about/yearly-service-control"); // Adjust the path as necessary
    } catch (error) {
      console.error("Error creating yearly service:", error);
      setSnackbar({
        open: true,
        message: "Failed to create yearly service.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
              History Data <br></br> Add Form
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
          <Paper elevation={0} style={{ maxWidth: "800px", margin: "auto" }}>
            <form
              onSubmit={handleSubmit}
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                marginTop: "20px",
                borderRadius: "8px",
              }}
            >
              <TextField
                label="Year"
                variant="outlined"
                fullWidth
                value={year}
                onChange={(e) => setYear(e.target.value)}
                margin="normal"
              />
              {services.map((service, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={6}>
                    <TextField
                      label="Business Service"
                      variant="outlined"
                      fullWidth
                      value={service.businessService}
                      onChange={(e) =>
                        handleServiceChange(
                          index,
                          "businessService",
                          e.target.value
                        )
                      }
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      onClick={() => handleAddSubService(index)}
                      startIcon={<AddIcon />}
                      sx={{ mt: 3 }}
                    >
                      Add Sub-Service
                    </Button>
                  </Grid>
                  {service.service.map((subService, subIndex) => (
                    <Grid item xs={12} key={subIndex}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={10}>
                          <TextField
                            label={`Service ${subIndex + 1}`}
                            variant="outlined"
                            fullWidth
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
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleRemoveSubService(index, subIndex)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => handleRemoveService(index)}
                      startIcon={<DeleteIcon />}
                      sx={{ mb: 2 }}
                    >
                      Delete Business Service
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                onClick={handleAddService}
                startIcon={<AddIcon />}
              >
                Add Business Service
              </Button>
              <Box mt={2}>
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
                  Submit Testimonial Data
                </Button>
              </Box>
            </form>
            {error && <Typography color="error">{error}</Typography>}

            {/* Snackbar for notifications */}
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
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Paper>
        </>
      }
    />
  );
};

export default YearlyServiceAddForm;
