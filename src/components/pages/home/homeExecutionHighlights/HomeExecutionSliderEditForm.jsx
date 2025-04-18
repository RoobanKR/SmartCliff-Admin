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

const HomeExecutionHighlightsEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [stack, setStack] = useState("");
  const [image, setImage] = useState(null);
  const [count, setCount] = useState("");
  const [existingImages, setExistingImages] = useState("");
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
            setExistingImages(data.image || "");
          }
        })
        .catch((error) =>
          console.error("Error fetching execution highlights:", error)
        );
    }
  }, [id, dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("stack", stack);
    if (image) {
      formData.append("image", image);
    }
    formData.append("count", count);

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
              justifyContent="center"
              gap={1}
              mt={2}
              mb={1}
            >
              <Typography
                variant="h4"
                sx={{
                  position: "relative",
                  padding: 0,
                  margin: 0,
                  fontFamily: "Merriweather, serif",
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
                Execution Slider <br></br> Edit Form
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
                  <div style={{ marginTop: "16px" }}>
                    <DropzoneArea
                      onChange={(fileArray) => setImage(fileArray[0])}
                      acceptedFiles={["image/*"]}
                      filesLimit={1}
                      showPreviews={false}
                      showPreviewsInDropzone={true}
                      dropzoneText="Drag and drop an image here or click"
                      required
                    />
                  </div>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    style={{ marginTop: "16px" }}
                  >
                    Existing Image:
                  </Typography>
                  {existingImages && (
                    <img
                      src={`${existingImages}`}
                      alt="Existing Highlight"
                      style={{
                        width: "80px",
                        height: "80px",
                        marginTop: "8px",
                        padding: "20px",
                        background:
                          "linear-gradient(135deg, rgb(44, 46, 84) 10%, rgb(26, 28, 51) 90%)",
                      }}
                    />
                  )}
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
