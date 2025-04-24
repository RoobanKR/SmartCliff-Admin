import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Snackbar, Alert, Typography, Tooltip, Box, Container } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { createHomeServiceCount } from "../../../redux/slices/home/homeServiceCount/homeServiceCount";
import { HelpOutline } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  paper: {
    // maxWidth: 600,
    // margin: "auto",
    // padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "70%",
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
  },
}));

const HomeServiceCountAddForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [count, setCount] = useState("");
  const [service, setService] = useState("");
  const [slug, setSlug] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!count || !service || !slug) {
      setSnackbarSeverity("error");
      setSnackbarMessage("All fields are required");
      setSnackbarOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("count", count);
      formData.append("service", service);
      formData.append("slug", slug);

      // Dispatch the createHomeServiceCount action
      const response = await dispatch(
        createHomeServiceCount(formData)
      ).unwrap();

      // Ensure the message is a string
      let successMessage = "Home service count created successfully";

      if (response) {
        if (typeof response === "string") {
          successMessage = response;
        } else if (typeof response === "object") {
          if (response.message && typeof response.message === "string") {
            successMessage = response.message;
          } else {
            // Handle object response more carefully
            successMessage = "Services Count completed successfully";
          }
        }
      }

      setSnackbarMessage(successMessage);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/home/service-count-control"); // Adjust the navigation path as necessary
      }, 1500);

    } catch (error) {
      console.error("Error submitting form:", error);

      // Create a safe error message string
      let errorMessage = "An error occurred";

      if (error) {
        if (typeof error === "string") {
          errorMessage = error;
        } else if (typeof error === "object") {
          // Try to extract a meaningful error message from various possible structures
          if (typeof error.message === "string") {
            errorMessage = error.message;
          } else if (error.response?.data) {
            const data = error.response.data;
            if (typeof data === "string") {
              errorMessage = data;
            } else if (typeof data === "object") {
              if (typeof data.message === "string") {
                errorMessage = data.message;
              } else if (data.error && typeof data.error === "string") {
                errorMessage = data.error;
              } else {
                // Last resort: stringify but keep it reasonable
                try {
                  const stringified = JSON.stringify(data);
                  errorMessage =
                    stringified.length > 100
                      ? stringified.substring(0, 100) + "..."
                      : stringified;
                } catch (e) {
                  errorMessage = "Failed to process error details";
                }
              }
            }
          }
        }
      }

      setSnackbarSeverity("error");
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };  // Extract unique job positions for dropdown filter

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
                  Execution Count Add Form
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
            </Box>

            <form
              onSubmit={handleSubmit}
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="count"
                label="Count"
                name="count"
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="service"
                label="Service"
                name="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="slug"
                label="Slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                className={classes.submit}
              >
                Submit Execution Count
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

export default HomeServiceCountAddForm;
