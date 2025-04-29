import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Button, Container, TextField, Typography, Paper, Grid,
  IconButton, Card, CardContent, CardHeader,
  List, ListItem, ListItemText, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl,
  InputLabel, MenuItem, Select, CircularProgress,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, HelpOutline } from '@mui/icons-material';
import LeftNavigationBar from '../../navbars/LeftNavigationBar';
import { getFooterById, updateFooter } from '../../redux/slices/footer/footer';

const FooterEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedFooter, loading, error } = useSelector((state) => state.footer);
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [keepExistingLogo, setKeepExistingLogo] = useState(true);
  
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
      address: ''
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
  
  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch footer data on component mount
  useEffect(() => {
    dispatch(getFooterById(id));
  }, [dispatch, id]);
  
  // Populate form when data is loaded
  useEffect(() => {
    if (selectedFooter) {
      setFormData({
        socials: selectedFooter.socials || [],
        quickLinks: selectedFooter.quickLinks || [{ title: 'Quick Links', links: [] }],
        support: selectedFooter.support || [{ title: 'Support', links: [] }],
        business: selectedFooter.business || {
          title: 'Business',
          sections: []
        },
        contact: selectedFooter.contact || {
          title: 'Contact',
          phone: '',
          address: ''
        }
      });
      
      if (selectedFooter.logo) {
        setLogoPreview(`${selectedFooter.logo}`);
      }
    }
  }, [selectedFooter]);
  
  // Logo handlers
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setKeepExistingLogo(false);
    }
  };
  
  // Social media handlers
  const handleOpenSocialDialog = (social = null, index = null) => {
    if (social) {
      setCurrentSocial({ ...social });
      setEditMode(true);
      setEditIndex(index);
    } else {
      setCurrentSocial({ platform: '', url: '', icon: '' });
      setEditMode(false);
      setEditIndex(null);
    }
    setOpenSocialDialog(true);
  };
  
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setCurrentSocial(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveSocial = () => {
    setFormData(prev => {
      const updated = { ...prev };
      if (editMode && editIndex !== null) {
        updated.socials = updated.socials.map((social, index) => 
          index === editIndex ? { ...currentSocial } : social
        );
      } else {
        updated.socials = [...updated.socials, currentSocial];
      }
      return updated;
    });
    setOpenSocialDialog(false);
  };  
  const handleRemoveSocial = (index) => {
    setFormData(prev => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index)
    }));
  };
  
  // Navigation links handlers
  const handleOpenLinkDialog = (section, sectionIndex, link = null, linkIndex = null) => {
    if (link) {
      setCurrentLink({ ...link });
      setEditMode(true);
      setEditIndex(linkIndex);
    } else {
      setCurrentLink({ href: '', label: '' });
      setEditMode(false);
      setEditIndex(null);
    }
    setCurrentSection(section);
    setCurrentSectionIndex(sectionIndex);
    setOpenLinkDialog(true);
  };
  
  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setCurrentLink(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveLink = () => {
    setFormData(prev => {
      const updated = { ...prev };
      if (editMode && editIndex !== null) {
        // Create new arrays for each level
        const newSection = [...updated[currentSection]];
        const newLinks = [...newSection[currentSectionIndex].links];
        // Update the specific link
        newLinks[editIndex] = { ...currentLink };
        // Create new section object with updated links
        newSection[currentSectionIndex] = {
          ...newSection[currentSectionIndex],
          links: newLinks
        };
        // Update with the new section array
        updated[currentSection] = newSection;
      } else {
        const newSection = [...updated[currentSection]];
        newSection[currentSectionIndex] = {
          ...newSection[currentSectionIndex],
          links: [...newSection[currentSectionIndex].links, currentLink]
        };
        updated[currentSection] = newSection;
      }
      return updated;
    });
    setOpenLinkDialog(false);
  };
  
  // Fix for handleRemoveLink
  const handleRemoveLink = (section, sectionIndex, linkIndex) => {
    setFormData(prev => {
      const updated = { ...prev };
      const newSection = [...updated[section]];
      const newLinks = newSection[sectionIndex].links.filter((_, i) => i !== linkIndex);
      newSection[sectionIndex] = {
        ...newSection[sectionIndex],
        links: newLinks
      };
      updated[section] = newSection;
      return updated;
    });
  };  
  // Business section handlers
  const handleOpenBusinessDialog = (business = null, index = null) => {
    if (business) {
      setCurrentBusiness({ ...business });
      setEditMode(true);
      setEditIndex(index);
    } else {
      setCurrentBusiness({ title: '', links: [] });
      setEditMode(false);
      setEditIndex(null);
    }
    setOpenBusinessDialog(true);
  };
  
  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setCurrentBusiness(prev => ({ ...prev, [name]: value }));
  };
  

