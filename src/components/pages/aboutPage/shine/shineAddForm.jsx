import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  Paper,
  Grid,
  CircularProgress,
  Divider,
  Stack,
  Alert,
  Snackbar,
  Tooltip,
  useTheme,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { HexColorPicker } from "react-colorful";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { createShine } from "../../../redux/slices/aboutpage/shine/shine";
import { HelpOutline } from "@mui/icons-material";

const ShineAddForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Use dispatch to call the thunk
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const theme = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    imagePreview: null,
    shineDefinition: [],
  });
  const presetColors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A6",
    "#FFD700",
    "#1976d2",
  ];

  const handlePresetColorSelect = (index, color) => {
    setFormData((prev) => {
      const updatedDefinitions = [...prev.shineDefinition];
      updatedDefinitions[index].color = color;
      return { ...prev, shineDefinition: updatedDefinitions };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleDefinitionChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedDefinitions = [...prev.shineDefinition];
      updatedDefinitions[index] = {
        ...updatedDefinitions[index],
        [field]: value,
      };
      return { ...prev, shineDefinition: updatedDefinitions };
    });
  };

  const handleIconChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => {
        const updatedDefinitions = [...prev.shineDefinition];
        updatedDefinitions[index] = {
          ...updatedDefinitions[index],
          icon: file,
          iconPreview: URL.createObjectURL(file),
        };
        return { ...prev, shineDefinition: updatedDefinitions };
      });
    }
  };

  const addDefinition = () => {
    setFormData((prev) => ({
      ...prev,
      shineDefinition: [
        ...prev.shineDefinition,
        {
          title: "",
          description: "",
          icon: null,
          iconPreview: null,
          color: "#1976d2",
        },
      ],
    }));
  };

  const removeDefinition = (index) => {
    setFormData((prev) => {
      const updatedDefinitions = [...prev.shineDefinition];
      updatedDefinitions.splice(index, 1);
      return { ...prev, shineDefinition: updatedDefinitions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title) {
      setSnackbar({
        open: true,
        message: "Title is required",
        severity: "error",
      });
      return;
    }

    if (!formData.image && !formData.imagePreview) {
      setSnackbar({
        open: true,
        message: "Image is required",
        severity: "error",
      });
      return;
    }

    // Validate each shine definition
    for (let i = 0; i < formData.shineDefinition.length; i++) {
      const def = formData.shineDefinition[i];
      if (!def.title || !def.description || !def.color) {
        setSnackbar({
          open: true,
          message: `Title, description, and color are required for all shine definitions`,
          severity: "error",
        });
        return;
      }
    }

    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);

      if (formData.image) {
        form.append("image", formData.image);
      }

      // Prepare shine definitions for submission
      const shineDefinitionsForSubmit = formData.shineDefinition.map((def) => {
        const { icon, iconPreview, ...dataFields } = def;
        return dataFields;
      });

      form.append("shineDefinition", JSON.stringify(shineDefinitionsForSubmit));

      // Add icon files if present
      formData.shineDefinition.forEach((def, index) => {
        if (def.icon) {
          form.append(`icon_${index}`, def.icon);
        }
      });

      // Dispatch the createShine action
      const successMessage = await dispatch(createShine(form)).unwrap();

      setSnackbar({
        open: true,
        message: successMessage,
        severity: "success",
      });

      // Redirect after successful submission
      setTimeout(() => {
        navigate("/about/shine-control");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Extract error message from the response
      const errorMessage =
        error.response?.data?.message?.[0]?.value || "An error occurred";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };  // Extract unique job positions for dropdown filter


  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">

          <Paper elevation={0} >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              mt={2}
              mb={2}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
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
                  Shine Content Add Form
                </Typography>
                <Tooltip
                  title="This is where you can add the execution count for the service."
                  arrow
                >
                  <HelpOutline
                    sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }}
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
              <Grid container spacing={3}>
                {/* Main Details */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    margin="normal"
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        <b> Shine Image:</b>
                      </Typography>
                      <Typography variant="h9" gutterBottom>
                        <i>
                          {" "}
                          This is the place to add the main image to the shine
                          content{" "}
                        </i>
                      </Typography>
                      <Box sx={{ mb: 2, textAlign: "center" }}>
                        {formData.imagePreview && (
                          <Box
                            component="img"
                            src={formData.imagePreview}
                            alt="Shine Preview"
                            sx={{
                              maxWidth: "100%",
                              maxHeight: 200,
                              objectFit: "contain",
                              mb: 2,
                            }}
                          />
                        )}
                      </Box>

                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<PhotoCamera />}
                        fullWidth
                        color="secondary"
                      >
                        {formData.imagePreview
                          ? "Change Image"
                          : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleImageChange}
                        />
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Shine Definitions */}
              <Box sx={{ mt: 4, mb: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h5" gutterBottom>
                    Shine Definitions
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addDefinition}
                    color="secondary"
                  >
                    Add Definition
                  </Button>
                </Stack>
              </Box>

              {formData.shineDefinition.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  No shine definitions added. Click "Add Definition" to create
                  one.
                </Alert>
              )}

              {formData.shineDefinition.map((def, index) => (
                <Paper key={index} elevation={2} sx={{ p: 2, mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="h6">
                          Definition #{index + 1}
                        </Typography>
                        <IconButton
                          onClick={() => removeDefinition(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={def.title}
                        onChange={(e) =>
                          handleDefinitionChange(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        required
                        margin="normal"
                      />

                      <TextField
                        fullWidth
                        label="Description"
                        value={def.description}
                        onChange={(e) =>
                          handleDefinitionChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        multiline
                        rows={3}
                        required
                        margin="normal"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      {/* Icon Upload */}
                      <Typography variant="subtitle1" gutterBottom>
                        Icon
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        {def.iconPreview && (
                          <Box
                            component="img"
                            src={def.iconPreview}
                            alt="Icon Preview"
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                              mr: 2,
                            }}
                          />
                        )}

                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<PhotoCamera />}
                          color="secondary"
                        >
                          {def.iconPreview ? "Change Icon" : "Upload Icon"}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => handleIconChange(index, e)}
                          />
                        </Button>
                      </Box>

                      {/* Color Picker */}
                      <Typography variant="subtitle1" gutterBottom>
                        Color
                      </Typography>

                      {/* Predefined Colors */}
                      <Box
                        sx={{
                          mb: 1,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        {presetColors.map((color) => (
                          <Box
                            key={color}
                            sx={{
                              width: 30,
                              height: 30,
                              bgcolor: color,
                              borderRadius: "50%",
                              cursor: "pointer",
                              border:
                                def.color === color
                                  ? "3px solid black"
                                  : "2px solid white",
                            }}
                            onClick={() =>
                              handlePresetColorSelect(index, color)
                            }
                          />
                        ))}
                      </Box>

                      {/* Manual Hex Input */}
                      <TextField
                        fullWidth
                        label="Enter Hex Color"
                        value={def.color}
                        onChange={(e) =>
                          handleDefinitionChange(
                            index,
                            "color",
                            e.target.value
                          )
                        }
                        error={!/^#([0-9A-Fa-f]{3}){1,2}$/.test(def.color)} // Validate hex format
                        helperText={
                          !/^#([0-9A-Fa-f]{3}){1,2}$/.test(def.color)
                            ? "Enter a valid hex color (e.g., #FF5733)"
                            : ""
                        }
                        margin="normal"
                      />

                      {/* Color Picker */}
                      <HexColorPicker
                        color={def.color}
                        onChange={(color) =>
                          handleDefinitionChange(index, "color", color)
                        }
                        style={{ width: "100%", marginBottom: "10px" }}
                      />

                      {/* Color Preview */}
                      <Box
                        sx={{
                          p: 1,
                          bgcolor: def.color,
                          color: getContrastColor(def.color),
                          textAlign: "center",
                          borderRadius: 1,
                        }}
                      >
                        {def.color}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              {/* Submit Button */}
              <Box
                sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    mt: 3, // optional: top margin
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Submit Shine Content
                </Button>
              </Box>
            </form>


            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

function getContrastColor(hexColor) {
  const color = hexColor.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#FFFFFF";
}

export default ShineAddForm;
