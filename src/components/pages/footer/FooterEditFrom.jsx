import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Button, Container, TextField, Typography, Paper, Grid,
  IconButton, Card, CardContent, CardHeader,
  List, ListItem, ListItemText, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl,
  InputLabel, MenuItem, Select, CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Check as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
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
  const [editMode, setEditMode] = useState({
    logo: false,
    socials: false,
    quickLinks: false,
    support: false,
    business: false,
    contact: false
  });
  
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
  
  // Toggle edit mode for a section
  const toggleEditMode = (section) => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
    
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
      alert('Footer updated successfully!');
      navigate('/footer-control'); // Navigate to footer list after successful update
    } catch (error) {
      console.error('Error updating footer:', error);
      alert(`Error updating footer: ${error.message}`);
    }
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
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: "Merriweather, serif",
                fontWeight: 700,
                textAlign: "center",
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 3,
                mt: -1,
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
              Edit Footer
            </Typography>
            
            <form onSubmit={handleSubmit}>
              {/* Logo Upload Section */}
              <Card sx={{ mb: 4, backgroundColor: "#f5f5f5" }}>
                <CardHeader 
                  title="Logo" 
                  action={
                    <IconButton onClick={() => toggleEditMode('logo')}>
                      {editMode.logo ? <CheckIcon color="primary" /> : <EditIcon />}
                    </IconButton>
                  }
                />
                <CardContent>
                  {editMode.logo ? (
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
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={12}>
                        {logoPreview ? (
                          <Box sx={{ maxWidth: 200 }}>
                            <img src={logoPreview} alt="Logo Preview" style={{ width: '100%' }} />
                          </Box>
                        ) : (
                          <Typography variant="body2">No logo uploaded</Typography>
                        )}
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
              
              {/* Social Media Links */}
              <Card sx={{ mb: 4, backgroundColor: "#f5f5f5" }}>
                <CardHeader 
                  title="Social Media Links" 
                  action={
                    <IconButton onClick={() => toggleEditMode('socials')}>
                      {editMode.socials ? <CheckIcon color="primary" /> : <EditIcon />}
                    </IconButton>
                  }
                />
                <CardContent>
                  {editMode.socials ? (
                    <>
                      <Button 
                        startIcon={<AddIcon />} 
                        onClick={handleOpenSocialDialog}
                        color="primary"
                        sx={{ mb: 2 }}
                      >
                        Add Social Link
                      </Button>
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
                    </>
                  ) : (
                    <List>
                      {formData.socials.length > 0 ? (
                        formData.socials.map((social, index) => (
                          <ListItem key={index}>
                            <ListItemText 
                              primary={social.platform} 
                              secondary={social.url} 
                            />
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body2">No social links added</Typography>
                      )}
                    </List>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Links Section */}
              <Card sx={{ mb: 4, backgroundColor: "#f5f5f5" }}>
                <CardHeader 
                  title="Quick Links" 
                  action={
                    <IconButton onClick={() => toggleEditMode('quickLinks')}>
                      {editMode.quickLinks ? <CheckIcon color="primary" /> : <EditIcon />}
                    </IconButton>
                  }
                />
                <CardContent>
                  {formData.quickLinks.map((section, sectionIndex) => (
                    <Box key={sectionIndex} sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {section.title}
                      </Typography>
                      
                      {editMode.quickLinks ? (
                        <>
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
                        </>
                      ) : (
                        <List>
                          {section.links.length > 0 ? (
                            section.links.map((link, linkIndex) => (
                              <ListItem key={linkIndex}>
                                <ListItemText 
                                  primary={link.label} 
                                  secondary={link.href} 
                                />
                              </ListItem>
                            ))
                          ) : (
                            <Typography variant="body2">No links added</Typography>
                          )}
                        </List>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
              
              {/* Support Section */}
              <Card sx={{ mb: 4, backgroundColor: "#f5f5f5" }}>
                <CardHeader 
                  title="Support" 
                  action={
                    <IconButton onClick={() => toggleEditMode('support')}>
                      {editMode.support ? <CheckIcon color="primary" /> : <EditIcon />}
                    </IconButton>
                  }
                />
                <CardContent>
                  {formData.support.map((section, sectionIndex) => (
                    <Box key={sectionIndex} sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {section.title}
                      </Typography>
                      
                      {editMode.support ? (
                        <>
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
                        </>
                      ) : (
                        <List>
                          {section.links.length > 0 ? (
                            section.links.map((link, linkIndex) => (
                              <ListItem key={linkIndex}>
                                <ListItemText 
                                  primary={link.label} 
                                  secondary={link.href} 
                                />
                              </ListItem>
                            ))
                          ) : (
                            <Typography variant="body2">No links added</Typography>
                          )}
                        </List>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
              
              {/* Business Section */}
              <Card sx={{ mb: 4, backgroundColor: "#f5f5f5" }}>
                <CardHeader 
                  title="Business" 
                  action={
                    <IconButton onClick={() => toggleEditMode('business')}>
                      {editMode.business ? <CheckIcon color="primary" /> : <EditIcon />}
                    </IconButton>
                  }
                />
                <CardContent>
                  {editMode.business ? (
                    <>
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
                      
                      <Button 
                        startIcon={<AddIcon />} 
                        onClick={handleOpenBusinessDialog}
                        color="primary"
                        sx={{ mt: 2, mb: 2 }}
                      >
                        Add Business Section
                      </Button>
                      
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
                    </>
                  ) : (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Title: {formData.business.title}
                      </Typography>
                      
                      {formData.business.sections.length > 0 ? (
                        formData.business.sections.map((section, sectionIndex) => (
                          <Box key={sectionIndex} sx={{ mb: 3, pl: 2, borderLeft: '1px solid #ddd' }}>
                            <Typography variant="h6" gutterBottom>
                              {section.title}
                            </Typography>
                            
                            <List>
                              {section.links.length > 0 ? (
                                section.links.map((link, linkIndex) => (
                                  <ListItem key={linkIndex}>
                                    <ListItemText 
                                      primary={link.label} 
                                      secondary={link.href} 
                                    />
                                  </ListItem>
                                ))
                              ) : (
                                <Typography variant="body2">No links added</Typography>
                              )}
                            </List>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2">No business sections added</Typography>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Contact Section */}
              <Card sx={{ mb: 4, backgroundColor: "#f5f5f5" }}>
                <CardHeader 
                  title="Contact Information" 
                  action={
                    <IconButton onClick={() => toggleEditMode('contact')}>
                      {editMode.contact ? <CheckIcon color="primary" /> : <EditIcon />}
                    </IconButton>
                  }
                />
                <CardContent>
                  {editMode.contact ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <Typography variant="subtitle1" gutterBottom>
                        Title: {formData.contact.title}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        Phone: {formData.contact.phone || 'Not provided'}
                      </Typography>
                      <Typography variant="body1">
                        Address: {formData.contact.address || 'Not provided'}
                      </Typography>
                    </>
                  )}
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
        </Container>
      }
    />
  );
};

export default FooterEditForm;