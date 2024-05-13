import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Autocomplete,
  FormControl,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExecutionHighlights,
  fetchExecutionHighlightsById,
  updateExecutionHighlights,
} from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

const ExecutionHighlightsEditForm = () => {
  const { executionHighlightId } = useParams();
  const dispatch = useDispatch();
  const executionHighlights = useSelector(
    (state) => state.executionHighlights.executionHighlights
  );
  const [stack, setStack] = useState("");
  const [image, setImage] = useState(null);
  const [count, setCount] = useState("");
  const [existingImages, setExistingImages] = useState("");
  const [service, setService] = useState(null);
  const serviceData = useSelector((state) => state.service.serviceData);

  useEffect(() => {
    const fetchExecutionHighlights = async () => {
      try {
        const [executionHighlightsResponse, categoriesResponse] =
          await Promise.all([
            dispatch(fetchExecutionHighlightsById(executionHighlightId)),
            dispatch(fetchServices()),
          ]);

        const fetchedHighlights = executionHighlightsResponse.payload;

        if (!fetchedHighlights) {
          console.error("ExecutionHighlights data not available");
          return;
        }

        const { stack, image, count, service } = fetchedHighlights;

        setStack(stack || "");
        setImage(image || null);
        setCount(count || "");
        setExistingImages(image || null);

        setService(service || null);

        console.log("State after setting values:", {
          stack,
          image,
          count,
          service,
        });
      } catch (error) {
        console.error("Error fetching executionHighlight details:", error);
      }
    };

    fetchExecutionHighlights();
  }, [executionHighlightId, dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("stack", stack);

    // Check if the image state is not empty and is not a string (indicating an updated image)
    if (image && typeof image !== "string") {
      formData.append("image", image);
    } else {
      // If the image state is either empty or a string (indicating an existing image), use the existing image URL
      formData.append("image", existingImages); // Here you append the existing image URL directly
    }

    formData.append("count", count);
    formData.append("service", service?._id || "");

    try {
      await dispatch(
        updateExecutionHighlights({ executionHighlightId, formData })
      );

      const updatedexecutionHighlightsDetails = await dispatch(
        fetchExecutionHighlightsById(executionHighlightId)
      );

      setExistingImages(updatedexecutionHighlightsDetails.image || "");
    } catch (error) {
      console.error("Error updating executionHighlights:", error);
    }
  };

  return (
    <LeftNavigationBar
      Content={
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
              textAlign={"center"}
              component="div"
              fontFamily={"Serif"}
            >
              Execution Highlights Edit Form
            </Typography>
            <br></br>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="stack"
                    variant="outlined"
                    required
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
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
                  {existingImages && (
                    <Typography style={{ marginLeft: "16px" }}>
                      {existingImages.split("/").pop()}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
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
                  </FormControl>{" "}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="count"
                    variant="outlined"
                    required
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
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
      }
    />
  );
};

export default ExecutionHighlightsEditForm;
