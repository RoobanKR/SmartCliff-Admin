import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { createClient } from "../../../redux/slices/services/client/Client";
import * as Yup from "yup";
import { clearUpdateStatus } from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import { HelpOutline } from "@mui/icons-material";

const ClientAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    image: false,
    type: false,
  });

  const handleImageChange = (files) => {
    setImage(files[0]);
    setTouchedFields((prev) => ({ ...prev, image: true }));
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Name must contain only alphabets")
      .required("Name is required"),
    image: Yup.mixed().required("Image is required"),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await validationSchema.validate({ name, image });

      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      formData.append("image", image);

      dispatch(createClient(formData));

      setSnackbar({
        open: true,
        message: "Client added successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/business/Client-control");
      }, 1500);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.message || "Submission failed",
        severity: "error",
      });
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
                  Client Add Form
                </Typography>
                <Tooltip title="This is where you can add the Client ." arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>
            <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
                          {/* Type Selection */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="home">Home</MenuItem>
                  <MenuItem value="trainfromus">Train From Us</MenuItem>
                  <MenuItem value="institute">Institute</MenuItem>
                </Select>
              </FormControl>

              {/* Dropzone for Image Upload */}
              <Box sx={{ marginBottom: 2 }}>
                <DropzoneArea
                  onChange={handleImageChange}
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  showPreviewsInDropzone
                  dropzoneText="Drag and drop an image here or click"
                />
                {touchedFields.image && !image && (
                  <Typography variant="body2" color="error">
                    Image is required
                  </Typography>
                )}
              </Box>

              {/* Name Input Field */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Client Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={touchedFields.name && !name.match(/^[a-zA-Z\s]+$/)}
                helperText={
                  touchedFields.name &&
                  (!name.match(/^[a-zA-Z\s]+$/)
                    ? "Name must contain only alphabets"
                    : "")
                }
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, name: true }))
                }
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  color: "white",
                  marginTop: 2,
                  padding: 1,
                }}
              >
                Submit
              </Button>
            </form>
          </Paper>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      }
    />
  );
};

export default ClientAddForm;
