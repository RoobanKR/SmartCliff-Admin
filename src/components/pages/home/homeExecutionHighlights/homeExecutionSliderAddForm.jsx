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
  useTheme,
  Tooltip,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import {
  clearError,
  createHomeExecutionHighlight,
} from "../../../redux/slices/home/homeExecutionHighlights/homeExecutionHighlights";
import { makeStyles } from "@material-ui/core/styles";
import { HelpOutline } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  paper: {
    // maxWidth: 600,
    // margin: "auto",
    // padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "70%",
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
  },
}));

const HomeExecutionHighlightsAddForm = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const [stack, setStack] = useState("");
  const [count, setCount] = useState("");
  const [images, setImages] = useState([]);
  const [ExecutionHighlightState, setExecutionHighlightState] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { loading, error, isSuccess } = useSelector(
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
        createHomeExecutionHighlight(formData)
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

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };  // Extract unique job positions for dropdown filter



  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Snackbar
            open={submitSuccess}
            autoHideDuration={2000}
            onClose={() => setSubmitSuccess(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert severity="success" variant="filled">
              {typeof isSuccess === "object"
                ? JSON.stringify(isSuccess)
                : isSuccess || "Service highlight created successfully"}
            </Alert>
          </Snackbar>

          <Paper elevation={0}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              mt={2}
              mb={2}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
              >
                Back
              </Button>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flex: 1
              }}>
                <Typography
                  variant="h4"
                  sx={{
                    position: "relative",
                    padding: 0,
                    margin: 0,
                    fontWeight: 300,
                    fontSize: { xs: "32px", sm: "40px" },
                    color: "#747474",
                    textAlign: "center",
                    textTransform: "uppercase",
                    paddingBottom: "5px",
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
                  Execution Slider Add Form
                </Typography>
                <Tooltip
                  title="This is where you can add the execution count for the service."
                  arrow
                >
                  <HelpOutline
                    sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }}
                  />
                </Tooltip>
              </Box>
            </Box>
            <form
              onSubmit={handleSubmit}
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
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

              <Button
                type="submit"
                variant="contained"
                className={classes.submit}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  mt: 3, // optional: top margin
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Submit Execution Slider
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default HomeExecutionHighlightsAddForm;
