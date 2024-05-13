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
import * as Yup from "yup";

const ClientAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    service: false,
    image: false, // Adding image to the touchedFields state
  });
  const serviceData = useSelector((state) => state.service.serviceData);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
    setTouchedFields((prev) => ({ ...prev, service: true }));
  };

  const handleImageChange = (files) => {
    setImage(files[0]);
    setTouchedFields((prev) => ({ ...prev, image: true })); // Updating the touchedFields state for the image field
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Name must contain only alphabets")
      .required("Name is required"),
    selectedService: Yup.object().nullable().required("Service is required"),
    image: Yup.mixed().required("Image is required"),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await validationSchema.validate({ name, selectedService, image });
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("service", selectedService._id);

      dispatch(createClient(formData));
      navigate("/Client-control");
    } catch (error) {
      console.error(error);
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
              Add Client
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

              {/* Display error message for image field */}
              {touchedFields.image && !image && (
                <Typography variant="body2" color="error">
                  Image is required
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
                onChange={(e) => setName(e.target.value)}
                error={touchedFields.name && !name.match(/^[a-zA-Z\s]+$/)}
                helperText={
                  touchedFields.name &&
                  (!name.match(/^[a-zA-Z\s]+$/)
                    ? "Name must contain only alphabets"
                    : "")
                }
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, name: true }))
                }
              />

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
                      error={touchedFields.service && !selectedService}
                      helperText={
                        touchedFields.service && !selectedService
                          ? "Service is required"
                          : ""
                      }
                      onBlur={() =>
                        setTouchedFields((prev) => ({ ...prev, service: true }))
                      }
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

export default ClientAddForm;
