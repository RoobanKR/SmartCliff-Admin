import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  Snackbar,
  Alert,
  Container,
  Tooltip
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { createCareer } from '../../redux/slices/career/career';
import LeftNavigationBar from '../../navbars/LeftNavigationBar';
import { HelpOutline } from '@mui/icons-material';

const CareerAddForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subTitle: '',
    subDescription: '',
    image: null,
    imagePreview: null,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.subTitle || !formData.subDescription) {
      setSnackbar({
        open: true,
        message: 'All fields are required',
        severity: 'error'
      });
      return;
    }

    if (!formData.image) {
      setSnackbar({
        open: true,
        message: 'Image is required',
        severity: 'error'
      });
      return;
    }

    setSubmitting(true);

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('subTitle', formData.subTitle);
      form.append('subDescription', formData.subDescription);
      form.append('image', formData.image);

      // Dispatch the createCareer action
      const successMessage = await dispatch(createCareer(form)).unwrap();

      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success'
      });

      // Redirect after successful submission
      setTimeout(() => {
        navigate('/career-control'); // Adjust the navigation path as necessary
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
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
        <Paper elevation={0}>
          <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mt={2} mb={2}>
            <Button variant="outlined" color="primary" onClick={handleBack}>
              Back
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', flex: 1 }}>
              <Typography variant="h4" sx={{ position: "relative", padding: 0, margin: 0, fontWeight: 300, fontSize: { xs: "32px", sm: "40px" }, color: "#747474", textAlign: "center", textTransform: "uppercase", paddingBottom: "5px", "&::before": { content: '""', width: "28px", height: "5px", display: "block", position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, "&::after ": { content: '""', width: "100px", height: "1px", display: "block", position: "relative", marginTop: "5px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, }}>
               Career Add Form
              </Typography>
              <Tooltip title="This is where you can add the Career Page." arrow>
                <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
              </Tooltip>
            </Box>
          </Box>
                    <Divider sx={{ mb: 3 }} />

                    <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
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
                    required
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    label="Subtitle"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    label="Sub Description"
                    name="subDescription"
                    value={formData.subDescription}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                    margin="normal"
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Image
                      </Typography>
                      <Box sx={{ mb: 2, textAlign: 'center' }}>
                        {formData.imagePreview && (
                          <Box
                            component="img"
                            src={formData.imagePreview}
                            alt="Career Preview"
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

              {/* Submit Button */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submitting}
                  sx={{ minWidth: 120 }}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Create'}
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
        </Container>
      }
    />
  );
};

export default CareerAddForm;