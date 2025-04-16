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
import {
  clearUpdateStatus,
  fetchExecutionHighlightsById,
  updateExecutionHighlights,
} from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";

const ExecutionHighlightsEditForm = () => {
  const { executionHighlightId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { updateSuccess, successMessage, error } = useSelector(
    (state) => state.executionHighlights
  );
  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
      dispatch(fetchExecutionHighlightsById(executionHighlightId)).then(
        (response) => {
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
        }
      ).catch((error) => console.error("Error fetching execution highlights:", error)); 
    }
  }, [executionHighlightId, dispatch, businessServiceData, serviceData]);

  useEffect(() => {
    if (selectedBusinessService) {
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
    formData.append("stack", stack);
    if (image) {
      formData.append("image", image);
    }
    formData.append("count", count);
    if (selectedBusinessService) formData.append("business_service", selectedBusinessService._id);
    if (selectedService) formData.append("service", selectedService._id);
  
    try {
      await dispatch(updateExecutionHighlights({ executionHighlightId, formData }));
      navigate("/Execution_Highlights-control");

      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating execution highlights:", error);
    }
  }
  useEffect(() => {
    if (updateSuccess) {
      setOpenSnackbar(true);
      const timer = setTimeout(() => {
        dispatch(clearUpdateStatus());
        navigate("/Execution_Highlights-control");
      }, 2000);
      
      return () => clearTimeout(timer); // Cleanup the timer on unmount
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
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
    {successMessage || "Update successful!"}
  </Alert>
</Snackbar>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: 'Merriweather, serif',
                fontWeight: 700, textAlign: 'center',
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 5,
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
            <br />
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="business-services"
                      options={businessServiceData || []}
                      getOptionLabel={(option) => option?.name || ""}
                      value={selectedBusinessService}
                      onChange={handleBusinessServiceChange}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      renderInput={(params) => <TextField {...params} variant="outlined" label="Business Services" fullWidth />}
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
                      renderInput={(params) => <TextField {...params} variant="outlined" label="Service" fullWidth required />}
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
                  <div style={{ marginTop: '16px' }}>
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
                    <Typography style={{ marginLeft: "16px" }}>
                      {existingImages.split("/").pop()}
                    </Typography>
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
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                Update
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default ExecutionHighlightsEditForm;