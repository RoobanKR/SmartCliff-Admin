import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { clearUpdateStatus, getServiceProcessById, updateServiceProcess } from "../../../redux/slices/services/process/process";
import { DropzoneArea } from "material-ui-dropzone";

const ServiceProcessEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);

  const {
    selectedServiceProcess,
    loading,
    updateLoading,
    updateError,
    updateSuccess,
    successMessage,
  } = useSelector((state) => state.serviceProcess);

  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const serviceData = useSelector((state) => state.service.serviceData);

  const [touchedFields, setTouchedFields] = useState({
    business_service: false,
    service: false,
  });

  const [errors, setErrors] = useState({
    business_service: "",
    service: "",
  });

  const [processs, setProcess] = useState([
    { heading: "", icon: null },
  ]);

  // Fetch initial data
  useEffect(() => {
    dispatch(getAllBussinessServices());
    dispatch(fetchServices());
    dispatch(getServiceProcessById(id));
  }, [dispatch, id]);

  const urlToFile = async (url, filename, mimeType) => {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    return new File([buffer], filename, { type: mimeType });
  };

  useEffect(() => {
    const prepareProcessIcons = async () => {
      if (selectedServiceProcess && businessServiceData.length > 0) {
        const businessService = businessServiceData.find(
          (bs) => bs._id === selectedServiceProcess.business_service?._id
        );
        if (businessService) setSelectedBusinessService(businessService);

        const service = serviceData.find(
          (s) => s._id === selectedServiceProcess.service
        );
        setSelectedService(service || null);

        const processWithFiles = await Promise.all(
          selectedServiceProcess.process.map(async (f, i) => {
            let iconFile = null;
            if (f.icon) {
              const fileExt = f.icon.split(".").pop().split("?")[0];
              const mimeType = `image/${fileExt === "svg" ? "svg+xml" : fileExt}`;
              iconFile = await urlToFile(f.icon, `icon_${i}.${fileExt}`, mimeType);
            }
            return { heading: f.heading, icon: iconFile };
          })
        );

        setProcess(processWithFiles);
      }
    };

    prepareProcessIcons();
  }, [selectedServiceProcess, businessServiceData, serviceData]);

  // Set form data when service about is loaded
  useEffect(() => {
    if (selectedServiceProcess && businessServiceData.length > 0) {
      const businessService = businessServiceData.find(
        (bs) => bs._id === selectedServiceProcess.business_service?._id
      );
      if (businessService) {
        setSelectedBusinessService(businessService);
      }
      const service = serviceData.find(
        (s) => s._id === selectedServiceProcess.service
      );
      setSelectedService(service || null);

      setProcess(
        selectedServiceProcess.process.map((f) => ({
          heading: f.heading,
          icon: f.icon,
        }))
 );
    }
  }, [selectedServiceProcess, businessServiceData, serviceData]);

  // Filter services based on selected business service
  useEffect(() => {
    if (selectedBusinessService) {
      const filtered = serviceData.filter(
        (service) => service.business_services?._id === selectedBusinessService._id
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  }, [selectedBusinessService, serviceData]);

  const handleBusinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    setTouchedFields((prev) => ({ ...prev, business_service: true }));
    setErrors((prev) => ({ ...prev, business_service: "" }));
  };

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
    setTouchedFields((prev) => ({ ...prev, service: true }));
    setErrors((prev) => ({ ...prev, service: "" }));
  };


  const handleProcessChange = (index, e) => {
    const updatedprocess = [...processs];
    updatedprocess[index][e.target.name] = e.target.value;
    setProcess(updatedprocess);
  };

  const handleProcessIconChange = (index, files) => {
    const updatedprocess = [...processs];
    updatedprocess[index].icon = files[0];
    setProcess(updatedprocess);
  };

  const addProcess = () => {
    setProcess([...processs, { heading: "", icon: null }]);
  };

  const removeprocess = (index) => {
    const updatedprocess = processs.filter((_, i) => i !== index);
    setProcess(updatedprocess);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    if (selectedBusinessService) {
      data.append("business_service", selectedBusinessService._id);
    }

    if (selectedService) {
      data.append("service", selectedService._id);
    }

    const formattedProcess = processs.map((f) => ({
      heading: f.heading,
      icon: f.icon instanceof File ? null : f.icon,
    }));
    data.append("process", JSON.stringify(formattedProcess));

    processs.forEach((f, index) => {
      data.append(`icon_${index}`, f.icon);
    });

    dispatch(updateServiceProcess({ token: cookies.token, id, formData: data }));
  };

  useEffect(() => {
    if (updateSuccess) {
      setTimeout(() => {
        dispatch(clearUpdateStatus());
        navigate("/Services-Process-control");
      }, 2000);
    }
  }, [updateSuccess, navigate, dispatch]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Snackbar
            open={updateSuccess}
            autoHideDuration={2000}
            onClose={() => dispatch(clearUpdateStatus())}
          >
            <Alert severity="success">{successMessage}</Alert>
          </Snackbar>

          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateError}
            </Alert>
          )}

          <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: "auto" }}>
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
              Edit Service About
            </Typography>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                      error={Boolean(errors.business_service)}
                      helperText={
                        touchedFields.business_service && errors.business_service
                      }
                    />
                  )}
                />
              </FormControl>
              <br /> <br />
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
                      error={touchedFields.service && Boolean(errors.service)}
                      helperText={touchedFields.service && errors.service}
                      onBlur={() =>
                          setTouchedFields((prev) => ({ ...prev, service: true }))
                      }
                    />
                  )}
                />
              </FormControl>

              <Typography variant="h6" mt={2}>
                Features
              </Typography>
              {processs.map((process, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: 15,
                  }}
                >
                  <TextField
                    fullWidth
                    label="Feature Heading"
                    name="heading"
                    value={process.heading}
                    onChange={(e) => handleProcessChange(index, e)}
                    required
                  />
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    onChange={(files) => handleProcessIconChange(index, files)}
                    dropzoneText="Drag and drop an icon here or click to select"
                    showPreviews={true}
                    showPreviewsInDropzone={false}
                    previewText="Selected files"
                    filesLimit={1}
                  />
                  {process.icon && (
                    <img
                      src={
                        process.icon instanceof File
                          ? URL.createObjectURL(process.icon)
                          : process.icon
                      }
                      alt="Feature Icon"
                      width="50"
                    />
                  )}

                  <IconButton onClick={() => removeprocess(index)} color="error">
                    <Delete />
                  </IconButton>
                </div>
              ))}
              <Button startIcon={<Add />} onClick={addProcess}>
                Add Feature
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={updateLoading}
              >
                {updateLoading ? "Updating..." : "Update"}
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default ServiceProcessEditForm;