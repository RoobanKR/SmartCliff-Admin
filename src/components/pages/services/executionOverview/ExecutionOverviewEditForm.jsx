import React, { useCallback, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  FormControl,
  Autocomplete,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { useDispatch, useSelector } from "react-redux";
import { fetchExecutionHighlights } from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import { CloudUpload, DeleteOutline, RemoveCircleOutline } from "@mui/icons-material";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { fetchExecutionOverviewById, updateExecutionOverview } from "../../../redux/slices/services/executionOverview/ExecutionOverview";
import { useDropzone } from "react-dropzone";
 import AddIcon from "@mui/icons-material/Add";

const ExecutionOverviewEditForm = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [sections, setSections] = useState([{ title: "", count: 0 }]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector((state) => state.businessService.businessServiceData);
  const executionHighlights = useSelector((state) => state.executionHighlights.executionHighlights);
  const executionOverview = useSelector((state) => state.executionOverviews.executionOverview);
  const isLoading = useSelector((state) => state.executionOverviews.loading);
  const [filteredServices, setFilteredServices] = useState([]);
  const [errors, setErrors] = useState({ name: "", image: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) {
      setErrors((prev) => ({ ...prev, image: "Invalid file" }));
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Only image files are allowed" }));
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, image: "File size should be less than 5MB" }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setUploadedImage(Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
  }, []);

  const removeImage = () => {
    setUploadedImage(null);
    setExistingImageUrl(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    multiple: false
  });

  useEffect(() => {
    dispatch(fetchExecutionOverviewById(id));
    dispatch(fetchServices());
    dispatch(fetchExecutionHighlights());
    dispatch(getAllBussinessServices());
  }, [dispatch, id]);

  useEffect(() => {
    if (executionOverview) {
      setName(executionOverview.name);
      const sectionsData = executionOverview.sections 
        ? executionOverview.sections.map(section => ({
            title: section.title || "",
            count: Number(section.count) || 0
          }))
        : [{ title: "", count: 0 }];
      
      setSections(sectionsData);
      setSelectedService(executionOverview.service);
      setSelectedBusinessService(executionOverview.business_service);
      if (executionOverview.image) {
        setExistingImageUrl(executionOverview.image);
      }
    }
  }, [executionOverview]);

  useEffect(() => {
    if (businessServiceData.length > 0 && executionOverview?.business_service) {
      const matchedService = businessServiceData.find(
        (service) => service._id === executionOverview.business_service._id
      );
      setSelectedBusinessService(matchedService || null);
    }
  }, [businessServiceData, executionOverview]);

  useEffect(() => {
    if (selectedBusinessService) {
      const filtered = serviceData.filter(
        (service) => service.business_services?._id === selectedBusinessService._id
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(serviceData || []);
    }
  }, [selectedBusinessService, serviceData]);

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    if (newValue) {
      const filtered = serviceData.filter(
        (service) => service.business_services?._id === newValue._id
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  };

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: field === "count" ? Number(value) : value
    };
    setSections(updatedSections);
  };

  const handleAddSection = () => {
    setSections([...sections, { title: "", count: 0 }]);
  };

  const handleRemoveSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!name.trim()) {
        setErrors((prev) => ({ ...prev, name: "Name is required" }));
        return;
      }
      
      if (!selectedService || !selectedBusinessService) {
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('service', selectedService._id);
      formData.append('business_service', selectedBusinessService._id);
      formData.append('sections', JSON.stringify(sections));

      if (uploadedImage) {
        formData.append('image', uploadedImage);
      } else if (existingImageUrl) {
        formData.append('existingImageUrl', existingImageUrl);
      }

      await dispatch(updateExecutionOverview({ id, payload: formData }));

      setSuccessMessage("Execution Overview updated successfully!");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/Execution_Overview-control"); 
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <LeftNavigationBar
      Content={
        <Paper
          elevation={3}
          style={{ padding: 20, margin: "auto", maxWidth: 600 }}
        >
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
            Edit Execution Overview
          </Typography>
          <br />

          <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                />
              </Grid>

              {sections.map((section, index) => (
                <Grid item key={index}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={5}>
                      <TextField
                        label="Section Title"
                        variant="outlined"
                        value={section.title}
                        onChange={(e) =>
                          handleSectionChange(index, "title", e.target.value)
                        }
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        label="Count"
                        variant="outlined"
                        type="number"
                        value ={section.count}
                        onChange={(e) =>
                          handleSectionChange(index, "count", e.target.value)
                        }
                        fullWidth
                        required
                      />
                    </Grid>
                    {index === sections.length - 1 && (
                      <Grid item>
                        <IconButton onClick={handleAddSection}>
                          <AddIcon color="secondary" />
                        </IconButton>
                      </Grid>
                    )}
                    {index !== 0 && (
                      <Grid item>
                        <IconButton onClick={() => handleRemoveSection(index)}>
                          <RemoveCircleOutline />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              ))}

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    id="Business Services"
                    options={businessServiceData || []}
                    getOptionLabel={(option) => option?.name || ""}
                    value={selectedBusinessService}
                    onChange={handleBussinessServiceChange}
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
                <br />
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
                <div 
                  {...getRootProps()} 
                  style={{
                    border: '2px dashed #cccccc',
                    borderRadius: '4px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? '#f0f0f0' : 'white'
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUpload style={{ fontSize: 50, color: '#a0a0a0' }} />
                  {uploadedImage ? (
                    <div>
                      <img 
                        src={uploadedImage.preview} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '200px', 
                          marginTop: '10px' 
                        }} 
                      />
                      <Button 
                        startIcon={<DeleteOutline />} 
                        onClick={removeImage} 
                        color="secondary"
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : existingImageUrl ? (
                    <div>
                      <img 
                        src={existingImageUrl} 
                        alt="Existing" 
                        style={{ 
                          maxWidth: '100%', maxHeight: '200px', 
                          marginTop: '10px' 
                        }} 
                      />
                      <Button 
                        startIcon={<DeleteOutline />} 
                        onClick={removeImage} 
                        color="secondary"
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      {isDragActive 
                        ? "Drop the file here ..." 
                        : "Drag 'n' drop an image here, or click to select a file"}
                    </Typography>
                  )}
                </div>
                {errors.image && (
                  <Typography 
                    color="error" 
                    variant="body2" 
                    style={{ marginTop: '10px' }}
                  >
                    {errors.image}
                  </Typography>
                )}
              </Grid>

              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={2000}
            onClose={() => setOpenSnackbar(false)}
          >
            <Alert severity="success">{successMessage}</Alert>
          </Snackbar>
        </Paper>
      }
    />
  );
};

export default ExecutionOverviewEditForm;