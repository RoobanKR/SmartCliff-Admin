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
  useTheme,
  Box,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import { useCookies } from "react-cookie";
import {
  getAllAboutUs,
  updateAboutUs,
} from "../../../redux/slices/aboutpage/aboutUs/aboutus";
import { HelpOutline } from "@mui/icons-material";

const AboutUsEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

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

    dispatch(
      updateAboutUs({ id, formData: formDataToSend, token: cookies.token })
    )
      .unwrap()
      .then(() => {
        setMessage({ text: "Updated successfully", type: "success" });
        setOpenSnackbar(true);
        setTimeout(() => navigate("/about/aboutus-control"), 2000);
      })
      .catch((error) => {
        setMessage({
          text: error?.message || "Something went wrong",
          type: "error",
        });
        setOpenSnackbar(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <LeftNavigationBar
      Content={
        <>
          {" "}
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
              <br /> Edit Form
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
              <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
              >
                <Alert severity={message.type}>{message.text}</Alert>
              </Snackbar>

              <form
                onSubmit={handleSubmit}
                style={{
                  border: "2px dotted #D3D3D3",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
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
                      Click Here Update Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
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
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: theme.palette.warning.main,
                        color: theme.palette.warning.contrastText,
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        mt: 3, // optional: top margin
                        "&:hover": {
                          backgroundColor: theme.palette.warning.dark,
                        },
                      }}
                    >
                      Submit Content
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </>
      }
    />
  );
};

export default AboutUsEditForm;
