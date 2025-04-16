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
    import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
    import { getYearlyServiceById, updateYearlyService } from '../../../redux/slices/aboutpage/yearlyServices/yearlyServices';

    const YearlyServiceEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const yearlyService = useSelector((state) => state.yearlyService.selectedService); // Get the current yearly service from the Redux store

    const [formData, setFormData] = useState({
        year: '',
        services: []
    });

    // Fetch yearly service data if in edit mode
    useEffect(() => {
        if (isEditMode) {
        const fetchYearlyService = async () => {
            try {
            await dispatch(getYearlyServiceById(id)); // Fetch yearly service by ID
            setLoading(false);
            } catch (error) {
            console.error('Error fetching yearly service:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message?.[0]?.value || 'Failed to load yearly service data',
                severity: 'error'
            });
            setLoading(false);
            }
        };
        
        fetchYearlyService();
        }
    }, [id, isEditMode, dispatch]);

    // Set form data when yearly service is fetched
    useEffect(() => {
        if (yearlyService) {
        setFormData({
            year: yearlyService.year || '',
            services: yearlyService.services.map(s => ({
            businessService: s.businessService || '',
            service: s.service || []
            }))
        });
        }
    }, [yearlyService]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceChange = (index, field, value) => {
        setFormData(prev => {
        const updatedServices = [...prev.services];
        updatedServices[index] = { ...updatedServices[index], [field]: value };
        return { ...prev, services: updatedServices };
        });
    };

    const handleAddService = () => {
        setFormData(prev => ({
        ...prev,
        services: [
            ...prev.services,
            { businessService: '', service: [] }
        ]
        }));
    };

    const handleRemoveService = (index) => {
        setFormData(prev => {
        const updatedServices = [...prev.services];
        updatedServices.splice(index, 1);
        return { ...prev, services: updatedServices };
        });
    };

    const handleAddSubService = (index) => {
        setFormData(prev => {
        const updatedServices = [...prev.services];
        updatedServices[index].service.push('');
        return { ...prev, services: updatedServices };
        });
    };

    const handleSubServiceChange = (index, subIndex, value) => {
        setFormData(prev => {
        const updatedServices = [...prev.services];
        updatedServices[index].service[subIndex] = value;
        return { ...prev, services: updatedServices };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.year) {
        setSnackbar({
            open: true,
            message: 'Year is required',
            severity: 'error'
        });
        return;
        }
        
        // Validate each service
        for (let i = 0; i < formData.services.length; i++) {
        const service = formData.services[i];
        if (!service.businessService || !service.service.length) {
            setSnackbar({
            open: true,
            message: `Business service and service are required for all services`,
            severity: 'error'
            });
            return;
        }
        }

        setSubmitting(true);
        
        try {
        const form = new FormData();
        form.append('year', formData.year);
        
        // Prepare services for submission
        const servicesForSubmit = formData.services.map(s => ({
            businessService: s.businessService,
            service: s.service
        }));
        
        form.append('services', JSON.stringify(servicesForSubmit));
        
        // Dispatch the updateYearlyService action
        const successMessage = await dispatch(updateYearlyService({ id, formData: form })).unwrap();

        setSnackbar({
            open: true,
            message: successMessage,
            severity: 'success'
        });
        
        // Redirect after successful submission
        setTimeout(() => {
            navigate('/about/yearly-service-control');
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
                {isEditMode ? 'Edit Yearly Service' : 'Create Yearly Service'}
                </Typography>
                
                <Divider sx={{ mb: 3 }} />
                
                <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Main Details */}
                    <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        margin="normal"
                    />
                    </Grid>
                    
                    {/* Services */}
                    <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" gutterBottom>
                        Services
                        </Typography>
                        <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={handleAddService}
                        >
                        Add Service
                        </Button>
                    </Stack>
                    
                    {formData.services.map((service, index) => (
                        <Paper key={index} elevation={2} sx={{ p: 2, mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">Service #{index + 1}</Typography>
                                <IconButton onClick={() => handleRemoveService(index)} color="error">
                                <DeleteIcon />
                                </IconButton>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Business Service"
                                value={service.businessService}
                                onChange={(e) => handleServiceChange(index, 'businessService', e.target.value)}
                                required
                                margin="normal"
                            />
                            
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={() => handleAddSubService(index)}
                                sx={{ mt: 2 }}
                            >
                                Add Sub-Service
                            </Button>
                            
                            {service.service.map((subService, subIndex) => (
                                <TextField
                                key={subIndex}
                                fullWidth
                                label={`Sub-Service ${subIndex + 1}`}
                                value={subService}
                                onChange={(e) => handleSubServiceChange (index, subIndex, e.target.value)}
                                margin="normal"
                                />
                            ))}
                            </Grid>
                        </Grid>
                        </Paper>
                    ))}
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

    export default YearlyServiceEditForm;