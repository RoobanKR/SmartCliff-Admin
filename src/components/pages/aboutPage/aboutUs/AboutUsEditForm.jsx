import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  Grid,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import { useCookies } from "react-cookie";
import { getAllAboutUs, updateAboutUs } from "../../../redux/slices/aboutpage/aboutUs/aboutus";

const AboutUsEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const aboutUss = useSelector((state) => state.aboutUs.aboutUss);
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    preview: "",
  });
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (!cookies.token) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies, dispatch, navigate]);
  useEffect(() => {
    if (!aboutUss.length) {
      dispatch(getAllAboutUs()); // Ensure the data is loaded
    }
  }, [dispatch, aboutUss.length]);
  
  useEffect(() => {
    console.log("aboutUss from Redux:", aboutUss); // Debugging log
    if (id) {
      const existingData = aboutUss.find((item) => item._id === id);
      console.log("existingData", existingData); // Debugging log
      
      if (existingData) {
        setFormData({
          title: existingData.title || "",
          preview: existingData.image || "",
        });
      } else {
        setMessage({ text: "Failed to fetch data", type: "error" });
        setOpenSnackbar(true);
      }
    }
  }, [id, aboutUss]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setMessage({ text: "Image size exceeds 3MB limit", type: "error" });
        setOpenSnackbar(true);
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
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    } else {
      formDataToSend.append("image", formData.preview.split("/").pop()); // Send existing image name
    }

    dispatch(updateAboutUs({ id, formData: formDataToSend, token: cookies.token }))
      .unwrap()
      .then(() => {
        setMessage({ text: "Updated successfully", type: "success" });
        setOpenSnackbar(true);
        setTimeout(() => navigate("/about/aboutus-control"), 2000);
      })
      .catch((error) => {
        setMessage({ text: error?.message || "Something went wrong", type: "error" });
        setOpenSnackbar(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <LeftNavigationBar
      Content={
        <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 3, boxShadow: 3 }}>
          <CardContent>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
              <Alert severity={message.type}>{message.text}</Alert>
            </Snackbar>
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
                mb: 3,
                mt: -4,
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
              Edit About Us
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{ mt: 2 }}
                  >
                    Upload Image
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                  </Button>
                  {formData.preview && (
                    <img
                      src={formData.preview}
                      alt="Preview"
                      style={{ width: "100%", height: "auto", marginTop: 10, borderRadius: 8 }}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Update"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      }
    />
  );
};

export default AboutUsEditForm;