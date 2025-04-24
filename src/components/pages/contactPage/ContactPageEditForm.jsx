import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Snackbar,
  Alert,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import { clearError, getContactPageById, updateContactPage } from "../../redux/slices/contactPage/contactPage";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { HelpOutline } from "@mui/icons-material";

const ContactPageEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [contact, setContact] = useState("");
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Get error and success message from Redux state
  const { error } = useSelector((state) => state.contactPage);
  const successMessage = "Contact page updated successfully!";

  useEffect(() => {
    if (id) {
      dispatch(getContactPageById(id))
        .then((response) => {
          const data = response.payload;
          if (data) {
            setContact(data.contact || "");
            if (data.image) {
              setExistingImageUrl(data.image); // Set the existing image URL
            }
          }
        })
        .catch((error) => console.error("Error fetching contact page:", error));
    }
  }, [id, dispatch]);

  const handleImageChange = (files) => {
    if (files[0]) {
      setImage(files[0]);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setExistingImageUrl("");
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("contact", contact);

    // Handle image upload or removal
    if (image) {
      formData.append("image", image);
    } else if (!existingImageUrl) {
      // If no image is present, send a flag to remove the existing image
      formData.append("removeImage", "true");
    }

    try {
      await dispatch(updateContactPage({ id: id, formData })).unwrap();
      setSubmitSuccess(true); // Set success state to true
    } catch (error) {
      console.error("Error updating contact page:", error);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      setOpenSnackbar(true);
      setTimeout(() => {
        dispatch(clearError());
        navigate("/contact-page-control");
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
          <Paper elevation={0}>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={2000}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
                       >
                         <Alert severity="success" variant="filled">{successMessage}</Alert>
            </Snackbar>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              mt={2}
              mb={2}
            >
              <Button variant="outlined" color="primary" onClick={handleBack}>
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
                Edit Contact Page
               </Typography>
                             <Tooltip
                               title="This is where you can Edit the contact page details"
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
                border: " 2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="contact"
                label="Contact"
                name="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <Box sx={{ mb: 2 }}>
                {existingImageUrl && (
                  <Box sx={{ position: "relative", mb: 2 }}>
                    <Typography variant="subtitle1">Current Image:</Typography>
                    <img
                      src={existingImageUrl}
                      alt="Contact"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        objectFit: "contain",
                        marginTop: "10px",
                      }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "#fff",
                      }}
                      onClick={handleRemoveImage}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Box>
                )}
                <DropzoneArea
                  onChange={handleImageChange}
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  showPreviews={false}
                  dropzoneText="Drag and drop a new image here or click"
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Update Contact Page
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default ContactPageEditForm;