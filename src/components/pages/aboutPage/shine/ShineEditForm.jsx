import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  Paper,
  Grid,
  CircularProgress,
  Divider,
  Stack,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { HexColorPicker } from 'react-colorful';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { fetchShineById, updateShine } from '../../../redux/slices/aboutpage/shine/shine';

const ShineEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const shine = useSelector((state) => state.shines.currentShine); // Get the current shine from the Redux store

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    imagePreview: null,
    shineDefinition: []
  });
  const presetColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FFD700', '#1976d2'];

  const handlePresetColorSelect = (index, color) => {
    setFormData(prev => {
      const updatedDefinitions = [...prev.shineDefinition];
      updatedDefinitions[index].color = color;
      return { ...prev, shineDefinition: updatedDefinitions };
    });
  };
  
  // Fetch shine data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchShine = async () => {
        try {
          await dispatch(fetchShineById(id)); // Fetch shine by ID
          setLoading(false);
        } catch (error) {
          console.error('Error fetching shine:', error);
          setSnackbar({
            open: true,
            message: error.response?.data?.message?.[0]?.value || 'Failed to load shine data',
            severity: 'error'
          });
          setLoading(false);
        }
      };
      
      fetchShine();
    }
  }, [id, isEditMode, dispatch]);

  // Set form data when shine is fetched
  useEffect(() => {
    if (shine) {
      setFormData({
        title: shine.title || '',
        description: shine.description || '',
        image: null,
        imagePreview: shine.image || null,
        shineDefinition: shine.shineDefinition.map(def => ({
          ...def,
          icon: null,
          iconPreview: def.icon || null,
          color: def.color || '#1976d2'
        }))
      });
    }
  }, [shine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleDefinitionChange = (index, field, value) => {
    setFormData(prev => {
      const updatedDefinitions = [...prev.shineDefinition];
      updatedDefinitions[index] = { ...updatedDefinitions[index], [field]: value };
      return { ...prev, shineDefinition: updatedDefinitions };
    });
  };

  const handleIconChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => {
        const updatedDefinitions = [...prev.shineDefinition];
        updatedDefinitions[index] = {
          ...updatedDefinitions[index],
          icon: file,
          iconPreview: URL.createObjectURL(file)
        };
        return { ...prev, shineDefinition: updatedDefinitions };
      });
    }
  };

  const addDefinition = () => {
    setFormData(prev => ({
      ...prev,
      shineDefinition: [
        ...prev.shineDefinition,
        { title: '', description: '', icon: null, iconPreview: null, color: '#1976d2' }
      ]
    }));
  };

  const removeDefinition = (index) => {
    setFormData(prev => {
      const updatedDefinitions = [...prev.shineDefinition];
      updatedDefinitions.splice(index, 1);
      return { ...prev, shineDefinition: updatedDefinitions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title) {
      setSnackbar({
        open: true,
        message: 'Title is required',
        severity: 'error'
      });
      return;
    }
    
    if (!formData.image && !formData.imagePreview) {
      setSnackbar({
        open: true,
        message: 'Image is required',
        severity: 'error'
      });
      return;
    }
    
    // Validate each shine definition
    for (let i = 0; i < formData.shineDefinition.length; i++) {
      const def = formData.shineDefinition[i];
      if (!def.title || !def.description || !def.color) {
        setSnackbar({
          open: true,
          message: `Title, description, and color are required for all shine definitions`,
          severity: 'error'
        });
        return;
      }
    }

    setSubmitting(true);
    
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      
      if (formData.image) {
        form.append('image', formData.image);
      }
      
      // Prepare shine definitions for submission
      const shineDefinitionsForSubmit = formData.shineDefinition.map((def, index) => {
        const { icon, iconPreview, ...dataFields } = def;
        
        // Include information about whether we're using an existing icon
        if (!icon && iconPreview && typeof iconPreview === 'string') {
          // This indicates we're keeping an existing icon
          dataFields.existingIcon = iconPreview;
        }
        
        return dataFields;
      });
      
      form.append('shineDefinition', JSON.stringify(shineDefinitionsForSubmit));
      
      // Add icon files if present
      formData.shineDefinition.forEach((def, index) => {
        if (def.icon) {
          form.append(`icon_${index}`, def.icon);
        }
      });      
      // Dispatch the updateShine action
      const successMessage = await dispatch(updateShine({ id, formData: form })).unwrap();

      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success'
      });
      
      // Redirect after successful submission
      setTimeout(() => {
        navigate('/about/shine-control');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Extract error message from the response
      const errorMessage = error.response?.data?.message?.[0]?.value || 'An error occurred';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
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
              {isEditMode ? 'Edit Shine' : 'Create Shine'}
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Main Details */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                  
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    margin="normal"
                  />
                </Grid>
                
                {/* Image Upload */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Main Image
                      </Typography>
                      <Box sx={{ mb: 2, textAlign: 'center' }}>
                        {formData.imagePreview && (
                          <Box 
                            component="img" 
                            src={formData.imagePreview} 
                            alt="Shine Preview"
                            sx={{ 
                              maxWidth: '100%', 
                              maxHeight: 200,
                              objectFit: 'contain',
                              mb: 2
                            }}
                          />
                        )}
                      </Box>
                      
                      <Button
                        variant="contained"
                        component="label"
                        startIcon={<PhotoCamera />}
                        fullWidth
                      >
                        {formData.imagePreview ? 'Change Image' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleImageChange}
                        />
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              {/* Shine Definitions */}
              <Box sx={{ mt: 4, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" gutterBottom>
                    Shine Definitions
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={addDefinition}
                  >
                    Add Definition
                  </Button>
                </Stack>
              </Box>
              
              {formData.shineDefinition.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No shine definitions added. Click "Add Definition" to create one.
                </Alert>
              )}
              
              {formData.shineDefinition.map((def, index) => (
                <Paper key={index} elevation={2} sx={{ p: 2, mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Definition #{index + 1}</Typography>
                        <IconButton onClick={() => removeDefinition(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={def.title}
                        onChange={(e) => handleDefinitionChange(index, 'title', e.target.value)}
                        required
                        margin="normal"
                      />
                      
                      <TextField
                        fullWidth
                        label="Description"
                        value={def.description}
                        onChange={(e) => handleDefinitionChange(index, 'description', e.target.value)}
                        multiline
                        rows={3}
                        required
                        margin="normal"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      {/* Icon Upload */}
                      <Typography variant="subtitle1" gutterBottom>
                        Icon
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {def.iconPreview && (
                          <Box 
                            component="img" 
                            src={def.iconPreview} 
                            alt="Icon Preview"
                            sx={{ 
                              width: 50, 
                              height: 50,
                              objectFit: 'contain',
                              mr: 2
                            }}
                          />
                        )}
                        
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<PhotoCamera />}
                        >
                          {def.iconPreview ? 'Change Icon' : 'Upload Icon'}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => handleIconChange(index, e)}
                          />
                        </Button>
                      </Box>
                      
                      {/* Color Picker */}
                      <Typography variant="subtitle1" gutterBottom>
                        Color
                      </Typography>

                      {/* Predefined Colors */}
                      <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {presetColors.map((color) => (
                          <Box
                            key={color}
                            sx={{
                              width: 30,
                              height: 30,
                              bgcolor: color,
                              borderRadius: '50%',
                              cursor: 'pointer',
                              border: def.color === color ? '3px solid black' : '2px solid white',
                            }}
                            onClick={() => handlePresetColorSelect(index, color)}
                          />
                        ))}
                      </Box>

                      {/* Manual Hex Input */}
                      <TextField
                        fullWidth
                        label="Enter Hex Color"
                        value={def.color}
                        onChange={(e) => handleDefinitionChange(index, 'color', e.target.value)}
                        error={!/^#([0-9A-Fa-f]{3}){1,2}$/.test(def.color)} // Validate hex format
                        helperText={!/^#([0-9A-Fa-f]{3}){1,2}$/.test(def.color) ? "Enter a valid hex color (e.g., #FF5733)" : ""}
                        margin="normal"
                      />

                      {/* Color Picker */}
                      <HexColorPicker
                        color={def.color}
                        onChange={(color) => handleDefinitionChange(index, 'color', color)}
                        style={{ width: '100%', marginBottom: '10px' }}
                      />

                      {/* Color Preview */}
                      <Box sx={{
                        p: 1,
                        bgcolor: def.color,
                        color: getContrastColor(def.color),
                        textAlign: 'center',
                        borderRadius: 1
                      }}>
                        {def.color}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              
              {/* Submit Button */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit" 
                  disabled={submitting}
                  sx={{ minWidth: 120 }}
                >
                  {submitting ? <CircularProgress size={24} /> : isEditMode ? 'Update' : 'Create'}
                </Button>
              </Box>
            </form>
          </Paper>
          
          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity} 
              variant="filled"
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      }
    />
  );
};

function getContrastColor(hexColor) {
  const color = hexColor.replace('#', '');
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

export default ShineEditForm;