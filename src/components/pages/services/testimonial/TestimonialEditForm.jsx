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

const TestimonialEditForm = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [review, setDescription] = useState("");
  const selectedTestimonialById = useSelector(
    (state) => state.testimonial.selectedTestimonialById
  );
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");
  const [service, setService] = useState(null);
  const serviceData = useSelector((state) => state.service.serviceData);
  const executionHighlights = useSelector(
    (state) => state.executionHighlights.executionHighlights
  );
  const [stack, setselectedStack] = useState(null);
  const handleStackChange = (_, newValue) => {
    setselectedStack(newValue);
  };
  useEffect(() => {
    dispatch(getTestimonialById(id));
    dispatch(fetchServices());
    dispatch(fetchExecutionHighlights());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedTestimonialById) {
      setName(selectedTestimonialById.name || "");
      setDescription(selectedTestimonialById.review || "");
      setService(selectedTestimonialById.service || null);
      setselectedStack(selectedTestimonialById.stack || null);
      setExistingIcon(selectedTestimonialById.image || "");
    }
  }, [selectedTestimonialById]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("review", review);
    formData.append("stack", stack._id || "");
    formData.append("service", service?._id || "");
    if (image) {
      formData.append("image", image);
    }
    try {
      await dispatch(updateTestimonial({ id, formData }));
      navigate(`/Service_Testimonial-control`);
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
                fullWidth
                label="review"
                variant="outlined"
                multiline
                rows={4}
                value={review}
                onChange={(e) => setDescription(e.target.value)}
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
              <FormControl fullWidth>
                <Autocomplete
                  id="stack"
                  options={executionHighlights || []}
                  getOptionLabel={(option) => (option ? option.stack : "")}
                  value={stack}
                  onChange={handleStackChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="stack"
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

export default TestimonialEditForm;
