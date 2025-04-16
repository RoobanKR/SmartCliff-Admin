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
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClientById,
  updateClient,
} from "../../../redux/slices/services/client/Client";

const ClientEditForm = () => {
  const { clientId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");

  const [errors, setErrors] = useState({ name: "", type: "" });
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    type: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const selectedClientById = useSelector(
    (state) => state.clients.selectedClientById
  );

  useEffect(() => {
    dispatch(getClientById(clientId));
  }, [dispatch, clientId]);

  useEffect(() => {
    if (selectedClientById) {
      setName(selectedClientById.name || "");
      setType(selectedClientById.type || "");
      setExistingIcon(selectedClientById.image || "");
    }
  }, [selectedClientById]);

  const handleNameChange = (event) => {
    const { value } = event.target;
    const regex = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
    if (regex.test(value) || value === "") {
      setName(value);
      setErrors((prev) => ({ ...prev, name: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        name: "Name must contain only alphabets with one optional space",
      }));
    }
  };

  const validateName = () => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    validateName();

    if (!Object.values(errors).some((e) => e)) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      if (image) formData.append("image", image);

      try {
        await dispatch(updateClient({ clientId, formData }));

        setSnackbar({
          open: true,
          message: "Client updated successfully!",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/business/Client-control");
        }, 1500);
      } catch (err) {
        setError(err.message);
        setSnackbar({
          open: true,
          message: err.message || "Failed to update client",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
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
              Edit Clients
            </Typography>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type || ""}
                  onChange={(e) => {
                    setType(e.target.value);
                    setTouchedFields((prev) => ({ ...prev, type: true }));
                  }}
                  label="Type"
                  error={touchedFields.type && Boolean(errors.type)}
                >
                  <MenuItem value="smartcliff">SmartCliff</MenuItem>
                  <MenuItem value="trainfromus">Train From Us</MenuItem>
                  <MenuItem value="institute">Institute</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mt: 2 }}>
                <DropzoneArea
                  onChange={(fileArray) => setImage(fileArray[0])}
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  showPreviewsInDropzone
                  dropzoneText="Drag and drop an image here or click"
                />
              </Box>

              {existingIcon && (
                <Typography
                  sx={{ mt: 2 }}
                  variant="subtitle1"
                  color="textSecondary"
                >
                  Existing Image: {existingIcon.split("/").pop()}
                </Typography>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                value={name}
                onChange={(e) => {
                  setTouchedFields((prev) => ({ ...prev, name: true }));
                  handleNameChange(e);
                }}
                error={touchedFields.name && Boolean(errors.name)}
                helperText={touchedFields.name && errors.name}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#4CAF50", color: "white", mt: 2 }}
                disabled={loading}
              >
                Submit
              </Button>
            </form>
          </Paper>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
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
