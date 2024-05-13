import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Autocomplete,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { createTestimonial } from "../../../redux/slices/business/placementTestimonial/placementTestimonial";

const PlacementTestimonialAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [designation, setDesignation] = useState("");
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [type, setType] = useState(null);

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    designation: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    name: false,
    description: false,
    designation: false,
  });

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

  const validateDesignation = () => {
    if (!designation.trim()) {
      setErrors((prev) => ({ ...prev, name: "designation is required" }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
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

  const handleDesignationChange = (event) => {
    const { value } = event.target;
    const onlyLettersWithSpaceRegex = /^[A-Za-z]+( [A-Za-z]+)?$/;
    if (onlyLettersWithSpaceRegex.test(value) || value === "") {
      setDesignation(value);
      setErrors((prev) => ({ ...prev, name: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        name: "Designation must contain only letters with one optional space",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (image && Object.values(errors).every((error) => !error)) {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("designation", designation);
      formData.append("review", description);
      formData.append("type", type);
      dispatch(createTestimonial(formData));
      navigate("/placement_testimonial-control");
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
                margin="normal"
                required
                fullWidth
                id="designation"
                label="Designation"
                name="designation"
                value={designation}
                onChange={handleDesignationChange}
                error={touchedFields.designation && Boolean(errors.designation)}
                helperText={touchedFields.designation && errors.designation}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, designation: true }))
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
              />

              <Autocomplete
                fullWidth
                id="type"
                options={["hirefromus", "trainfromus", "institute"]}
                value={type}
                onChange={(event, newValue) => {
                  setType(newValue);
                  setErrors((prev) => ({ ...prev, type: "" }));
                }}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, type: true }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    margin="normal"
                    error={touchedFields.type && Boolean(errors.type)}
                    helperText={touchedFields.type && errors.type}
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

export default PlacementTestimonialAddForm;
