import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Container,
} from "@mui/material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  getHomeServiceCountById,
  updateHomeServiceCount,
} from "../../../redux/slices/home/homeServiceCount/homeServiceCount";
import { HelpOutline } from "@mui/icons-material";
import { makeStyles } from "@material-ui/core/styles";

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

const HomeServiceCountEditForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { id } = useParams();
  const { homeServiceById, loading } = useSelector(
    (state) => state.homeServices
  );

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    count: "",
    service: "",
    slug: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getHomeServiceCountById(id)); // Fetch the Home Service Count by ID
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    if (homeServiceById) {
      setFormData({
        count: homeServiceById.count,
        service: homeServiceById.service,
        slug: homeServiceById.slug,
      });
    }
  }, [homeServiceById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.count || !formData.service || !formData.slug) {
      setSnackbar({
        open: true,
        message: "All fields are required",
        severity: "error",
      });
      return;
    }

    try {
      const result = await dispatch(
        updateHomeServiceCount({ id, formData })
      ).unwrap();

      // Extract success message from the array format
      let successMessage = "Home service count updated successfully";
      if (result.message && Array.isArray(result.message)) {
        const successMsg = result.message.find((msg) => msg.key === "success");
        if (successMsg && successMsg.value) {
          successMessage = successMsg.value;
        }
      }

      setSnackbar({
        open: true,
        message: successMessage,
        severity: "success",
      });

      // Redirect after successful submission
      setTimeout(() => {
        navigate("/home/service-count-control");
      }, 1500);
    } catch (error) {
      console.error("Error updating home service count:", error);

      // Extract error message from the array format if possible
      let errorMessage = "An error occurred";

      if (error && error.message && Array.isArray(error.message)) {
        const errorMsg = error.message.find((msg) => msg.key === "error");
        if (errorMsg && errorMsg.value) {
          errorMessage = errorMsg.value;
        }
      } else if (error && typeof error.message === "string") {
        errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };


  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
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
        <Container component="main" maxWidth="md">
          <Paper elevation={0} >
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
                  Execution Count Edit Form
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
                borderRadius: "8px",
              }}
            >
              <TextField
                fullWidth
                label="Count"
                name="count"
                value={formData.count}
                type="number"
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                margin="normal"
              />
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="warning"
                  type="submit"
                  className={classes.submit}
                >
                  Update Execution Count
                </Button>
              </Box>
            </form>

            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

export default HomeServiceCountEditForm;
