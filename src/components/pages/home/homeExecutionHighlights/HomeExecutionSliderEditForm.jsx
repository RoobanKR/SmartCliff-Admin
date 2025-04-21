import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Snackbar,
  Alert,
  Tooltip,
  Box,
  IconButton,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  clearError,
  getHomeExecutionHighlightById,
  updateHomeExecutionHighlight,
} from "../../../redux/slices/home/homeExecutionHighlights/homeExecutionHighlights";
import { HelpOutline } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";

const HomeExecutionHighlightsEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [stack, setStack] = useState("");
  const [image, setImage] = useState(null);
  const [count, setCount] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Get error and success message from Redux state
  const { error } = useSelector((state) => state.homeExecutionHighlights);
  const successMessage = "Home Execution Highlight updated successfully!";

  useEffect(() => {
    if (id) {
      dispatch(getHomeExecutionHighlightById(id))
        .then((response) => {
          const data = response.payload;
          if (data) {
            setStack(data.stack || "");
            setCount(data.count || "");

            // Handle image URL
            if (data.image) {
              // If image is a relative path, prepend the base URL if needed
              const fullImageUrl = data.image.startsWith("http")
                ? data.image
                : `${process.env.REACT_APP_BASE_URL}/${data.image}`;
              setExistingImageUrl(fullImageUrl);
            }
          }
        })
        .catch((error) =>
          console.error("Error fetching execution highlights:", error)
        );
    }
  }, [id, dispatch]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("stack", stack);
    formData.append("count", count);

    // Handle image upload or removal
    if (image) {
      formData.append("image", image);
    } else if (!existingImageUrl) {
      // If no image is present, send a flag to remove the existing image
      formData.append("removeImage", "true");
    }

    try {
      await dispatch(
        updateHomeExecutionHighlight({ id: id, formData })
      ).unwrap();
      setSubmitSuccess(true); // Set success state to true
    } catch (error) {
      console.error("Error updating execution highlights:", error);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      setOpenSnackbar(true);
      setTimeout(() => {
        dispatch(clearError());
        navigate("/home/execution-highlights-control");
      }, 2000);
    }
  }, [submitSuccess, navigate, dispatch]);

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={0}>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={2000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert severity="success">{successMessage}</Alert>
            </Snackbar>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              mt={2}
              mb={2}
            >
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
                  Execution Slider Edit Form
                </Typography>
                <Tooltip
                  title="This is where you can add the execution count for the service."
                  arrow
                >
                  <HelpOutline
                    sx={{
                      color: "#747474",
                      fontSize: "24px",
                      cursor: "pointer",
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
                    label="stack"
                    variant="outlined"
                    required
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="count"
                    variant="outlined"
                    required
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  {/* Image Preview Section - Similar to Logo Preview in CompanyEditForm */}
                  {(existingImageUrl || imagePreview) && (
                    <Box
                      sx={{
                        position: "relative",
                        marginBottom: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle1">Current Image:</Typography>
                      <Box
                        sx={{
                          position: "relative",
                          width: "200px",
                          height: "200px",
                          marginTop: 2,
                          padding: "20px",
                          background:
                            "linear-gradient(135deg, rgb(44, 46, 84) 10%, rgb(26, 28, 51) 90%)",
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={imagePreview || existingImageUrl}
                          alt="Execution Highlight"
                          style={{
                            maxWidth: "160px",
                            maxHeight: "160px",
                            objectFit: "contain",
                          }}
                        />
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            color: "#fff",
                          }}
                          onClick={handleRemoveImage}
                          color="secondary"
                        >
                          <ClearIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  )}

                  <DropzoneArea
                    onChange={handleImageChange}
                    acceptedFiles={["image/*"]}
                    filesLimit={1}
                    showPreviews={false}
                    showPreviewsInDropzone={true}
                    dropzoneText="Drag and drop a new image here or click"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="warning"
                sx={{
                  mt: 3,
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Update Execution Slider
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default HomeExecutionHighlightsEditForm;