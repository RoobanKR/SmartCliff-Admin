import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  Snackbar,
  Alert,
  MenuItem,
  Tooltip,
  Container,
  Paper,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getGalleryById,
  updateGallery,
} from "../../redux/slices/gallery/gallery";
import { clearUpdateStatus } from "../../redux/slices/review/review";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { HelpOutline } from "@mui/icons-material";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const GalleryEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { gallery, loading, error, updateSuccess } = useSelector(
    (state) => state.gallery
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    month: "",
    year: new Date().getFullYear(),
    images: [],
  });

  const [newFiles, setNewFiles] = useState([]); // New files added
  const [previews, setPreviews] = useState([]); // URLs of existing + new images
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getGalleryById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (gallery && gallery._id) {
      setFormData({
        name: gallery.name || "",
        description: gallery.description || "",
        month: gallery.month || "",
        year: gallery.year || new Date().getFullYear(),
        images: gallery.images || [],
      });

      // Previews from existing URLs
      if (gallery.images && Array.isArray(gallery.images)) {
        setPreviews(gallery.images);
      }
    }
  }, [gallery]);

  useEffect(() => {
    if (updateSuccess) {
      setSnackbarOpen(true);
      setTimeout(() => {
        dispatch(clearUpdateStatus());
        navigate("/gallery-control");
      }, 2000);
    }
  }, [updateSuccess, dispatch, navigate]);

  const onDrop = useCallback((acceptedFiles) => {
    const updatedPreviews = [
      ...previews,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ];
    setNewFiles([...newFiles, ...acceptedFiles]);
    setPreviews(updatedPreviews);
  }, [newFiles, previews]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 3 * 1024 * 1024,
    multiple: true,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRemovePreview = (index) => {
    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);

    if (index >= formData.images.length) {
      // It's a new image
      const newFileIndex = index - formData.images.length;
      const updatedNewFiles = [...newFiles];
      updatedNewFiles.splice(newFileIndex, 1);
      setNewFiles(updatedNewFiles);
    } else {
      // It's an existing image
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData({ ...formData, images: updatedImages });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("month", formData.month);
    data.append("year", formData.year);

    // Append retained image URLs (if applicable in backend)
    data.append("existingImages", JSON.stringify(formData.images));

    // Append new image files
    newFiles.forEach((file) => {
      data.append("images", file);
    });

    dispatch(updateGallery({ id, formData: data }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <LeftNavigationBar
      Content={
        <Container maxWidth="md">
          <Paper elevation={0}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mt={2} mb={2}>
              <Button variant="outlined" onClick={handleBack}>Back</Button>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <Typography variant="h4" sx={{
                  position: "relative", fontWeight: 300, fontSize: { xs: "32px", sm: "40px" },
                  color: "#747474", textAlign: "center", textTransform: "uppercase", paddingBottom: "5px",
                  "&::before": {
                    content: '""', width: "28px", height: "5px", display: "block", position: "absolute",
                    bottom: "3px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474"
                  },
                  "&::after": {
                    content: '""', width: "100px", height: "1px", display: "block", position: "relative",
                    marginTop: "5px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474"
                  }
                }}>
                  Gallery Edit Form
                </Typography>
                <Tooltip title="This is where you can Edit the Gallery" arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer", ml: 1 }} />
                </Tooltip>
              </Box>
            </Box>

            {loading && <CircularProgress />}
            {error && <Typography color="error" mb={2}>{error}</Typography>}

            <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
              <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} margin="normal" required />
              <TextField select label="Month" name="month" value={formData.month} onChange={handleChange} fullWidth margin="normal" required>
                {months.map((month) => (
                  <MenuItem key={month} value={month}>{month}</MenuItem>
                ))}
              </TextField>
              <TextField label="Year" name="year" type="number" value={formData.year} onChange={handleChange} fullWidth margin="normal" required />

              {/* Image Previews */}
              <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
                {previews.map((url, index) => (
                  <Box key={index} position="relative">
                    <img src={url} alt={`preview-${index}`} style={{ width: 70, height: 70, borderRadius: 4, objectFit: "cover" }} />
                    <IconButton size="small" onClick={() => handleRemovePreview(index)} sx={{
                      position: "absolute", top: -10, right: -10, background: "#fff"
                    }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              {/* Dropzone */}
              <Box {...getRootProps()} sx={{
                border: "2px dashed #1976d2", p: 2, textAlign: "center", cursor: "pointer",
                my: 2, borderRadius: 2
              }}>
                <input {...getInputProps()} />
                <CloudUploadIcon color="primary" fontSize="large" />
                <Typography variant="body2">Drag & drop images here, or click to select</Typography>
              </Box>

              <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2 }}>
                {loading ? <CircularProgress size={24} /> : "Update Gallery"}
              </Button>
            </form>

            {/* Snackbar */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={2000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert severity="success" variant="filled">Gallery Updated Successfully!</Alert>
            </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

export default GalleryEditForm;
