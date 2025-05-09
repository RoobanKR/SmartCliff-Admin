import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Snackbar,
  Alert,
  useTheme,
  Tooltip,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { clearError, createPopUpNotification } from "../../../redux/slices/home/popUpNotification/popupNotification";
import { HelpOutline } from "@mui/icons-material";

const PopUpNotificationAddForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [button, setButton] = useState("");

  const [link, setLink] = useState("");
  const [images, setImages] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { loading, error, isSuccess } = useSelector(
    (state) => state.popUpNotification // Adjust based on your slice name
  );

  const [touchedFields, setTouchedFields] = useState({
    title: false,
    description: false,
    button: false,

    link: false,
    image: false,
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    button: "",
    link: "",
    image: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "description":
        setDescription(value);
        break;
        case "button":
        setButton(value);
        break;
      case "link":
        setLink(value);
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

    // Validate fields
    if (!title.trim()) {
      setErrors((prev) => ({ ...prev, title: "Title is required" }));
      return;
    }
    if (!description.trim()) {
      setErrors((prev) => ({ ...prev, description: "Description is required" }));
      return;
    }
     if (!button.trim()) {
      setErrors((prev) => ({ ...prev, button: "Button is required" }));
      return;
    }
    if (!link.trim()) {
      setErrors((prev) => ({ ...prev, link: "Link is required" }));
      return;
    }
    if (images.length === 0) {
      setErrors((prev) => ({ ...prev, image: "Image is required" }));
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("button", button);

    formData.append("link", link);
    for (let i = 0; i < images.length; i++) {
      formData.append("image", images[i]);
    }

    try {
      const result = await dispatch(createPopUpNotification(formData)).unwrap();
      if (result) {
        setSubmitSuccess(true);
      }
    } catch (err) {
      console.error("Failed to create pop-up notification:", err);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      setTimeout(() => {
        dispatch(clearError());
        navigate("/popup-notification-control"); // Adjust the navigation path as needed
      }, 2000);
    }
  }, [submitSuccess, navigate, dispatch]);

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

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
              Pop-up notification created successfully!
            </Alert>
          </Snackbar>

          <Paper elevation={0}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mt={2} mb={2}>
              <Button variant ="outlined" color="primary" onClick={handleBack}>
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
                Add Pop-Up Notification
                </Typography>
                             <Tooltip
                               title="This is where you can add the Popup Notification in Home page show"
                               arrow
                             >
                               <HelpOutline
                                 sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }}
                               />
                             </Tooltip>
                           </Box>            </Box>
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
                id="title"
                label="Title"
                name="title"
                value={title}
                onChange={handleChange}
                error={Boolean(errors.title)}
                helperText={touchedFields.title && errors.title}
                onBlur={() => setTouchedFields((prev) => ({ ...prev, title: true }))}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                value={description}
                onChange={handleChange}
                error={Boolean(errors.description)}
                helperText={touchedFields.description && errors.description}
                onBlur={() => setTouchedFields((prev) => ({ ...prev, description: true }))}
              />
                            <TextField
                margin="normal"
                required
                fullWidth
                id="button"
                label="Button Name"
                name="button"
                value={button}
                onChange={handleChange}
                error={Boolean(errors.button)}
                helperText={touchedFields.button && errors.button}
                onBlur={() => setTouchedFields((prev) => ({ ...prev, button: true }))}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="link"
                label="Link"
                name="link"
                value={link}
                onChange={handleChange}
                error={Boolean(errors.link)}
                helperText={touchedFields.link && errors.link}
                onBlur={() => setTouchedFields((prev) => ({ ...prev, link: true }))}
              />
              <DropzoneArea
                onChange={handleImageChange}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                showPreviews={false}
                dropzoneText="Drag and drop an image here or click"
              />
              {touchedFields.image && errors.image && (
                <Typography variant="body2" color="error">
                  {errors.image}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  mt: 3,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Submit Pop-Up Notification
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default PopUpNotificationAddForm;