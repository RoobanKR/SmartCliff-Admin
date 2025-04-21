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
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import { createAboutUs } from "../../../redux/slices/aboutpage/aboutUs/aboutus";
import { useCookies } from "react-cookie";
import { HelpOutline } from "@mui/icons-material";

const AboutUsAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    preview: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!cookies.token) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies, dispatch, navigate]);

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
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.image) newErrors.image = "Image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("image", formData.image);

    try {
      await dispatch(createAboutUs({ token: cookies.token, formData: data })).unwrap();
      setSnackbarOpen(true);
      setTimeout(() => navigate("/about/aboutus-control"), 1500);
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
                <Typography variant="h4" sx={{ position: "relative", padding: 0, margin: 0, fontWeight: 300, fontSize: { xs: "32px", sm: "40px" }, color: "#747474", textAlign: "center", textTransform: "uppercase", paddingBottom: "5px", "&::before": { content: '""', width: "28px", height: "5px", display: "block", position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, "&::after ": { content: '""', width: "100px", height: "1px", display: "block", position: "relative", marginTop: "5px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, }}>
                  About Us Content Add Form
                </Typography>
                <Tooltip title="This is where you can add the execution count for the service." arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>
            <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.title)}
                helperText={errors.title}
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
                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
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
                Submit Content
              </Button>
            </form>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
                Successfully added!
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

export default AboutUsAddForm;