import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import {
  getTestimonialById,
  updateTestimonial,
} from "../../../redux/slices/services/testimonial/Testimonial";
import { fetchExecutionHighlights } from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import { getGalleryById, updateGallery } from "../../../redux/slices/services/gallery/Gallery";

const GalleryEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [year, setYaer] = useState("");
  const selectedGallery = useSelector(
    (state) => state.gallery.selectedGallery
  );
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");
  const [service, setService] = useState(null);
  const serviceData = useSelector((state) => state.service.serviceData);

  useEffect(() => {
    dispatch(getGalleryById(id));
    dispatch(fetchServices());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedGallery) {
      setName(selectedGallery.name || "");
      setYaer(selectedGallery.year || "");
      setService(selectedGallery.service || null);
      setExistingIcon(selectedGallery.image || "");
    }
  }, [selectedGallery]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("year", year);
    formData.append("service", service?._id || "");
    if (image) {
      formData.append("image", image);
    }
    try {
      await dispatch(updateGallery({ id, formData }));
      navigate(`/Gallery-control`);
    } catch (error) {
      setError(error.message);
    } finally {
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
              Edit Gallery
            </Typography>
            <form onSubmit={handleSubmit}>
              <DropzoneArea
                onChange={(fileArray) => setImage(fileArray[0])}
                acceptedFiles={["image/jpeg", "image/jpg"]}
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an image here or click"
              />
              <Typography
                variant="subtitle1"
                color="textSecondary"
                style={{ marginTop: "16px" }}
              >
                Existing Image:
              </Typography>
              {existingIcon && (
                <Typography style={{ marginLeft: "16px" }}>
                  {existingIcon.split("/").pop()}
                </Typography>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                fullWidth
                label="year"
                variant="outlined"
                value={year}
                onChange={(e) => setYaer(e.target.value)}
              />
              <FormControl fullWidth>
                <Autocomplete
                  id="service"
                  options={serviceData}
                  getOptionLabel={(option) => option.title || ""}
                  value={service}
                  onChange={(_, newValue) => setService(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="service"
                      fullWidth
                    />
                  )}
                />
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#4CAF50", color: "white" }}
                fullWidth
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default GalleryEditForm;
