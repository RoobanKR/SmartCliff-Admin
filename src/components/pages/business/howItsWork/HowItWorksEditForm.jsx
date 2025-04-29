import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateHowItWorks,
  getHowItWorksById,
  clearMessages,
} from "../../../redux/slices/business/howItWorks/howItWorks";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { HelpOutline } from "@mui/icons-material";

const HowItWorksEditForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // State for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  // Get the selected How It Works item from Redux store
  const selectedHowItWork = useSelector(
    (state) => state.howItWorks.selectedHowItWork
  );
  const isLoading = useSelector((state) => state.howItWorks.loading);
  const error = useSelector((state) => state.howItWorks.error);
  const successMessage = useSelector(
    (state) => state.howItWorks.successMessage
  );

  // Fetch How It Works details when component mounts
  useEffect(() => {
    dispatch(getHowItWorksById(id));

    // Clear any previous messages when component mounts
    dispatch(clearMessages());
  }, [dispatch, id]);

  // Populate form when How It Works data is loaded
  useEffect(() => {
    if (selectedHowItWork) {
      setTitle(selectedHowItWork.title || "");
      setDescription(selectedHowItWork.description || "");
      setType(selectedHowItWork.type || "");

      // Handle image URL - ensure it's a full URL or handle relative paths
      const imageUrl = selectedHowItWork.imageUrl || selectedHowItWork.image;
      if (imageUrl) {
        const fullImageUrl = imageUrl.startsWith("http")
          ? imageUrl
          : `${process.env.REACT_APP_BASE_URL}/${imageUrl}`;
        setExistingImageUrl(fullImageUrl);
      }
    }
  }, [selectedHowItWork]);

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

  const handleRemoveImage = () => {
    setExistingImageUrl("");
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate fields
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (!type) newErrors.type = "Type is required";
    if (!image && !existingImageUrl) newErrors.image = "Image is required";

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);

    // Handle image upload or removal
    if (image) {
      formData.append("image", image);
    } else if (!existingImageUrl) {
      // If no image is present, send a flag to remove the existing image
      formData.append("removeImage", "true");
    }

    try {
      await dispatch(updateHowItWorks({ id, formData })).unwrap();
      // Success handling is done in the useEffect that watches for successMessage

      setSnackbarMessage("How its work updateds successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Navigate back to the list view after a successful update
      setTimeout(() => {
        navigate("/business/how-it-works-control");
      }, 2000);
    } catch (err) {
      console.error("Failed to update How It Works item:", err);
      setSnackbarMessage(
        "Failed to update How It Works item. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Prevent rendering until How It Works data is loaded
  if (isLoading && !selectedHowItWork) {
    return (
      <LeftNavigationBar
        Content={
          <Container component="main" maxWidth="md">
            <Typography>Loading...</Typography>
          </Container>
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
                        How It Works Edit Form
                        </Typography>
                        <Tooltip title="This is where you can Edit the How It Works." arrow>
                          <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                        </Tooltip>
                      </Box>
                    </Box>
                    <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
                    
              <TextField
                margin="normal"
                required
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  value={type}
                  label="Type"
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="hirefromus">Hire From Us</MenuItem>
                  <MenuItem value="trainfromus">Train From Us</MenuItem>
                  <MenuItem value="institute">Institute</MenuItem>
                </Select>
              </FormControl>

              {/* Image Preview Section */}
              {(existingImageUrl || imagePreview) && (
                <Box
                  sx={{
                    position: "relative",
                    marginBottom: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="subtitle1">Current Image:</Typography>
                  <img
                    src={imagePreview || existingImageUrl}
                    alt="How It Works"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      marginTop: "16px",
                      borderRadius: "8px",
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                    }}
                    onClick={handleRemoveImage}
                    color="secondary"
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              )}

              <Box sx={{ mt: 2, mb: 2 }}>
                <DropzoneArea
                  onChange={handleImageChange}
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  showPreviews={false}
                  showPreviewsInDropzone={true}
                  dropzoneText="Drag and drop a new image here or click (Optional)"
                  maxFileSize={5000000} // 5MB in bytes
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: "#ff6d00",
                  color: "#fff",
                  padding: "8px 24px",
                  textTransform: "uppercase",
                  borderRadius: "4px",
                  mt: 2,
                  "&:hover": {
                    backgroundColor: "#e65100",
                  },
                }}
              >
                {loading ? "Updating..." : "Update"}
              </Button>
            </form>
            <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
              variant="filled"
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

export default HowItWorksEditForm;
