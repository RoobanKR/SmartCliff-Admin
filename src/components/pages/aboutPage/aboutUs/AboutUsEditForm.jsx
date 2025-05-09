import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  Grid,
  CircularProgress,
  useTheme,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import { useCookies } from "react-cookie";
import {
  getAllAboutUs,
  updateAboutUs,
} from "../../../redux/slices/aboutpage/aboutUs/aboutus";
import { HelpOutline } from "@mui/icons-material";

const AboutUsEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const aboutUss = useSelector((state) => state.aboutUs.aboutUss);
  const loading = useSelector((state) => state.aboutUs.loading);

  const [formData, setFormData] = useState({
    title: "",
    image: null,
    preview: "",
    removeImage: false
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [cookies] = useCookies(["token"]);

  // Authentication check
  useEffect(() => {
    if (!cookies.token) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies, dispatch, navigate]);

  // Load about us data
  useEffect(() => {
    dispatch(getAllAboutUs());
  }, [dispatch]);

  // Set form data when about us data is loaded
  useEffect(() => {
    if (id && aboutUss.length > 0) {
      const existingData = aboutUss.find((item) => item._id === id);

      if (existingData) {
        setFormData({
          title: existingData.title || "",
          image: null,
          preview: existingData.image || "",
          removeImage: false
        });
      } else {
        setMessage({ text: "Failed to fetch data", type: "error" });
        setOpenSnackbar(true);
      }
    }
  }, [id, aboutUss]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setMessage({ text: "Image size exceeds 3MB limit", type: "error" });
        setOpenSnackbar(true);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
        removeImage: false
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      preview: "",
      removeImage: true
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    } else if (formData.removeImage) {
      formDataToSend.append("removeImage", "true");
    }

    try {
      await dispatch(updateAboutUs({
        id,
        formData: formDataToSend,
        token: cookies.token
      })).unwrap();

      setMessage({ text: "Updated successfully", type: "success" });
      setOpenSnackbar(true);

      setTimeout(() => navigate("/about/aboutus-control"), 1500);
    } catch ( error) {
      setMessage({
        text: error?.message || "Something went wrong",
        type: "error",
      });
      setOpenSnackbar(true);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <LeftNavigationBar
        Content={
          <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
            <CircularProgress />
          </Box>
        }
      />
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ maxWidth: 800, margin: "auto", px: 2 }}>
          {/* Header with Back Button */}
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
                About Us Edit Form
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

          {/* Form Card */}
          <Card
            elevation={0}
            sx={{ mb: 4 }}
          >
            <CardContent>
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
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                      margin="normal"
                      required
                    />
                  </Grid>

                  {/* Image Preview Section */}
                  {formData.preview && (
                    <Grid item xs={12}>
                      <Box sx={{ position: "relative", mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Current Image:
                        </Typography>
                        <img
                          src={formData.preview}
                          alt="About Us Preview"
                          style={{
                            width: "100%",
                            maxHeight: "300px",
                            objectFit: "contain",
                            borderRadius: "8px",
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 30,
                            right: 10,
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                            },
                          }}
                          onClick={handleRemoveImage}
                          color="secondary"
                        >
                          <ClearIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  )}

                  {/* Image Upload Button */}
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      component="label"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        mt: 2,
                        backgroundColor: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      {formData.preview ? "Change Image" : "Upload Image"}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12} sx={{ mt: 2, textAlign: "center" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitLoading}
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
                      {submitLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Update Content"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          {/* Snackbar for notifications */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity={message.type}
              sx={{ width: "100%" }}
            >
              {message.text}
            </Alert>
          </Snackbar>
        </Box>
      }
    />
  );
};

export default AboutUsEditForm;