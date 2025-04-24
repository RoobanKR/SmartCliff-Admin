import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Snackbar,
  Alert,
  useTheme,
  Tooltip,
  Box,
  IconButton,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import {
  getByIdBussinessService,
  updateBussinessService,
} from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { HelpOutline } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";

const BussinessServiceEditForm = () => {
  const { businessServiceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");
  const [existingLogo, setExistingLogo] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const selectBussinessServices = useSelector(
    (state) => state.businessService.selectedService
  );

  useEffect(() => {
    dispatch(getByIdBussinessService(businessServiceId));
  }, [dispatch, businessServiceId]);

  useEffect(() => {
    if (selectBussinessServices) {
      setName(selectBussinessServices.name || "");
      setDescription(selectBussinessServices.description || "");
      setSlug(selectBussinessServices.slug || "");
      setTitle(selectBussinessServices.title || "");

      // Handle icon URL - ensure it's a full URL or handle relative paths
      const iconUrl = selectBussinessServices.image || "";
      if (iconUrl) {
        // If iconUrl is a relative path, prepend the base URL
        const fullIconUrl = iconUrl.startsWith('http')
          ? iconUrl
          : `${process.env.REACT_APP_BASE_URL}/${iconUrl}`;
        setExistingIcon(fullIconUrl);
      }

      // Handle logo URL - ensure it's a full URL or handle relative paths
      const logoUrl = selectBussinessServices.logo || "";
      if (logoUrl) {
        // If logoUrl is a relative path, prepend the base URL
        const fullLogoUrl = logoUrl.startsWith('http')
          ? logoUrl
          : `${process.env.REACT_APP_BASE_URL}/${logoUrl}`;
        setExistingLogo(fullLogoUrl);
      }
    }
  }, [selectBussinessServices]);

  const handleImageChange = (files) => {
    if (files[0]) {
      setImage(files[0]);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleLogoChange = (files) => {
    if (files[0]) {
      setLogo(files[0]);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setExistingIcon("");
    setImage(null);
    setImagePreview(null);
  };

  const handleRemoveLogo = () => {
    setExistingLogo("");
    setLogo(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("slug", slug);
    formData.append("title", title);

    // Handle image upload or removal
    if (image) {
      formData.append("image", image);
    } else if (!existingIcon) {
      // If no image is present, send a flag to remove the existing image
      formData.append("removeImage", "true");
    }

    // Handle logo upload or removal
    if (logo) {
      formData.append("logo", logo);
    } else if (!existingLogo) {
      // If no logo is present, send a flag to remove the existing logo
      formData.append("removeLogo", "true");
    }

    try {
      await dispatch(updateBussinessService({ businessServiceId, formData }));
      setSnackbar({
        open: true,
        message: "Business service updated successfully!",
        severity: "success",
      });
      navigate("/Business-Services-control");
    } catch (error) {
      console.error("Error updating service:", error);
      setSnackbar({
        open: true,
        message: "Failed to update business service.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Custom styles for image preview
  const imagePreviewStyle = {
    maxWidth: '200px',
    maxHeight: '200px',
    marginTop: '16px',
    borderRadius: '8px',
  };

  const logoContainerStyle = {
    position: 'relative',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const removeButtonStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            mt={2}
            mb={1}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              flex: 1
            }}>
              <Typography
                variant="h4"
                sx={{
                  position: "relative",
                  padding: 0,
                  margin: 0,
                  fontWeight: 300,
                  fontSize: { xs: "32px", sm: "40px" },
                  color: "#747474",
                  textAlign: "center",
                  textTransform: "uppercase",
                  paddingBottom: "5px",
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
                Business Service Edit Form
              </Typography>

              <Tooltip
                title="This is where you can edit business service details."
                arrow
              >
                <HelpOutline
                  sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }}
                />
              </Tooltip>
            </Box>
          </Box>
          <Paper
            elevation={0}
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
                width: "100%",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Service Name"
                    variant="outlined"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Service Title"
                    variant="outlined"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Service Slug"
                    variant="outlined"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </Grid>

                {/* Image Preview Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Service Image</Typography>
                  {(existingIcon || imagePreview) && (
                    <div style={logoContainerStyle}>
                      <img
                        src={imagePreview || existingIcon}
                        alt="Service Image"
                        style={imagePreviewStyle}
                      />
                      <IconButton
                        style={removeButtonStyle}
                        onClick={handleRemoveImage}
                        color="secondary"
                      >
                        <ClearIcon />
                      </IconButton>
                    </div>
                  )}
                  <DropzoneArea
                    onChange={handleImageChange}
                    acceptedFiles={["image/*"]}
                    filesLimit={1}
                    maxFileSize={5000000} // 5MB
                    dropzoneText="Drag and drop an image here or click (Optional)"
                    showPreviews={false}
                    showPreviewsInDropzone={true}
                  />
                </Grid>

                {/* Logo Preview Section */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Service Logo</Typography>
                  {(existingLogo || logoPreview) && (
                    <div style={logoContainerStyle}>
                      <img
                        src={logoPreview || existingLogo}
                        alt="Service Logo"
                        style={imagePreviewStyle}
                      />
                      <IconButton
                        style={removeButtonStyle}
                        onClick={handleRemoveLogo}
                        color="secondary"
                      >
                        <ClearIcon />
                      </IconButton>
                    </div>
                  )}
                  <DropzoneArea
                    onChange={handleLogoChange}
                    acceptedFiles={["image/*"]}
                    filesLimit={1}
                    maxFileSize={5000000} // 5MB
                    dropzoneText="Drag and drop a logo here or click (Optional)"
                    showPreviews={false}
                    showPreviewsInDropzone={true}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                style={{
                  display: "block",
                  margin: "24px auto 0", // centers the button horizontally
                  backgroundColor: " #ff6d00", // orange
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Update Business Service
              </Button>
            </form>
          </Paper>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={snackbar.severity === "success" ? 6000 : 8000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
              action={
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleCloseSnackbar}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              }
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

export default BussinessServiceEditForm;