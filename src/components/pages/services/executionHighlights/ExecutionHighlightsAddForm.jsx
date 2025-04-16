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

const ExecutionHighlightsAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const [cookies] = useCookies(["token"]);
  
  const [stack, setStack] = useState("");
  const [count, setCount] = useState("");
  const [images, setImages] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [ExecutionHighlightState, setExecutionHighlightState] = useState(null);
    const [selectedBusinessService, setSelectedBusinessService] = useState(null);
    
    const businessServiceData = useSelector(
      (state) => state.businessService.businessServiceData
    );
    const [filteredServices, setFilteredServices] = useState([]);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const  { loading, error, isSuccess } = useSelector(
      (state) => state.executionHighlights.executionHighlights
    );
  
  const [touchedFields, setTouchedFields] = useState({
    stack: false,
    count: false,
    image: false,
    service: false,
    business_service:false
  });
  const serviceData = useSelector((state) => state.service.serviceData);
  const [errors, setErrors] = useState({
    stack: "",
    count: "",
    image: "",
    service: "",
    business_service:"",
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
  }, [businessServiceData,dispatch]);


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

  useEffect(() => {
    if (ExecutionHighlightState?.isSuccess) {
      dispatch(resetExecutionHighlights());
    }
  }, [ExecutionHighlightState?.isSuccess, dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update state for the respective field
    switch (name) {
      case "stack":
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            stack: "Stack must contain only letters",
          }));
        } else {
          setErrors((prev) => ({ ...prev, stack: "" }));
        }
        setStack(value);
        break;
      case "count":
        if (!/^\d+$/.test(value)) {
          setErrors((prev) => ({ ...prev, count: "Count must be a number" }));
        } else {
          setErrors((prev) => ({ ...prev, count: "" }));
        }
        setCount(value);
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
    if (!stack.trim()) {
      setErrors((prev) => ({ ...prev, stack: "Stack is required" }));
      return;
    }
    if (!count.trim()) {
      setErrors((prev) => ({ ...prev, count: "Count is required" }));
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
    formData.append("stack", stack);
    formData.append("count", count);
    for (let i = 0; i < images.length; i++) {
      formData.append("image", images[i]);
    }
    formData.append("service", selectedService._id);
    if (selectedBusinessService) {
      formData.append("business_service", selectedBusinessService._id);
    }


    try {
         const result = await dispatch(
          addExecutionHighlights({ token: cookies.token, formData })
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
        navigate("/Execution_Highlights-control");
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
                          : isSuccess || "Service highlight created successfully"}
                      </Alert>
                    </Snackbar>
          
          
          <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
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
              Execution Highlights Add Form
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
                                </FormControl><br /> <br />
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
                id="stack"
                label="Stack"
                name="stack"
                value={stack}
                onChange={handleChange}
                error={Boolean(errors.stack)}
                helperText={touchedFields.stack && errors.stack}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, stack: true }))
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="count"
                label="Count"
                name="count"
                type="number"
                value={count}
                onChange={handleChange}
                error={Boolean(errors.count)}
                helperText={touchedFields.count && errors.count}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, count: true }))
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

export default ExecutionHighlightsAddForm;
