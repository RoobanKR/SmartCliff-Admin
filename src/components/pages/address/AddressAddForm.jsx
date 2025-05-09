import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Tooltip,
  Container,
  Paper,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { HelpOutline } from "@mui/icons-material";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { createAddress } from "../../redux/slices/contactPage/addressPage";

const AddressAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [formData, setFormData] = useState({
    street: "",
    address: "",
    city: "",
    image: null,
    preview: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!cookies.token) {
      navigate("/");
    }
  }, [cookies, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (files) => {
    const file = files[0]; // Get the first file from the array
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Image size exceeds the 3MB limit");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      preview: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.street) newErrors.street = "Street is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.image) newErrors.image = "Image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("street", formData.street);
    data.append("address", formData.address);
    data.append("city", formData.city);
    data.append("image", formData.image);

    try {
      await dispatch(createAddress(data)).unwrap(); // Pass the FormData directly
      setSnackbarOpen(true);
      setTimeout(() => navigate("/address-control"), 1500); // Redirect to addresses list
    } catch (error) {
      alert("Error: " + (error?.message || "Something went wrong"));
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
                <Typography variant="h4" sx={{ position: "relative", padding: 0, margin: 0, fontWeight: 300, fontSize: { xs: "32px", sm: "40px" }, color: "#747474", textAlign: "center", textTransform: "uppercase", paddingBottom: "5px", "&::before": { content: '""', width: "28px", height: "5px", display: "block", position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, "&::after": { content: '""', width: "100px", height: "1px", display: "block", position: "relative", marginTop: "5px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, }}>
                  Add New Address
                </Typography>
                <Tooltip title="Fill in the details to add a new address." arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>
            <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
              <TextField
                label="Street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.street)}
                helperText={errors.street}
              />
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.address)}
                helperText={errors.address}
              />
              <TextField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.city)}
                helperText={errors.city}
              />
              <DropzoneArea
                acceptedFiles={["image/*"]}
                dropzoneText="Drag and drop an image here or click"
                onChange={handleFileChange}
                filesLimit={1}
                showAlerts={["error"]}
                showFileNames
                useChipsForPreview
                previewText="Selected file:"
                maxFileSize={3 * 1024 * 1024} // 3MB
                sx={{ mt: 2, borderRadius: 2 }}
              />
              {formData.preview && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <img
                    src={formData.preview}
                    alt="Preview"
                    style={{ width: "20%", height: "auto", borderRadius: 8 }}
                  />
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleRemoveImage}
                    sx={{ mt: 1 }}
                  >
                    Remove Image
                  </Button>
                </Box>
              )}
              {errors.image && (
                <Typography variant="body2" color="error">
                  {errors.image}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  mt: 3,
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                }}
              >
                Submit Address
              </Button>
            </form>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert onClose={() => setSnackbarOpen(false)} variant="filled" severity="success" sx={{ width: "100%" }}>
                Address added successfully!
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

export default AddressAddForm;
