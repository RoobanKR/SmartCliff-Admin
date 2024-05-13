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
  getClientById,
  updateClient,
} from "../../../redux/slices/services/client/Client";

const ClientEditForm = () => {
  const { clientId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    service: "",
  });
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    service: false,
  });

  const selectedClientById = useSelector(
    (state) => state.clients.selectedClientById
  );
  const serviceData = useSelector((state) => state.service.serviceData);
  const [existingIcon, setExistingIcon] = useState("");

  const handleNameChange = (event) => {
    const { value } = event.target;
    const onlyAlphabetsWithSpaceRegex = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
    if (onlyAlphabetsWithSpaceRegex.test(value) || value === "") {
      setName(value);
      setErrors((prev) => ({ ...prev, name: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        name: "Name must contain only alphabets with one optional space",
      }));
    }
  };

  useEffect(() => {
    dispatch(getClientById(clientId));
    dispatch(fetchServices());
  }, [dispatch, clientId]);

  useEffect(() => {
    if (selectedClientById) {
      setName(selectedClientById.name || "");
      setService(selectedClientById.service || null);
      setExistingIcon(selectedClientById.image || "");
    }
  }, [selectedClientById]);

  const validateName = () => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const validateService = () => {
    if (!service) {
      setErrors((prev) => ({ ...prev, service: "Service is required" }));
    } else {
      setErrors((prev) => ({ ...prev, service: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    validateName();
    validateService();

    if (!Object.values(errors).some((error) => error)) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("service", service?._id || "");
      if (image) {
        formData.append("image", image);
      }
      try {
        await dispatch(updateClient({ clientId, formData }));
        navigate(`/Client-control`);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
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
              Edit Clients
            </Typography>
            <form onSubmit={handleSubmit}>
              <DropzoneArea
                onChange={(fileArray) => setImage(fileArray[0])}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an image here or click"
                required
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
                label="Name"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setTouchedFields((prev) => ({ ...prev, name: true }));
                  handleNameChange(e);
                }}
                error={touchedFields.name && Boolean(errors.name)}
                helperText={touchedFields.name && errors.name}
              />

              <FormControl fullWidth>
                <Autocomplete
                  id="service"
                  options={serviceData}
                  getOptionLabel={(option) => option.title || ""}
                  value={service}
                  onChange={(_, newValue) => {
                    setService(newValue);
                    setTouchedFields((prev) => ({ ...prev, service: true }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Service"
                      fullWidth
                      error={touchedFields.service && Boolean(errors.service)}
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
                disabled={loading}
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

export default ClientEditForm;
