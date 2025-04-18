import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  Tooltip,
  Box,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import { useCookies } from "react-cookie";
import { createAboutUs } from "../../../redux/slices/aboutpage/aboutUs/aboutus";
import { HelpOutline } from "@mui/icons-material";
import { DropzoneArea } from "material-ui-dropzone";

const AboutUsAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    preview: "",
  });
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["token"]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (!cookies.token) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Image size exceeds the 3MB limit");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload an image");
      return;
    }
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("image", formData.image);

    dispatch(createAboutUs({ token: cookies.token, formData: data }))
      .unwrap()
      .then(() => {
        setSnackbarOpen(true); // Show snackbar
        setTimeout(() => navigate("/about/aboutus-control"), 1500); // Delayed redirect
      })
      .catch((error) => {
        alert("Error: " + (error?.message || "Something went wrong"));
      })
      .finally(() => setLoading(false));
  };

  return (
    <LeftNavigationBar
      Content={
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={2}
            mb={1}
          >
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: "Merriweather, serif",
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
              About Us Content
              <br /> Add Form
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
          <Card elevation={0} sx={{ maxWidth: 700, margin: "auto" }}>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                style={{
                  border: "2px dotted #D3D3D3",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
                <DropzoneArea
                  acceptedFiles={["image/*"]}
                  dropzoneText="Drag and drop an image here or click"
                  onChange={(files) => {
                    if (files.length > 0) {
                      handleFileChange(files[0]);
                    }
                  }}
                  filesLimit={1}
                  showAlerts={["error"]}
                  showFileNames
                  useChipsForPreview
                  previewText="Selected file:"
                  maxFileSize={5 * 1024 * 1024} // 5MB
                  sx={{ mt: 2, borderRadius: 2 }}
                />
                {formData.preview && (
                  <img
                    src={formData.preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "auto",
                      marginTop: 10,
                      borderRadius: 8,
                    }}
                  />
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
                    mt: 3, // optional: top margin
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Submit Content
                </Button>
              </form>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  onClose={() => setSnackbarOpen(false)}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  Successfully added!
                </Alert>
              </Snackbar>
            </CardContent>
          </Card>
        </>
      }
    />
  );
};

export default AboutUsAddForm;
