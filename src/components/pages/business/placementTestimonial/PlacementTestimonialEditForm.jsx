import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Autocomplete,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTestimonialById,
  updateTestimonial,
} from "../../../redux/slices/business/placementTestimonial/placementTestimonial";

const PlacementTestimonialEditForm = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [review, setDescription] = useState("");
  const [designation, setDesignation] = useState("");
  const selectedTestimonialById = useSelector(
    (state) => state.placementTestimonial.selectedTestimonialById
  );
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");

  useEffect(() => {
    dispatch(getTestimonialById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedTestimonialById) {
      setName(selectedTestimonialById.name || "");
      setDescription(selectedTestimonialById.review || "");
      setDesignation(selectedTestimonialById.designation || "");
      setExistingIcon(selectedTestimonialById.image || "");
      setType(selectedTestimonialById.type || "");
    }
  }, [selectedTestimonialById]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("review", review);
    formData.append("designation", designation);
    formData.append("type", type);

    if (image) {
      formData.append("image", image);
    }
    try {
      await dispatch(updateTestimonial({ id, formData }));
      navigate(`/placement_testimonial-control`);
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
              gutterBottom
              variant="h4"
              align="center"
              component="div"
              style={{ fontFamily: "Serif" }}
            >
              Edit Testimonial
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
                margin="normal"
                required
                fullWidth
                id="designation"
                label="designation"
                name="designation"
                value={designation}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                fullWidth
                label="review"
                variant="outlined"
                multiline
                rows={4}
                value={review}
                onChange={(e) => setDescription(e.target.value)}
              />{" "}
              <Autocomplete
                fullWidth
                id="type"
                options={["hirefromus", "trainfromus", "institute"]}
                value={type}
                onChange={(event, newValue) => setType(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    margin="normal"
                    required
                  />
                )}
              />
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

export default PlacementTestimonialEditForm;
