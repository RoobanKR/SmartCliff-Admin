import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Typography, Box, Tooltip, Container, Grid, IconButton, Alert, Snackbar } from "@mui/material";
import { useDispatch } from "react-redux";
import { createYearlyService } from "../../../redux/slices/aboutpage/yearlyServices/yearlyServices";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useNavigate } from "react-router-dom";
import { HelpOutline } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 800,
    margin: "auto",
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
}));

const YearlyServiceAddForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [year, setYear] = useState("");
  const [services, setServices] = useState([
    { businessService: "", service: [""] },
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];
    if (field === "businessService") {
      newServices[index].businessService = value;
    } else {
      newServices[index].service[0] = value;
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
    newServices[index].service.push("");
    setServices(newServices);
  };

  const handleSubServiceChange = (index, subIndex, value) => {
    const newServices = [...services];
    newServices[index].service[subIndex] = value;
    setServices(newServices);
  };

  const handleRemoveSubService = (index, subIndex) => {
    const newServices = [...services];
    newServices[index].service.splice(subIndex, 1);
    setServices(newServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!year || services.some(s => !s.businessService || s.service.some(service => !service))) {
      setSnackbarMessage("Please fill in all fields.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Prepare the data
    const formData = {
      year,
      services: services.map(s => ({
        businessService: s.businessService,
        service: s.service.filter(Boolean),
      })),
    };

    try {
      await dispatch(createYearlyService(formData)).unwrap();
      setSnackbarMessage("Yearly service added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/about/yearly-service-control");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbarMessage("Failed to add yearly service. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
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
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
              >
                Back
              </Button>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flex: 1
              }}>
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
                  History Data Add Form
                </Typography>

                <Tooltip
                  title="This is where you can add yearly service history data."
                  arrow
                >
                  <HelpOutline
                    sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }}
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
              onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="year"
                label="Year"
                name="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />

              {services.map((service, index) => (
                <Box key={index} mb={3} p={2} sx={{ border: "1px solid #eaeaea", borderRadius: "4px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        label="Business Service"
                        value={service.businessService}
                        onChange={(e) => handleServiceChange(index, "businessService", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddSubService(index)}
                        sx={{ mr: 1 }}
                      >
                        Add Sub-Service
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemoveService(index)}
                        disabled={services.length === 1}
                      >
                        Delete
                      </Button>
                    </Grid>

                    {service.service.map((subService, subIndex) => (
                      <Grid item xs={12} key={subIndex} sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          label={`Service ${subIndex + 1}`}
                          value={subService}
                          onChange={(e) => handleSubServiceChange(index, subIndex, e.target.value)}
                        />
                        <Button

                          color="error"
                          onClick={() => handleRemoveSubService(index, subIndex)}
                          disabled={service.service.length === 1}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}

              <Box mb={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddService}
                >
                  Add Business Service
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{
                  display: "block",
                  margin: "24px auto 0",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Submit History Data
              </Button>
            </form>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
                sx={{ width: "100%" }}
                variant="filled"
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

export default YearlyServiceAddForm;