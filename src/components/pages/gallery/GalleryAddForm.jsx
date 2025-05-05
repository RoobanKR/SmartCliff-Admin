import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  Snackbar,
  Alert,
  MenuItem,
  Container,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { createGallery, resetState } from "../../redux/slices/gallery/gallery";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { HelpOutline } from "@mui/icons-material";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const GalleryAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.gallery);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    month: "",
    year: "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const updatedFiles = [...files, ...acceptedFiles].slice(0, 5); // limit max 5
    setFiles(updatedFiles);
    const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 3 * 1024 * 1024, // 3MB limit
    multiple: true,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    const updatedPreviews = updatedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(updatedPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please upload at least one image");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("month", formData.month);
    data.append("year", formData.year);
    files.forEach((file) => {
      data.append("images", file); // must match 'images' key in backend
    });

    dispatch(createGallery(data));
  };

  useEffect(() => {
    if (success) {
      setSnackbarOpen(true);
      setTimeout(() => {
        dispatch(resetState());
        navigate("/gallery-control");
      }, 2000);
    }
  }, [success, dispatch, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={0}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} mb={2}>
              <Button variant="outlined" color="primary" onClick={handleBack}>
                Back
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  flex: 1,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "32px", sm: "40px" },
                    color: "#747474",
                    textAlign: "center",
                    textTransform: "uppercase",
                    position: "relative",
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
                  Gallery Add Form
                </Typography>
                <Tooltip title="This is where you can add the My Gallery." arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                select
                label="Month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              >
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />

              {/* Dropzone */}
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed #1976d2",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  my: 2,
                  borderRadius: 2,
                }}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon color="primary" fontSize="large" />
                <Typography variant="body2">
                  Drag & drop up to 5 images here, or click to select
                </Typography>
              </Box>

              {/* Image Previews */}
              {previews.length > 0 && (
                <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                  {previews.map((src, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        style={{
                          maxWidth: "150px",
                          height: "auto",
                          borderRadius: 8,
                          border: "1px solid #ccc",
                        }}
                      />
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          backgroundColor: "#fff",
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>

              {error && (
                <Typography color="error.main" mt={2}>
                  {error}
                </Typography>
              )}
            </Box>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={2000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert severity="success" variant="filled">
                Gallery Added Successfully!
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

export default GalleryAddForm;
