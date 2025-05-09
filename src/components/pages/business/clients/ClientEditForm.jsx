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
  IconButton,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById, updateClient } from "../../../redux/slices/services/client/Client";
import { HelpOutline, Clear as ClearIcon } from "@mui/icons-material";

const ClientEditForm = () => {
  const { clientId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const selectedClientById = useSelector((state) => state.clients.selectedClientById);

  useEffect(() => {
    dispatch(getClientById(clientId));
  }, [dispatch, clientId]);

  useEffect(() => {
    if (selectedClientById) {
      setName(selectedClientById.name || "");
      setType(selectedClientById.type || "");
      setExistingImage(selectedClientById.image || "");
    }
  }, [selectedClientById]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleFileChange = (files) => {
    if (files.length > 0) {
      setImage(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    if (image) {
      formData.append("image", image);
    }

    try {
      await dispatch(updateClient({ clientId, formData }));
      setSnackbar({ open: true, message: "Client updated successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/business/Client-control");
      }, 1500);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to update client", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={0}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mt={2} mb={2}>
              <Button variant="outlined" color="primary" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', flex: 1 }}>
                <Typography variant="h4" sx={{ position: "relative", padding: 0, margin: 0, fontWeight: 300, fontSize: { xs: "32px", sm: "40px" }, color: "#747474", textAlign: "center", textTransform: "uppercase", paddingBottom: "5px", "&::before": { content: '""', width: "28px", height: "5px", display: "block", position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, "&::after": { content: '""', width: "100px", height: "1px", display: "block", position: "relative", marginTop: "5 px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, }}>
                  Client Edit Form
                </Typography>
                <Tooltip title="This is where you can edit the client details." arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>
            <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type || ""}
                  onChange={handleTypeChange}
                  label="Type"
                >
                  <MenuItem value="home">Home</MenuItem>
                  <MenuItem value="trainfromus">Train From Us</MenuItem>
                  <MenuItem value="institute">Institute</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <DropzoneArea
                  onChange={handleFileChange}
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  showPreviewsInDropzone
                  dropzoneText="Drag and drop an image here or click"
                />
              </Box>

              {existingImage && (
                <Box sx={{ mt: 2, position: "relative" }}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Existing Image:
                  </Typography>
                  <img
                    src={existingImage}
                    alt="Existing Client"
                    style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "8px" }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 10,
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
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={name}
                onChange={handleNameChange}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
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
                Submit
              </Button>
            </form>
          </Paper>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
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

export default ClientEditForm;