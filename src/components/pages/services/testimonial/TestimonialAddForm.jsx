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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { createClient } from "../../../redux/slices/services/client/Client";
import { fetchExecutionHighlights } from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import { createTestimonial } from "../../../redux/slices/services/testimonial/Testimonial";

const TestimonialAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStack, setSelectedStack] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false); // State variable to track image upload

  // State variables for errors and touched fields
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    stack: "",
    service: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    name: false,
    description: false,
    stack: false,
    service: false,
  });

  const serviceData = useSelector((state) => state.service.serviceData);
  const executionHighlights = useSelector(
    (state) => state.executionHighlights.executionHighlights
  );

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchExecutionHighlights());
  }, [dispatch]);

  // Validation functions for each field
  const validateName = () => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const validateDescription = () => {
    if (!description.trim()) {
      setErrors((prev) => ({ ...prev, description: "Review is required" }));
    } else {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  const validateStack = () => {
    if (!selectedStack) {
      setErrors((prev) => ({ ...prev, stack: "Stack is required" }));
    } else {
      setErrors((prev) => ({ ...prev, stack: "" }));
    }
  };

  const validateService = () => {
    if (!selectedService) {
      setErrors((prev) => ({ ...prev, service: "Service is required" }));
    } else {
      setErrors((prev) => ({ ...prev, service: "" }));
    }
  };

  const handleNameChange = (event) => {
    const { value } = event.target;
    const onlyLettersWithSpaceRegex = /^[A-Za-z]+( [A-Za-z]+)?$/;
    if (onlyLettersWithSpaceRegex.test(value) || value === "") {
      setName(value);
      setErrors((prev) => ({ ...prev, name: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        name: "Name must contain only letters with one optional space",
      }));
    }
  };

  const handleDescriptionChange = (event) => {
    const { value } = event.target;
    const onlyLettersNumbersWithSpaceAndCharsRegex = /^[A-Za-z0-9,'".\s]+$/;
    if (onlyLettersNumbersWithSpaceAndCharsRegex.test(value) || value === "") {
      setDescription(value);
      setErrors((prev) => ({ ...prev, review: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        review:
          "Review must contain only letters, numbers, a single blank space, and specific characters (, ' \" .)",
      }));
    }
  };

  const handleImageChange = (files) => {
    setImage(files[0]);
    setImageUploaded(true);
  };

  const handleStackChange = (_, newValue) => {
    setSelectedStack(newValue);
    validateStack();
  };

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
    validateService();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (image && Object.values(errors).every((error) => !error)) {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("service", selectedService._id);
      formData.append("review", description);
      formData.append("stack", selectedStack._id);

      dispatch(createTestimonial(formData));
      navigate("/Service_Testimonial-control");
    } else {
      setErrors((prev) => ({
        ...prev,
        image: "Please upload at least one image",
      }));
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
              Add Testimonial
            </Typography>
            <form onSubmit={handleSubmit}>
              <DropzoneArea
                onChange={handleImageChange}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an image here or click"
                required
              />
              {errors.image && (
                <span style={{ color: "red" }}>{errors.image}</span>
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
                error={touchedFields.name && Boolean(errors.name)}
                helperText={touchedFields.name && errors.name}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, name: true }))
                }
              />
              <TextField
                fullWidth
                label="Review"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={handleDescriptionChange}
                error={touchedFields.description && Boolean(errors.description)}
                helperText={touchedFields.description && errors.description}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, description: true }))
                }
              /><br></br><br></br>
              <FormControl fullWidth>
                <Autocomplete
                  id="stack"
                  options={executionHighlights || []}
                  getOptionLabel={(option) => (option ? option.stack : "")}
                  value={selectedStack}
                  onChange={handleStackChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Stack"
                      fullWidth
                      required // Set required attribute here
                      error={touchedFields.stack && Boolean(errors.stack)}
                      helperText={touchedFields.stack && errors.stack}
                      onBlur={() =>
                        setTouchedFields((prev) => ({ ...prev, stack: true }))
                      }
                    />
                  )}
                />
              </FormControl><br></br><br></br>
              <FormControl fullWidth>
                <Autocomplete
                  id="service"
                  options={serviceData || []}
                  getOptionLabel={(option) => (option ? option.title : "")}
                  value={selectedService}
                  onChange={handleServiceChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Service"
                      fullWidth
                      required // Set required attribute here
                      error={touchedFields.service && Boolean(errors.service)}
                      helperText={touchedFields.service && errors.service}
                      onBlur={() =>
                        setTouchedFields((prev) => ({ ...prev, service: true }))
                      }
                    />
                  )}
                />
              </FormControl><br></br><br></br>
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

export default TestimonialAddForm;
