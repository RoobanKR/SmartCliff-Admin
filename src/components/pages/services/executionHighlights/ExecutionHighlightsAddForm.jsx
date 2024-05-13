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
import {
  addExecutionHighlights,
  resetExecutionHighlights,
  selectExecutionHighlightsState,
} from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import * as Yup from "yup";

const ExecutionHighlightsAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stack, setStack] = useState("");
  const [count, setCount] = useState("");
  const [images, setImages] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [ExecutionHighlightState, setExecutionHighlightState] = useState(null);
  const [touchedFields, setTouchedFields] = useState({
    stack: false,
    count: false,
    image: false,
    service: false,
  });
  const serviceData = useSelector((state) => state.service.serviceData);
  const [errors, setErrors] = useState({
    stack: "",
    count: "",
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

  useEffect(() => {
    if (ExecutionHighlightState?.isSuccess) {
      console.log("execution highlights added successfully!");
      dispatch(resetExecutionHighlights());
    }
  }, [ExecutionHighlightState?.isSuccess, dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update state for the respective field
    switch (name) {
      case "stack":
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            stack: "Stack must contain only letters",
          }));
        } else {
          setErrors((prev) => ({ ...prev, stack: "" }));
        }
        setStack(value);
        break;
      case "count":
        if (!/^\d+$/.test(value)) {
          setErrors((prev) => ({ ...prev, count: "Count must be a number" }));
        } else {
          setErrors((prev) => ({ ...prev, count: "" }));
        }
        setCount(value);
        break;
      default:
        break;
    }

    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleImageChange = (files) => {
    setImages(files);
    setTouchedFields((prev) => ({ ...prev, image: true }));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty and display error message
    if (!stack.trim()) {
      setErrors((prev) => ({ ...prev, stack: "Stack is required" }));
      return;
    }
    if (!count.trim()) {
      setErrors((prev) => ({ ...prev, count: "Count is required" }));
      return;
    }
    if (!selectedService) {
      setErrors((prev) => ({ ...prev, service: "Service is required" }));
      return;
    }
    if (images.length === 0) {
      setErrors((prev) => ({ ...prev, image: "Image is required" }));
      return;
    }

    const formData = new FormData();
    formData.append("stack", stack);
    formData.append("count", count);
    for (let i = 0; i < images.length; i++) {
      formData.append("image", images[i]);
    }
    formData.append("service", selectedService._id);

    dispatch(addExecutionHighlights(formData));
    // navigate("/Execution_Highlights-control");
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
              Execution Highlights Add Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <DropzoneArea
                onChange={handleImageChange}
                acceptedFiles={["image/*"]}
                filesLimit={5}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop images here or click"
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
                id="stack"
                label="Stack"
                name="stack"
                value={stack}
                onChange={handleChange}
                error={Boolean(errors.stack)}
                helperText={touchedFields.stack && errors.stack}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, stack: true }))
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="count"
                label="Count"
                name="count"
                type="number"
                value={count}
                onChange={handleChange}
                error={Boolean(errors.count)}
                helperText={touchedFields.count && errors.count}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, count: true }))
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
                      error={Boolean(errors.service)}
                      helperText={touchedFields.service && errors.service}
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

export default ExecutionHighlightsAddForm;
