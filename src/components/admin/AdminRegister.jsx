import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { registerAdmin } from '../redux/slices/user/admin';
import LeftNavigationBar from '../navbars/LeftNavigationBar';
import { Cookies, useCookies } from 'react-cookie';

const AdminRegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    gender: '',
    dob: null,
    role: 'admin',
    profile_pic: null
  });
  const [preview, setPreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dob: date }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (file.size > 3 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Image size exceeds the 3MB limit',
          severity: 'error'
        });
        return;
      }
      
      setFormData(prev => ({ ...prev, profile_pic: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.phone || !formData.password || !formData.gender || 
        !formData.dob || !formData.profile_pic) {
      setSnackbar({
        open: true,
        message: 'All fields are required',
        severity: 'error'
      });
      return;
    }

    // Create FormData object to handle file upload
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'profile_pic') {
        formDataToSend.append('profile_pic', formData.profile_pic);
      } else if (key === 'dob') {
        formDataToSend.append('dob', formData.dob.toISOString().split('T')[0]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    setLoading(true);
    
    try {
        const result = await dispatch(registerAdmin({
            formData: formDataToSend, 
            token: cookies.token
          })).unwrap();      
      // Extract success message from the array format
      let successMessage = 'Admin registered successfully';
      if (result.message && Array.isArray(result.message)) {
        const successMsg = result.message.find(msg => msg.key === "success");
        if (successMsg && successMsg.value) {
          successMessage = successMsg.value;
        }
      }
      
      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success'
      });

      // Redirect after successful registration
      setTimeout(() => {
        navigate('/admin/control'); // Adjust the navigation path as necessary
      }, 1500);

    } catch (error) {
      console.error('Error registering admin:', error);
      
      // Extract error message from the array format if possible
      let errorMessage = 'An error occurred during registration';
      
      if (error && error.message && Array.isArray(error.message)) {
        const errorMsg = error.message.find(msg => msg.key === "error");
        if (errorMsg && errorMsg.value) {
          errorMessage = errorMsg.value;
        }
      } else if (error && typeof error.message === 'string') {
        errorMessage = error.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Register New Admin
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      name="gender"
                      value={formData.gender}
                      label="Gender"
                      onChange={handleChange}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.dob}
                      onChange={handleDateChange}
                      renderInput={(params) => 
                        <TextField {...params} fullWidth margin="normal" required />
                      }
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      name="role"
                      value={formData.role}
                      label="Role"
                      onChange={handleChange}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="superadmin">Super Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Profile Picture
                    </Typography>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-pic-upload"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="profile-pic-upload">
                      <Button variant="contained" component="span" color="primary">
                        Upload Photo
                      </Button>
                    </label>
                    {preview && (
                      <Box mt={2} display="flex" justifyContent="center">
                        <img 
                          src={preview} 
                          alt="Profile preview" 
                          style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} 
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  sx={{ minWidth: 150 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Register Admin'}
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

export default AdminRegistrationForm;