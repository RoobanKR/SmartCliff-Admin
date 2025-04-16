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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createGallery, resetState } from "../../redux/slices/gallery/gallery";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Dropzone handling
  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 3 * 1024 * 1024, // 3MB limit
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload an image");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("month", formData.month);
    data.append("year", formData.year);
    data.append("image", file);

    dispatch(createGallery(data));
  };

  useEffect(() => {
    if (success) {
      setSnackbarOpen(true);
      setTimeout(() => {
        dispatch(resetState());
        navigate("/gallery-control"); // Redirect after success
      }, 2000);
    }
  }, [success, dispatch, navigate]);

  return (
    <LeftNavigationBar
      Content={
        <Box
          sx={{
            maxWidth: 500,
            mx: "auto",
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
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
            Add Gallery
          </Typography>

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

          {/* Dropzone for file upload */}
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
              Drag & drop an image here, or click to select
            </Typography>
          </Box>

          {/* Show Image Preview */}
          {preview && (
            <Box mt={2} sx={{ textAlign: "center" }}>
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: "30%", height: "auto", borderRadius: 8 }}
              />
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

          {/* Snackbar Notification */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert severity="success">Gallery Added Successfully!</Alert>
          </Snackbar>
        </Box>
      }
    />
  );
};

export default GalleryAddForm;
