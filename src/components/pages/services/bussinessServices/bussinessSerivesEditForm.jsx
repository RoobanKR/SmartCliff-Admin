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
  useTheme,
  Tooltip,
  Box,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import {
  getByIdBussinessService,
  updateBussinessService,
} from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { HelpOutline } from "@mui/icons-material";

const BussinessServiceEditForm = () => {
  const { businessServiceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");
  const [existingLogo, setExistingLogo] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
      setSnackbar({
        open: true,
        message: "Business service updated successfully!",
        severity: "success",
      });
      navigate("/Business-Services-control");
    } catch (error) {
      console.error("Error updating service:", error);
      setSnackbar({
        open: true,
        message: "Failed to update business service.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
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
              Business Service
              <br /> Edit Form
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
          <Paper
            elevation={0}
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
                    Existing Image:{" "}
                    {existingIcon && existingIcon.split("/").pop()}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Existing Logo:{" "}
                    {existingLogo && existingLogo.split("/").pop()}
                  </Typography>
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.warning.main,
                  color: theme.palette.warning.contrastText,
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  mt: 3, // optional: top margin
                  "&:hover": {
                    backgroundColor: theme.palette.warning.dark,
                  },
                }}
              >
                Submit Business Service
              </Button>
            </form>
          </Paper>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      }
    />
  );
};

export default BussinessServiceEditForm;
