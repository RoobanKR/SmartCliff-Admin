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
import { createGallery } from "../../../redux/slices/services/gallery/Gallery";
import * as Yup from "yup";

const GalleryAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    year: false,
    image: false,
    service: false,
  });
  const serviceData = useSelector((state) => state.service.serviceData);
  const [errors, setErrors] = useState({
    name: "",
    year: "",
    image: "",
    service: "",
  });

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
    setTouchedFields((prev) => ({ ...prev, service: true }));
    setErrors((prev) => ({ ...prev, service: "" }));
  };

  const handleImageChange = (files) => {
    setImage(files[0]);
    setTouchedFields((prev) => ({ ...prev, image: true }));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update state for the respective field
    switch (name) {
      case "name":
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            name: "Name must contain only letters",
          }));
        } else {
          setErrors((prev) => ({ ...prev, name: "" }));
        }
        setName(value);
        break;
      case "year":
        if (!/^\d{4}$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            year: "Year must be exactly 4 digits",
          }));
        } else {
          const yearNum = parseInt(value);
          if (yearNum < 1947 || yearNum > 2050) {
            setErrors((prev) => ({
              ...prev,
              year: "Year must be between 1947 and 2050",
            }));
          } else {
            setErrors((prev) => ({ ...prev, year: "" }));
          }
        }
        setYear(value);
        break;
      default:
        break;
    }

    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty and display error message
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }
    if (!year.trim()) {
      setErrors((prev) => ({ ...prev, year: "Year is required" }));
      return;
    }
    if (!selectedService) {
      setErrors((prev) => ({ ...prev, service: "Service is required" }));
      return;
    }
    if (!image) {
      setErrors((prev) => ({ ...prev, image: "Image is required" }));
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("year", year);
    formData.append("image", image);
    formData.append("service", selectedService._id);

    dispatch(createGallery(formData));
    // navigate("/Gallery-control");
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
              Add Gallery
            </Typography>
            <form onSubmit={handleSubmit}>
              <DropzoneArea
                onChange={handleImageChange}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an image here or click"
              />
              {touchedFields.image && errors.image && (
                <Typography variant="body2" color="error">
                  {errors.image}
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
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={touchedFields.name && errors.name}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, name: true }))
                }
              />
              <br></br>
              <br></br>

              <TextField
                fullWidth
                label="Year"
                type="number"
                variant="outlined"
                value={year}
                name="year"
                onChange={handleChange}
                error={Boolean(errors.year)}
                helperText={touchedFields.year && errors.year}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, year: true }))
                }
              />
              <br></br>
              <br></br>

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
                      error={Boolean(errors.service)}
                      helperText={touchedFields.service && errors.service}
                    />
                  )}
                />
              </FormControl>
              <br></br>
              <br></br>
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

export default GalleryAddForm;
