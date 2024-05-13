import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchServiceById,
  updateService,
} from "../../../redux/slices/services/services/Services";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

const ServiceEditForm = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [slug, setSlug] = useState("");
  const [slugError, setSlugError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const { selectedService } = useSelector((state) => state.service);

  const validateTitle = () => {
    if (!title.trim()) {
      setTitleError("Title is required");
      return false;
    }
    const titleRegex = /^[a-zA-Z\s]*$/;
    if (!titleRegex.test(title)) {
      setTitleError("Invalid title format");
      return false;
    }
    setTitleError("");
    return true;
  };

  const validateSlug = () => {
    if (!slug.trim()) {
      setSlugError("Slug is required");
      return false;
    }
    const slugRegex = /^[a-z]+$/;
    if (!slugRegex.test(slug)) {
      setSlugError("Invalid slug format");
      return false;
    }
    setSlugError("");
    return true;
  };

  const validateDescription = () => {
    if (!description.trim()) {
      setDescriptionError("Description is required");
      return false;
    }
    setDescriptionError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isTitleValid = validateTitle();
    const isSlugValid = validateSlug();
    const isDescriptionValid = validateDescription();

    if (isTitleValid && isSlugValid && isDescriptionValid) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("slug", slug);

      if (newImages.length > 0) {
        newImages.forEach((image) => formData.append("image", image));
      } else {
        existingImages.forEach((imageUrl) => {
          // Logic to handle existing images if needed
        });
      }

      if (newVideos.length > 0) {
        newVideos.forEach((video) => formData.append("videos", video));
      } else {
        existingVideos.forEach((videoUrl) => {
          // Logic to handle existing videos if needed
        });
      }

      try {
        await dispatch(updateService({ serviceId, formData }));
        navigate("/Services-control");
      } catch (error) {
        console.error("Error updating service:", error);
      }
    }
  };

  useEffect(() => {
    dispatch(fetchServiceById({ serviceId }));
  }, [dispatch, serviceId]);

  useEffect(() => {
    if (!selectedService || !selectedService.title) {
      dispatch(fetchServiceById(serviceId));
    } else {
      setTitle(selectedService.title || "");
      setSlug(selectedService.slug || "");
      setDescription(selectedService.description || "");
      setExistingImages(selectedService.image ? [selectedService.image] : []);
      if (selectedService.videos && selectedService.videos.length > 0) {
        setExistingVideos([...selectedService.videos]);
      }
    }
  }, [selectedService, dispatch, serviceId]);

  return (
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
        <Typography
          gutterBottom
          variant="h4"
          textAlign="center"
          component="div"
          fontFamily="Serif"
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
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value.replace(/[^a-zA-Z\s]/g, ""))
                }
                error={!!titleError}
                helperText={titleError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Slug Name"
                variant="outlined"
                required
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z]/g, ""))
                }
                error={!!slugError}
                helperText={slugError}
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
                error={!!descriptionError}
                helperText={descriptionError}
              />
            </Grid>
            <Grid item xs={12}>
              <DropzoneArea
                acceptedFiles={["image/*"]}
                filesLimit={5}
                dropzoneText="Drag and drop image here or click"
                onChange={(fileArray) => setNewImages(fileArray)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                style={{ marginTop: "16px" }}
              >
                Existing Images:
              </Typography>
              {existingImages.map((imageUrl, index) => {
                const fileName = imageUrl.split("/").pop();
                return (
                  <Typography key={index} style={{ marginLeft: "16px" }}>
                    {fileName}
                  </Typography>
                );
              })}
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setNewVideos([...newVideos, ...e.target.files])
                }
                multiple
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                style={{ marginTop: "16px" }}
              >
                Existing Videos:
              </Typography>
              {existingVideos &&
                existingVideos.map((video, index) => (
                  <Typography key={index} style={{ marginLeft: "16px" }}>
                    {typeof video === "object" ? video.name : video}
                  </Typography>
                ))}
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
  );
};

export default ServiceEditForm;
