import React, { useState, useEffect } from 'react';
import {
  Box, Button, Container, TextField, Typography, Paper, Grid,
  IconButton, Divider, Card, CardContent, CardHeader, Avatar,
  List, ListItem, ListItemText, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, FormControl,
  InputLabel, MenuItem, Select, Snackbar, Alert,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, HelpOutline } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LeftNavigationBar from '../../navbars/LeftNavigationBar';
import { createFooter } from '../../redux/slices/footer/footer';
import { useDispatch } from 'react-redux';

const FooterAddForm = () => {
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    socials: [],
    quickLinks: [{ title: 'Quick Links', links: [] }],
    support: [{ title: 'Support', links: [] }],
    business: {
      title: 'Business',
      sections: []
    },
    contact: {
      title: 'Contact',
      phone: '',
      secondaryNumber:'',
      address: '',
      email:""
    }
  });
  
  // Dialogs state
  const [openSocialDialog, setOpenSocialDialog] = useState(false);
  const [currentSocial, setCurrentSocial] = useState({ platform: '', url: '', icon: '' });
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [currentLink, setCurrentLink] = useState({ href: '', label: '' });
  const [currentSection, setCurrentSection] = useState('quickLinks');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [openBusinessDialog, setOpenBusinessDialog] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState({ title: '', links: [] });
  const [openBusinessLinkDialog, setOpenBusinessLinkDialog] = useState(false);
  const [currentBusinessLink, setCurrentBusinessLink] = useState({ href: '', label: '' });
  const [currentBusinessIndex, setCurrentBusinessIndex] = useState(0);
  
  // Logo handlers
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  
  // Social media handlers
  const handleOpenSocialDialog = () => {
    setCurrentSocial({ platform: '', url: '', icon: '' });
    setOpenSocialDialog(true);
  };
  
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setCurrentSocial(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSocial = () => {
    setFormData(prev => ({
      ...prev,
      socials: [...prev.socials, currentSocial]
    }));
    setOpenSocialDialog(false);
  };
  
  const handleRemoveSocial = (index) => {
    setFormData(prev => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index)
    }));
  };
  
  // Navigation links handlers
  const handleOpenLinkDialog = (section, sectionIndex) => {
    setCurrentLink({ href: '', label: '' });
    setCurrentSection(section);
    setCurrentSectionIndex(sectionIndex);
    setOpenLinkDialog(true);
  };
  
  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setCurrentLink(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddLink = () => {
    setFormData(prev => {
      const updated = { ...prev };
      updated[currentSection][currentSectionIndex].links.push(currentLink);
      return updated;
    });
    setOpenLinkDialog(false);
  };
  
  const handleRemoveLink = (section, sectionIndex, linkIndex) => {
    setFormData(prev => {
      const updated = { ...prev };
      updated[section][sectionIndex].links = 
        updated[section][sectionIndex].links.filter((_, i) => i !== linkIndex);
      return updated;
    });
  };
  
  // Business section handlers
  const handleOpenBusinessDialog = () => {
    setCurrentBusiness({ title: '', links: [] });
    setOpenBusinessDialog(true);
  };
  
  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setCurrentBusiness(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddBusiness = () => {
    setFormData(prev => ({
      ...prev,
      business: {
        ...prev.business,
        sections: [...prev.business.sections, { title: currentBusiness.title, links: [] }]
      }
    }));
    setOpenBusinessDialog(false);
  };
  
  const handleRemoveBusiness = (index) => {
    setFormData(prev => ({
      ...prev,
      business: {
        ...prev.business,
        sections: prev.business.sections.filter((_, i) => i !== index)
      }
    }));
  };
  
  // Business link handlers
  const handleOpenBusinessLinkDialog = (businessIndex) => {
    setCurrentBusinessLink({ href: '', label: '' });
    setCurrentBusinessIndex(businessIndex);
    setOpenBusinessLinkDialog(true);
  };
  
  const handleBusinessLinkChange = (e) => {
    const { name, value } = e.target;
    setCurrentBusinessLink(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddBusinessLink = () => {
    setFormData(prev => {
      const updated = { ...prev };
      updated.business.sections[currentBusinessIndex].links.push(currentBusinessLink);
      return updated;
    });
    setOpenBusinessLinkDialog(false);
  };
  
  const handleRemoveBusinessLink = (businessIndex, linkIndex) => {
    setFormData(prev => {
      const updated = { ...prev };
      updated.business.sections[businessIndex].links = 
        updated.business.sections[businessIndex].links.filter((_, i) => i !== linkIndex);
      return updated;
    });
  };
  
  // Contact handlers
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };
  
  // Snackbar close handler
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append logo file
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }
      
      // Append other form data as JSON strings
      formDataToSend.append('socials', JSON.stringify(formData.socials));
      formDataToSend.append('quickLinks', JSON.stringify(formData.quickLinks));
      formDataToSend.append('support', JSON.stringify(formData.support));
      formDataToSend.append('business', JSON.stringify(formData.business));
      formDataToSend.append('contact', JSON.stringify(formData.contact));
      
      // Dispatch the createFooter action
      await dispatch(createFooter(formDataToSend)).unwrap();
      
      // Show success message
      setSnackbarMessage('Footer saved successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/footer-control');
      }, 1500);
    } catch (error) {
      console.error('Error saving footer:', error);
      setSnackbarMessage('Error saving footer. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
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
                  Footer Add Form
                </Typography>
                <Tooltip title="This is where you can add the Footer details and Links." arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>
            <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
          {/* Logo Upload Section */}
          <Card sx={{ mb: 4 }}>
            <CardHeader title="Logo" />
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    component="label"
                  >
                    Upload Logo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Max size: 3MB
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  {logoPreview && (
                    <Box sx={{ maxWidth: 200 }}>
                      <img src={logoPreview} alt="Logo Preview" style={{ width: '100%' }} />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Social Media Links */}
          <Card sx={{ mb: 4 }}>
            <CardHeader 
              title="Social Media Links" 
              action={
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={handleOpenSocialDialog}
                  color="primary"
                >
                  Add Social Link
                </Button>
              }
            />
            <CardContent>
              <List>
                {formData.socials.map((social, index) => (
                  <ListItem 
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveSocial(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText 
                      primary={social.platform} 
                      secondary={social.url} 
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
          
          {/* Quick Links Section */}
          <Card sx={{ mb: 4 }}>
            <CardHeader title="Quick Links" />
            <CardContent>
              {formData.quickLinks.map((section, sectionIndex) => (
                <Box key={sectionIndex} sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {section.title}
                  </Typography>
                  <Button 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpenLinkDialog('quickLinks', sectionIndex)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    Add Link
                  </Button>
                  <List>
                    {section.links.map((link, linkIndex) => (
                      <ListItem 
                        key={linkIndex}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveLink('quickLinks', sectionIndex, linkIndex)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText 
                          primary={link.label} 
                          secondary={link.href} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </CardContent>
          </Card>
          
          {/* Support Section */}
          <Card sx={{ mb: 4 }}>
            <CardHeader title="Support" />
            <CardContent>
              {formData.support.map((section, sectionIndex) => (
                <Box key={sectionIndex} sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {section.title}
                  </Typography>
                  <Button 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpenLinkDialog('support', sectionIndex)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    Add Link
                  </Button>
                  <List>
                    {section.links.map((link, linkIndex) => (
                      <ListItem 
                        key={linkIndex}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveLink('support', sectionIndex, linkIndex)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText 
                          primary={link.label} 
                          secondary={link.href} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </CardContent>
          </Card>
          
          {/* Business Section */}
          <Card sx={{ mb: 4 }}>
            <CardHeader 
              title="Business" 
              action={
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={handleOpenBusinessDialog}
                  color="primary"
                >
                  Add Business Section
                </Button>
              }
            />
            <CardContent>
              <TextField
                fullWidth
                label="Business Title"
                name="title"
                value={formData.business.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  business: { ...prev.business, title: e.target.value }
                }))}
                margin="normal"
              />
              
              {formData.business.sections.map((section, sectionIndex) => (
                <Box key={sectionIndex} sx={{ mb: 3, pl: 2, borderLeft: '1px solid #ddd' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" gutterBottom>
                      {section.title}
                    </Typography>
                    <IconButton onClick={() => handleRemoveBusiness(sectionIndex)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <Button 
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpenBusinessLinkDialog(sectionIndex)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    Add Link
                  </Button>
                  
                  <List>
                    {section.links.map((link, linkIndex) => (
                      <ListItem 
                        key={linkIndex}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveBusinessLink(sectionIndex, linkIndex)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText 
                          primary={link.label} 
                          secondary={link.href} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </CardContent>
          </Card>
          
          {/* Contact Section */}
          <Card sx={{ mb: 4 }}>
            <CardHeader title="Contact Information" />
            <CardContent>
              <TextField
                fullWidth
                label="Contact Section Title"
                name="title"
                value={formData.contact.title}
                onChange={handleContactChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.contact.phone}
                onChange={handleContactChange}
                margin="normal"
              />
               <TextField
                fullWidth
                label="Secondry Number"
                name="secondaryNumber"
                value={formData.contact.secondaryNumber}
                onChange={handleContactChange}
                margin="normal"
              />
                             <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.contact.email}
                onChange={handleContactChange}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.contact.address}
                onChange={handleContactChange}
                margin="normal"
                multiline
                rows={3}
              />
            </CardContent>
          </Card>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Footer'}
            </Button>
          </Box>
        </form>
      </Paper>
      
      {/* Dialogs */}
      
      {/* Social Media Dialog */}
      <Dialog open={openSocialDialog} onClose={() => setOpenSocialDialog(false)}>
        <DialogTitle>Add Social Media Link</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Platform</InputLabel>
            <Select
              name="platform"
              value={currentSocial.platform}
              onChange={handleSocialChange}
              label="Platform"
            >
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
              <MenuItem value="youtube">YouTube</MenuItem>
              <MenuItem value="tiktok">TikTok</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="URL"
            name="url"
            value={currentSocial.url}
            onChange={handleSocialChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Icon Class"
            name="icon"
            value={currentSocial.icon}
            onChange={handleSocialChange}
            margin="normal"
            helperText="e.g., 'fab fa-facebook' for Font Awesome"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSocialDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSocial} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      
      {/* Navigation Link Dialog */}
      <Dialog open={openLinkDialog} onClose={() => setOpenLinkDialog(false)}>
        <DialogTitle>Add Link</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Label"
            name="label"
            value={currentLink.label}
            onChange={handleLinkChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="URL"
            name="href"
            value={currentLink.href}
            onChange={handleLinkChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLinkDialog(false)}>Cancel</Button>
          <Button onClick={handleAddLink} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      
      {/* Business Section Dialog */}
      <Dialog open={openBusinessDialog} onClose={() => setOpenBusinessDialog(false)}>
        <DialogTitle>Add Business Section</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Section Title"
            name="title"
            value={currentBusiness.title}
            onChange={handleBusinessChange}
            margin="normal"
            helperText="e.g., 'Corporate', 'Institution'"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBusinessDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBusiness} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      
      {/* Business Link Dialog */}
      <Dialog open={openBusinessLinkDialog} onClose={() => setOpenBusinessLinkDialog(false)}>
        <DialogTitle>Add Business Link</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Label"
            name="label"
            value={currentBusinessLink.label}
            onChange={handleBusinessLinkChange}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="URL"
            name="href"
            value={currentBusinessLink.href}
            onChange={handleBusinessLinkChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBusinessLinkDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBusinessLink} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
          }/>
  );
};

export default FooterAddForm;