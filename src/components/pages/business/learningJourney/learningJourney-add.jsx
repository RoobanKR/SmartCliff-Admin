import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import {
  Typography,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tooltip,
  Container,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createLearningJourney } from "../../../redux/slices/business/learningJourney/learningJourney";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useNavigate } from "react-router-dom";
import { HelpOutline } from "@mui/icons-material";


const LearningJourneyAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleImageChange = (files) => {
    setImage(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("type", type);
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      await dispatch(createLearningJourney(formData));
      setSnackbarMessage("Learning Journey added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/business/learningjourney-control");
      }, 1500); // 1.5 seconds
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbarMessage("Failed to add Learning Journey. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
                Learning Journey Add Form
                </Typography>
                <Tooltip title="This is where you can add the Learning Journey." arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>
            <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
            <FormControl fullWidth margin="normal" variant="outlined" required>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type"
              >
                <MenuItem value="hirefromus">Hire From Us</MenuItem>
                <MenuItem value="trainfromus">Train From Us</MenuItem>
                <MenuItem value="institute">Institute</MenuItem>
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <DropzoneArea
              onChange={handleImageChange}
              acceptedFiles={["image/*"]}
              filesLimit={1}
              showPreviews={false}
              showPreviewsInDropzone={true}
              dropzoneText="Drag and drop an image here or click"
            />
            
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
              Submit
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

export default LearningJourneyAddForm;
