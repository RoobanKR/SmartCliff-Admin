import React, { useCallback, useEffect, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  Grid,
  Typography,
  Paper,
  FormControl,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { useDispatch, useSelector } from "react-redux";
import { fetchExecutionHighlights } from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import { CloudUpload, DeleteOutline, RemoveCircleOutline } from "@mui/icons-material";
import { createExecutionOverview } from "../../../redux/slices/services/executionOverview/ExecutionOverview";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

const ExecutionOverviewAddForm = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
  
  const [selectedService, setSelectedService] = useState(null);
  const serviceData = useSelector((state) => state.service.serviceData);
  const executionHighlights = useSelector(
    (state) => state.executionHighlights.executionHighlights
  );
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const [filteredServices, setFilteredServices] = useState([]);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    image: "",
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [sections, setSections] = useState([{ title: "", count: "" }]);
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
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage.preview);
      }
    };
  }, [uploadedImage]);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
  }, [dispatch]);

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };

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

 const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const handleAddSection = () => {
    setSections([...sections, { title: "", count: "" }]);
  };

  const handleRemoveSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('service', selectedService._id);
      formData.append('business_service', selectedBusinessService._id);
      formData.append('sections', JSON.stringify(sections));

      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }

      await dispatch(createExecutionOverview(formData));

      // Show success message and open Snackbar
      setSuccessMessage("Execution Overview created successfully!");
      setOpenSnackbar(true);

      // Reset form
      setName("");
      setSelectedService(null);
      setSelectedBusinessService(null);
      setUploadedImage(null);
      setSections([{ title: "", count: "" }]);
      setErrors({ name: "", image: "" });

      // Redirect after a short delay
      setTimeout(() => {
        // Replace with your redirect logic, e.g., navigate to another page
        navigate("/Execution_Overview-control ");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
            Add Execution Overview
          </Typography>
          <br />

          <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={2}>
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
                <br /><br />
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

              {/* Sections Input */}
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
                        value={section.count}
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
                          <RemoveCircleOutline color="secondary" />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              ))}

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

export default ExecutionOverviewAddForm;