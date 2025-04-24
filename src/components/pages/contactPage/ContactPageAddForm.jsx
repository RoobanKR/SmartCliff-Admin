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
  Tooltip,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HelpOutline } from "@mui/icons-material";
import { clearError, createContactPage } from "../../redux/slices/contactPage/contactPage";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

const ContactPageAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [contact, setContact] = useState("");
  const [images, setImages] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { loading, error } = useSelector((state) => state.contactPage); // Adjust based on your slice name

  const [touchedFields, setTouchedFields] = useState({
    contact: false,
    image: false,
  });
  const [errors, setErrors] = useState({
    contact: "",
    image: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContact(value);
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
    if (!contact.trim()) {
      setErrors((prev) => ({ ...prev, contact: "Contact is required" }));
      return;
    }
    if (images.length === 0) {
      setErrors((prev) => ({ ...prev, image: "Image is required" }));
      return;
    }

    const formData = new FormData();
    formData.append("contact", contact);
    for (let i = 0; i < images.length; i++) {
      formData.append("image", images[i]);
    }

    try {
      await dispatch(createContactPage(formData)).unwrap();
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Failed to create contact page:", err);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      setTimeout(() => {
        dispatch(clearError());
        navigate("/contact-page-control"); // Adjust the navigation path as needed
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
              Contact page created successfully!
            </Alert>
          </Snackbar>

          <Paper elevation={0}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mt={2} mb={2}>
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
                Add Contact Page
               </Typography>
                             <Tooltip
                               title="This is where you can add the contact page details"
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
                id="contact"
                label="Contact"
                name="contact"
                value={contact}
                onChange={handleChange}
                error={Boolean(errors.contact)}
                helperText={touchedFields.contact && errors.contact}
                onBlur={() => setTouchedFields((prev) => ({ ...prev, contact: true }))}
              />
              <DropzoneArea
                onChange={handleImageChange}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                showPreviews ={false}
                showPreviewsInDropzone={true}
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
                  backgroundColor: "#3f51b5",
                  color: "#fff",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  mt: 3,
                  "&:hover": {
                    backgroundColor: "#303f9f",
                  },
                }}
              >
                Submit Contact Page
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default ContactPageAddForm;