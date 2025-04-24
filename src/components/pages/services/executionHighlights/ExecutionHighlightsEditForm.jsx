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
  useTheme,
  Tooltip,
  Box,
  IconButton,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUpdateStatus,
  fetchExecutionHighlightsById,
  updateExecutionHighlights,
} from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { HelpOutline } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";

const ExecutionHighlightsEditForm = () => {
  const { executionHighlightId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { updateSuccess, successMessage, error } = useSelector(
    (state) => state.executionHighlights
  );
  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [stack, setStack] = useState("");
  const [image, setImage] = useState(null);
  const [count, setCount] = useState("");
  const [existingImages, setExistingImages] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
  }, [dispatch]);

  useEffect(() => {
    if (executionHighlightId) {
      dispatch(fetchExecutionHighlightsById(executionHighlightId))
        .then((response) => {
          const data = response.payload;
          if (data) {
            setStack(data.stack || "");
            setCount(data.count || "");
            setExistingImages(data.image || "");
            setSelectedService(data.service || null);

            if (businessServiceData.length > 0) {
              const businessService = businessServiceData.find(
                (bs) => bs._id === data.business_service?._id
              );
              setSelectedBusinessService(businessService || null);
            }
          }
        })
        .catch((error) =>
          console.error("Error fetching execution highlights:", error)
        );
    }
  }, [executionHighlightId, dispatch, businessServiceData, serviceData]);

  useEffect(() => {
    if (selectedBusinessService) {
      setFilteredServices(
        serviceData.filter(
          (service) =>
            service.business_services?._id === selectedBusinessService._id
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
    formData.append("stack", stack);
    if (image) {
      formData.append("image", image);
    }
    formData.append("count", count);
    if (selectedBusinessService)
      formData.append("business_service", selectedBusinessService._id);
    if (selectedService) formData.append("service", selectedService._id);

    try {
      await dispatch(
        updateExecutionHighlights({ executionHighlightId, formData })
      );
      setSnackbarMessage(successMessage || "Update successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/Execution_Highlights-control");
      }, 2000);
    } catch (error) {
      setSnackbarMessage(error.message || "Error updating execution highlights");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRemoveImage = () => {
    setExistingImages("");
    setImage(null);
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            mt={3}
            mb={2}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
            >
              Back
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
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
                  fontSize: { xs: "28px", sm: "36px" },
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
                Execution Highlights Edit Form
              </Typography>

              <Tooltip
                title="Edit the about us content and image here"
                arrow
                placement="top"
              >
                <HelpOutline
                  sx={{
                    color: "#747474",
                    fontSize: "24px",
                    cursor: "pointer",
                    ml: 1,
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
          <Paper elevation={0}>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={2000}
              onClose={() => setOpenSnackbar(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert severity={snackbarSeverity} variant="filled" onClose={() => setOpenSnackbar(false)}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
            <form
              onSubmit={handleSubmit}
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="business-services"
                      options={businessServiceData || []}
                      getOptionLabel={(option) => option?.name || ""}
                      value={selectedBusinessService}
                      onChange={handleBusinessServiceChange}
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Business Services"
                          fullWidth
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="service"
                      options={filteredServices || []}
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
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Stack"
                    variant="outlined"
                    required
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div style={{ marginTop: "16px" }}>
                    <DropzoneArea
                      onChange={(fileArray) => setImage(fileArray[0])}
                      acceptedFiles={["image/*"]}
                      filesLimit={1}
                      showPreviews={false}
                      showPreviewsInDropzone={true}
                      dropzoneText="Drag and drop an image here or click"
                      required
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
                    <div style={{ position: 'relative', marginLeft: "16px" }}>
                      <img
                        src={existingImages}
                        alt="Existing Execution Highlight"
                        style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "4px" }}
                      />
                      <IconButton
                        onClick={handleRemoveImage}
                        style={{ position: 'absolute', top: 0, right: 0 }}
                      >
                        <ClearIcon color="secondary" />
                      </IconButton>
                    </div>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Count"
                    variant="outlined"
                    required
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
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
                Update highlights Data
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default ExecutionHighlightsEditForm;