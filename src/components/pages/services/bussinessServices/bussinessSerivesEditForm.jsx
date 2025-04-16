import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import {
  getByIdBussinessService,
  updateBussinessService,
} from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

const BussinessServiceEditForm = () => {
  const { businessServiceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");
  const [existingLogo, setExistingLogo] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const selectBussinessServices = useSelector(
    (state) => state.businessService.selectedService
  );

  useEffect(() => {
    dispatch(getByIdBussinessService(businessServiceId));
  }, [dispatch, businessServiceId]);

  useEffect(() => {
    if (selectBussinessServices) {
      setName(selectBussinessServices.name || "");
      setDescription(selectBussinessServices.description || "");
      setSlug(selectBussinessServices.slug || "");
      setTitle(selectBussinessServices.title || "");
      setExistingIcon(selectBussinessServices.image || "");
      setExistingLogo(selectBussinessServices.logo || "");
    }
  }, [selectBussinessServices]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("slug", slug);
    formData.append("title", title);
    if (image) {
      formData.append("image", image);
    }
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      await dispatch(updateBussinessService({ businessServiceId, formData }));
      setSnackbar({ open: true, message: "Business service updated successfully!", severity: "success" });
      navigate("/Business-Services-control");
    } catch (error) {
      console.error("Error updating service:", error);
      setSnackbar({ open: true, message: "Failed to update business service.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
              Service Edit Form
            </Typography>
            <br />
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Service Name"
                    variant="outlined"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Service Title"
                    variant="outlined"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Grid>
 <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Service Slug"
                    variant="outlined"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DropzoneArea
                    onChange={(fileArray) => setImage(fileArray[0])}
                    acceptedFiles={["image/*"]}
                    filesLimit={1}
                    maxFileSize={5000000} // 5MB
                    dropzoneText="Drag and drop an image here or click"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <DropzoneArea
                    onChange={(fileArray) => setLogo(fileArray[0])}
                    acceptedFiles={["image/*"]}
                    filesLimit={1}
                    maxFileSize={5000000} // 5MB
                    dropzoneText="Drag and drop a logo here or click"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Existing Image: {existingIcon && existingIcon.split("/").pop()}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Existing Logo: {existingLogo && existingLogo.split("/").pop()}
                  </Typography>
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

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      }
    />
  );
};

export default BussinessServiceEditForm;