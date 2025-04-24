import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Box,
  Tooltip,
  useTheme,
  IconButton,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchServiceById,
  updateService,
} from "../../../redux/slices/services/services/Services";
import { HelpOutline } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

const ServiceEditForm = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [error, setError] = useState("");

  const { selectedService } = useSelector((state) => state.service);

  useEffect(() => {
    dispatch(fetchServiceById(serviceId));
  }, [dispatch, serviceId]);

  useEffect(() => {
    if (selectedService) {
      setTitle(selectedService.title || "");
      setSlug(selectedService.slug || "");
      setDescription(selectedService.description || "");
      setExistingImage(selectedService.icon || ""); // Assuming icon is the existing image URL
    }
  }, [selectedService]);

  const validateForm = () => {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!slug.trim()) {
      setError("Slug is required");
      return false;
    }
    if (!description.trim()) {
      setError("Description is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);

    if (newImage) {
      formData.append("icon", newImage);
    }

    try {
      await dispatch(updateService({ serviceId, formData }));

      // Show toast notification
      toast.success("Service updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          // Navigate to the next page after toast is closed or after timeout
          navigate("/Services-control");
        },
      });
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Error updating service. Please try again.");
    }
  };

  const handleRemoveImage = () => {
    setExistingImage("");
    setNewImage(null);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          {/* Add ToastContainer to render notifications */}
          <ToastContainer />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            mt={3}
            mb={2}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
            >
              Back
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  position: "relative",
                  padding: 0,
                  margin: 0,
                  fontWeight: 300,
                  fontSize: { xs: "28px", sm: "36px" },
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
                Service Edit Form
              </Typography>

              <Tooltip
                title="Edit the about us content and image here"
                arrow
                placement="top"
              >
                <HelpOutline
                  sx={{
                    color: "#747474",
                    fontSize: "24px",
                    cursor: "pointer",
                    ml: 1,
                  }}
                />
              </Tooltip>
            </Box>
          </Box>

          <form
            onSubmit={handleSubmit}
            style={{
              border: "2px dotted #D3D3D3",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Name"
                  variant="outlined"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Slug"
                  variant="outlined"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
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
                <DropzoneArea
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  dropzoneText="Drag and drop an image here or click"
                  onChange={(fileArray) => setNewImage(fileArray[0])}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="textSecondary">
                  Existing Image:
                </Typography>
                {existingImage && (
                  <div style={{ margin: "16px 0", position: 'relative' }}>
                    <img
                      src={existingImage}
                      alt="Existing Image"
                      style={{
                        width: "100px",
                        height: "auto",
                        marginRight: "8px",
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      color="secondary"
                      style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                )}
              </Grid>
            </Grid>
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                mt: 3,
                "&:hover": {
                  backgroundColor: theme.palette.warning.dark,
                },
              }}
            >
              Update Service Data
            </Button>
          </form>
        </Container>
      }
    />
  );
};

export default ServiceEditForm;