const handleSaveBusiness = () => {
  setFormData(prev => {
    const updated = { ...prev };
    if (editMode && editIndex !== null) {
      // Create a new array for sections instead of modifying the existing one
      const newSections = [...updated.business.sections];
      // For editing, preserve the links
      const existingLinks = updated.business.sections[editIndex].links;
      // Create a new object for the section
      newSections[editIndex] = { 
        title: currentBusiness.title, 
        links: [...existingLinks] // Create a copy of links array
      };
      // Update with the new array
      updated.business = {
        ...updated.business,
        sections: newSections
      };
    } else {
      updated.business = {
        ...updated.business,
        sections: [...updated.business.sections, { 
          title: currentBusiness.title, 
          links: [] 
        }]
      };
    }
    return updated;
  });
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
  const handleOpenBusinessLinkDialog = (businessIndex, link = null, linkIndex = null) => {
    if (link) {
      setCurrentBusinessLink({ ...link });
      setEditMode(true);
      setEditIndex(linkIndex);
    } else {
      setCurrentBusinessLink({ href: '', label: '' });
      setEditMode(false);
      setEditIndex(null);
    }
    setCurrentBusinessIndex(businessIndex);
    setOpenBusinessLinkDialog(true);
  };
  
  const handleBusinessLinkChange = (e) => {
    const { name, value } = e.target;
    setCurrentBusinessLink(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveBusinessLink = () => {
    setFormData(prev => {
      const updated = { ...prev };
      const newSections = [...updated.business.sections];
      if (editMode && editIndex !== null) {
        const newLinks = [...newSections[currentBusinessIndex].links];
        newLinks[editIndex] = { ...currentBusinessLink };
        newSections[currentBusinessIndex] = {
          ...newSections[currentBusinessIndex],
          links: newLinks
        };
      } else {
        newSections[currentBusinessIndex] = {
          ...newSections[currentBusinessIndex],
          links: [...newSections[currentBusinessIndex].links, currentBusinessLink]
        };
      }
      updated.business = {
        ...updated.business,
        sections: newSections
      };
      return updated;
    });
    setOpenBusinessLinkDialog(false);
  };
  
  
  const handleRemoveBusinessLink = (businessIndex, linkIndex) => {
    setFormData(prev => {
      const updated = { ...prev };
      const newSections = [...updated.business.sections];
      const newLinks = newSections[businessIndex].links.filter((_, i) => i !== linkIndex);
      newSections[businessIndex] = {
        ...newSections[businessIndex],
        links: newLinks
      };
      updated.business = {
        ...updated.business,
        sections: newSections
      };
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
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  const handleCloseSnackbar = () => {
    setSnackbarMessage(prev => ({ ...prev, open: false }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Append logo file if a new one was selected
      if (!keepExistingLogo && logoFile) {
        formDataToSend.append('logo', logoFile);
      }
      
      // Add a flag to indicate if we're keeping the existing logo
      formDataToSend.append('keepExistingLogo', keepExistingLogo.toString());
      
      // Append other form data as JSON strings
      formDataToSend.append('socials', JSON.stringify(formData.socials));
      formDataToSend.append('quickLinks', JSON.stringify(formData.quickLinks));
      formDataToSend.append('support', JSON.stringify(formData.support));
      formDataToSend.append('business', JSON.stringify(formData.business));
      formDataToSend.append('contact', JSON.stringify(formData.contact));
      
      await dispatch(updateFooter({ id, formData: formDataToSend })).unwrap();
      showSnackbar('Footer updated successfully!');
      
      // Redirect after a short delay to allow the user to see the success message
      setTimeout(() => {
        navigate('/footer-control');
      }, 1500);
    } catch (error) {
      console.error('Error updating footer:', error);
      alert(`Error updating footer: ${error.message}`);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <LeftNavigationBar
        Content={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress />
          </Box>
        }
      />
    );
  }

  if (error) {
    return (
      <LeftNavigationBar
        Content={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <Typography color="error" variant="h6">
              Error loading footer data: {error}
            </Typography>
          </Box>
        }
      />
    );
  }
  
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
                  Footer Edit Form
                </Typography>
                <Tooltip title="This is where you can edit the Footer data and Links." arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>
            <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
              {/* Logo Upload Section */}
              <Card sx={{ mb: 4, backgroundColor: "gray" }}>
                <CardHeader title="Logo" />
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Button
                        variant="contained"
                        component="label"
                      >
                        Upload New Logo
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
                          {selectedFooter && selectedFooter.logo && (
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                              {keepExistingLogo ? "Using existing logo" : "Using new logo"}
                            </Typography>
                          )}
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
                      onClick={() => handleOpenSocialDialog()}
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
                          <Box>
                            <IconButton 
                              edge="end" 
                              onClick={() => handleOpenSocialDialog(social, index)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleRemoveSocial(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Box>
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
                              <Box>
                                <IconButton 
                                  edge="end" 
                                  onClick={() => handleOpenLinkDialog('quickLinks', sectionIndex, link, linkIndex)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => handleRemoveLink('quickLinks', sectionIndex, linkIndex)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
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
                              <Box>
                                <IconButton 
                                  edge="end" 
                                  onClick={() => handleOpenLinkDialog('support', sectionIndex, link, linkIndex)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => handleRemoveLink('support', sectionIndex, linkIndex)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
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
                      onClick={() => handleOpenBusinessDialog()}
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
                        <Box>
                          <IconButton 
                            onClick={() => handleOpenBusinessDialog(section, sectionIndex)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleRemoveBusiness(sectionIndex)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
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
                              <Box>
                                <IconButton 
                                  edge="end" 
                                  onClick={() => handleOpenBusinessLinkDialog(sectionIndex, link, linkIndex)}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => handleRemoveBusinessLink(sectionIndex, linkIndex)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
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
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                <Button 
                  variant="outlined"
                  onClick={() => navigate('/admin/footer/list')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                >
                  Update Footer
                </Button>
              </Box>
            </form>
          </Paper>
          
          {/* Dialogs */}
          
          {/* Social Media Dialog */}
          <Dialog open={openSocialDialog} onClose={() => setOpenSocialDialog(false)}>
            <DialogTitle>{editMode ? 'Edit Social Media Link' : 'Add Social Media Link'}</DialogTitle>
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
              <Button onClick={handleSaveSocial} color="primary">{editMode ? 'Save' : 'Add'}</Button>
            </DialogActions>
          </Dialog>
          
          {/* Navigation Link Dialog */}
          <Dialog open={openLinkDialog} onClose={() => setOpenLinkDialog(false)}>
            <DialogTitle>{editMode ? 'Edit Link' : 'Add Link'}</DialogTitle>
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
              <Button onClick={handleSaveLink} color="primary">{editMode ? 'Save' : 'Add'}</Button>
            </DialogActions>
          </Dialog>
          
          {/* Business Section Dialog */}
          <Dialog open={openBusinessDialog} onClose={() => setOpenBusinessDialog(false)}>
            <DialogTitle>{editMode ? 'Edit Business Section' : 'Add Business Section'}</DialogTitle>
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
              <Button onClick={handleSaveBusiness} color="primary">{editMode ? 'Save' : 'Add'}</Button>
            </DialogActions>
          </Dialog>
          
          {/* Business Link Dialog */}
          <Dialog open={openBusinessLinkDialog} onClose={() => setOpenBusinessLinkDialog(false)}>
            <DialogTitle>{editMode ? 'Edit Business Link' : 'Add Business Link'}</DialogTitle>
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
              <Button onClick={handleSaveBusinessLink} color="primary">{editMode ? 'Save' : 'Add'}</Button>
            </DialogActions>
          </Dialog>
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
      }
    />
  );
};

export default FooterEditForm;