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
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { clearError, getHomeExecutionHighlightById, updateHomeExecutionHighlight } from "../../../redux/slices/home/homeExecutionHighlights/homeExecutionHighlights";

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
      dispatch(getHomeExecutionHighlightById(id)).then(
        (response) => {
          const data = response.payload;
          if (data) {
            setStack(data.stack || "");
            setCount(data.count || "");
            setExistingImages(data.image || "");
          }
        }
      ).catch((error) => console.error("Error fetching execution highlights:", error)); 
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
      await dispatch(updateHomeExecutionHighlight({ id: id, formData })).unwrap();
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
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
              Execution Highlights Edit
            </Typography>
            <br />
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
                  <div style={{ marginTop: '16px' }}>
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
                      style={{ width: '30%', height: 'auto', marginTop: '8px' }}
                    />
                  )}
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
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                Update
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default HomeExecutionHighlightsEditForm;