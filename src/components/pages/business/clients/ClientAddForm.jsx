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
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { createClient } from "../../../redux/slices/services/client/Client";
import * as Yup from "yup";
import { clearUpdateStatus } from "../../../redux/slices/services/executionHighlights/Execution_Highlights";

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

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="sm">
          <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
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
              Add Client
            </Typography>

            <form onSubmit={handleSubmit}>
              {/* Type Selection */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="smartcliff">SmartCliff</MenuItem>
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
                  backgroundColor: "#4CAF50",
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
