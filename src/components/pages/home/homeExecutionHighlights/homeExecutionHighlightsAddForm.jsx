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
  Snackbar,
  Alert,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import { clearError, createHomeExecutionHighlight } from "../../../redux/slices/home/homeExecutionHighlights/homeExecutionHighlights";

const HomeExecutionHighlightsAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const [cookies] = useCookies(["token"]);
  
  const [stack, setStack] = useState("");
  const [count, setCount] = useState("");
  const [images, setImages] = useState([]);
  const [ExecutionHighlightState, setExecutionHighlightState] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const  { loading, error, isSuccess } = useSelector(
      (state) => state.executionHighlights.executionHighlights
    );
  
  const [touchedFields, setTouchedFields] = useState({
    stack: false,
    count: false,
    image: false,
  });
  const [errors, setErrors] = useState({
    stack: "",
    count: "",
    image: "",
  });



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


    try {
         const result = await dispatch(
            createHomeExecutionHighlight(formData )
         ).unwrap();
         if (result) {
           setSubmitSuccess(true);
         }
       } catch (err) {
         console.error("Failed to create service:", err);
       }
     };

  useEffect(() => {
    if (submitSuccess) {
      setTimeout(() => {
        dispatch(clearError());
        navigate("/home/execution-highlights-control");
      }, 2000);
    }
  }, [submitSuccess, navigate, dispatch]);

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
                    <Snackbar
                      open={submitSuccess}
                      autoHideDuration={2000}
                      onClose={() => setSubmitSuccess(false)}
                    >
                      <Alert severity="success">
                        {typeof isSuccess === "object"
                          ? JSON.stringify(isSuccess)
                          : isSuccess || "Service highlight created successfully"}
                      </Alert>
                    </Snackbar>
          
          
          <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: 'Merriweather, serif',
                fontWeight: 700, textAlign: 'center',
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 5,
                "&::before": {
                  content: '""',
                  width: "28px",
                  height: "5px",
                  display: "block",
                  position: "absolute",
                  bottom: "3px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#747474",
                },
                "&::after": {
                  content: '""',
                  width: "100px",
                  height: "1px",
                  display: "block",
                  position: "relative",
                  marginTop: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#747474",
                },
              }}
            >
              Home Execution Highlights Add Form
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

export default HomeExecutionHighlightsAddForm;
