import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import { getUserById, updateAdmin } from '../redux/slices/user/admin';
import LeftNavigationBar from '../navbars/LeftNavigationBar';
import { useCookies } from 'react-cookie';

const AdminEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);
  
  const { loading, admin, error, success, successMessage } = useSelector(state => state.admin);
  
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

  // Fetch user data when component mounts
  useEffect(() => {
    if (id && cookies.token) {
      dispatch(getUserById({ id, token: cookies.token }));
    }
  }, [id, dispatch, cookies.token]);

  // Populate form data when admin data is fetched
  useEffect(() => {
    if (admin) {
      setFormData({
        email: admin.email || '',
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        phone: admin.phone || '',
        password: '', // Password is not populated for security reasons
        gender: admin.gender || '',
        dob: admin.dob ? new Date(admin.dob) : null,
        role: admin.role || 'admin',
        profile_pic: null // File object is not populated from API
      });
      
      // Set profile picture preview if exists
      if (admin.profile_pic) {
        setPreview(admin.profile_pic);
      }
    }
  }, [admin]);

  // Handle API success and error responses
  useEffect(() => {
    if (success && successMessage) {
      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success'
      });
      
      // Redirect after successful update
      setTimeout(() => {
        navigate('/admin/control');
      }, 1500);
    }
    
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [success, error, successMessage, navigate]);

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
    
    // Create FormData object to handle file upload
    const formDataToSend = new FormData();
    
    // Only add fields that have values to avoid overwriting with empty values
    Object.keys(formData).forEach(key => {
      if (key === 'profile_pic') {
        if (formData.profile_pic) {
          formDataToSend.append('profile_pic', formData.profile_pic);
        }
      } else if (key === 'dob') {
        if (formData.dob) {
          formDataToSend.append('dob', formData.dob.toISOString().split('T')[0]);
        }
      } else if (key === 'password') {
        // Only append password if it's not empty
        if (formData.password) {
          formDataToSend.append('password', formData.password);
        }
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    dispatch(updateAdmin({
      id,
      formData: formDataToSend,
      token: cookies.token
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading && !admin) {
    return (
      <LeftNavigationBar
        Content={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        }
      />
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Edit Admin
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
                    label="Password (leave blank to keep current)"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
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
                        {admin?.profile_pic ? 'Change Photo' : 'Upload Photo'}
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

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/control')}
                  sx={{ minWidth: 120 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  sx={{ minWidth: 150 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Admin'}
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

export default AdminEditForm;