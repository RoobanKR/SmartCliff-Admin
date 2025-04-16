import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { fetchWCYHireById, updateWCYHire } from '../../../redux/slices/business/WCYHire/WcyHire';

const WCYHireUpdateForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the ID from the URL
  const { currentWCYHire, loading } = useSelector((state) => state.wcyHire);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    imagePreview: null,
    wcyDefinition: [],
    type: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchWCYHireById(id)); // Fetch the WCYHire by ID
    };
    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    if (currentWCYHire) {
      setFormData({
        title: currentWCYHire.title,
        description: currentWCYHire.description,
        image: null,
        imagePreview: currentWCYHire.image, // Set the existing image URL
        wcyDefinition: currentWCYHire.wcyDefinition.map(def => ({
          ...def,
          iconPreview: def.icon // Set the existing icon URL
        })),
        type: currentWCYHire.type
      });
    }
  }, [currentWCYHire]);

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
      const updatedDefinitions = [...prev.wcyDefinition];
      updatedDefinitions[index] = { ...updatedDefinitions[index], [field]: value };
      return { ...prev, wcyDefinition: updatedDefinitions };
    });
  };

  const addDefinition = () => {
    setFormData(prev => ({
      ...prev,
      wcyDefinition: [
        ...prev.wcyDefinition,
        { title: '', description: '', icon: null, iconPreview: null }
      ]
    }));
  };

  const removeDefinition = (index) => {
    setFormData(prev => {
      const updatedDefinitions = [...prev.wcyDefinition];
      updatedDefinitions.splice(index, 1);
      return { ...prev, wcyDefinition: updatedDefinitions };
    });
  };

  const handleIconChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => {
        const updatedDefinitions = [...prev.wcyDefinition];
        updatedDefinitions[index] = {
          ...updatedDefinitions[index],
          icon: file,
          iconPreview: URL.createObjectURL(file)
        };
        return { ...prev, wcyDefinition: updatedDefinitions };
      });
    }
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

    // Validate each WCY definition
    for (let i = 0; i < formData.wcyDefinition.length; i++) {
      const def = formData.wcyDefinition[i];
      if (!def.title || !def.description) {
        setSnackbar({
          open: true,
          message: `Title and description are required for all WCY definitions`,
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
      form.append('type', formData.type); // Include type in the form data

      if (formData.image) {
        form.append('image', formData.image);
      }

      // Prepare WCY definitions for submission
      const wcyDefinitionsForSubmit = formData.wcyDefinition.map((def, index) => {
        const { icon, iconPreview, ...dataFields } = def;
        return dataFields;
      });

      form.append('wcyDefinition', JSON.stringify(wcyDefinitionsForSubmit));

      // Add icon files if present
      formData.wcyDefinition.forEach((def, index) => {
        if (def.icon) {
          form.append(`icon_${index}`, def.icon);
        } else {
        }
      });

      // Dispatch the updateWCYHire action
      const successMessage = await dispatch(updateWCYHire({ id, formData: form })).unwrap();

      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success'
      });

      // Redirect after successful submission
      setTimeout(() => {
        navigate('/business/wcy-hire-control'); // Adjust the navigation path as necessary
      }, 1500);

    } catch (error) {
      console.error('Error submitting form:', error);
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
              Update WCY Hire
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

                  {/* Type Dropdown */}
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="type-label">Type</InputLabel>
                    <Select
                      labelId="type-label"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="hirefromus">Hire From Us</MenuItem>
                      <MenuItem value="trainfromus">Train From Us</MenuItem>
                      <MenuItem value="institute">Institute</MenuItem>
                    </Select>
                  </FormControl>
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
                            alt="WCY Hire Preview"
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

              {/* WCY Definitions */}
              <Box sx={{ mt: 4, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" gutterBottom>
                    WCY Definitions
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

              {formData.wcyDefinition.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No WCY definitions added. Click "Add Definition" to create one.
                </Alert>
              )}

              {formData.wcyDefinition.map((def, index) => (
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
                  {submitting ? <CircularProgress size={24} /> : 'Update'}
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

export default WCYHireUpdateForm;