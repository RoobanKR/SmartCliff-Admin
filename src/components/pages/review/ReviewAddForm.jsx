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
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { clearUpdateStatus, createReview, resetReview } from "../../redux/slices/review/review";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

const ReviewAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [ratings, setRatings] = useState("");
  const [profile, setProfile] = useState(null);
  const [batch, setBatch] = useState("");
  const [role, setRole] = useState("");
  const [video, setVideo] = useState(null);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { loading, error, isSuccess } = useSelector((state) => state.reviews.reviews);

  const [touchedFields, setTouchedFields] = useState({
    name: false,
    review: false,
    ratings: false,
    image: false,
    batch: false,
    role: false,
    video: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    ratings: "",
    review: "",
    image: "",
    batch: "",
    role: "",
    video: "",
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetReview());
    }
  }, [isSuccess, dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "name":
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            name: "Name must contain only letters",
          }));
        } else {
          setErrors((prev) => ({ ...prev, name: "" }));
        }
        setName(value);
        break;
      case "review":
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            review: "Description must contain only letters",
          }));
        } else {
          setErrors((prev) => ({ ...prev, review: "" }));
        }
        setReview(value);
        break;
      case "ratings":
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          setErrors((prev) => ({ ...prev, ratings: "Rating must be a number with up to 2 decimal places" }));
        } else if (parseFloat(value) > 5) {
          setErrors((prev) => ({ ...prev, ratings: "Rating must be 5 or below" }));
        } else {
          setErrors((prev) => ({ ...prev, ratings: "" }));
        }
        setRatings(value);
        break;
      case "batch":
        setBatch(value);
        break;
      case "role":
        setRole(value);
        break;
      default:
        break;
    }

    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleImageChange = (files) => {
    setProfile(files);
    setTouchedFields((prev) => ({ ...prev, image: true }));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleVideoChange = (files) => {
    if (files.length > 0) {
      const file = files[0];
      const maxSize = 40 * 1024 * 1024; // 10MB in bytes
  
      if (file.size > maxSize) {
        setErrors((prev) => ({ ...prev, video: "Video file size must be 10MB or less" }));
        setVideo(null);
        return;
      }
  
      setVideo(files);
      setTouchedFields((prev) => ({ ...prev, video: true }));
      setErrors((prev) => ({ ...prev, video: "" }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }
    if (!review.trim()) {
      setErrors((prev) => ({ ...prev, review: "Description is required" }));
      return;
    }
    if (!ratings.trim()) {
      setErrors((prev) => ({ ...prev, ratings: "Ratings is required" }));
      return;
    }
    if (!batch.trim()) {
      setErrors((prev) => ({ ...prev, batch: "Batch is required" }));
      return;
    }
    if (!role.trim()) {
      setErrors((prev) => ({ ...prev, role: "Role is required" }));
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("ratings", ratings);
    formData.append("review", review);
    formData.append("batch", batch);
    formData.append("role", role);

    if (profile) {
      for (let i = 0; i < profile.length; i++) {
        formData.append("profile", profile[i]);
      }
    }

    if (video) {
      for (let i = 0; i < video.length; i++) {
        formData.append("video", video[i]);
      }
    }

    try {
      const result = await dispatch(createReview({ token: cookies.token, formData })).unwrap();
      if (result) {
        setSubmitSuccess(true);
      }
    } catch (err) {
      console.error("Failed to create review:", err);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      setTimeout(() => {
        dispatch(clearUpdateStatus());
        navigate("/Review-control");
      }, 2000);
    }
  }, [submitSuccess, navigate, dispatch]);

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="sm">
          <Snackbar open={submitSuccess} autoHideDuration={2000} onClose={() => setSubmitSuccess(false)}>
            <Alert severity="success">Review created successfully</Alert>
          </Snackbar>

          <Card elevation={4} sx={{ borderRadius: "15px", overflow: "hidden", marginTop: 4 }}>
            <CardContent sx={{ padding: 4 }}>
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
                Add a Review
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <DropzoneArea
                      onChange={handleImageChange}
                      acceptedFiles={["image/*"]}
                      filesLimit={5}
                      dropzoneText="Upload Profile Image"
                      showPreviewsInDropzone
                      showPreviews
                      maxFileSize={5 * 1024 * 1024} // 5MB
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField fullWidth label="Name" name="name" value={name} onChange={handleChange} variant="outlined" required />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField fullWidth label="Review" name="review" value={review} onChange={handleChange} variant="outlined" required />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField fullWidth label="Ratings" name="ratings" type="number" value={ratings} onChange={handleChange} variant="outlined" required />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField fullWidth label="Batch" name="batch" value={batch} onChange={handleChange} variant="outlined" required />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField fullWidth label="Role" name="role" value={role} onChange={handleChange} variant="outlined" required />
                  </Grid>

                  <Grid item xs={12}>
                    <DropzoneArea
                      onChange={handleVideoChange}
                      acceptedFiles={["video/*"]}
                      filesLimit={1}
                      maxFileSize={40 * 1024 * 1024} // 10MB
                      dropzoneText="Upload a Video (Max: 10MB)"
                      showPreviewsInDropzone
                      showPreviews
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        fontWeight: "bold",
                        padding: "12px",
                        "&:hover": {
                          backgroundColor: "#45a049",
                        },
                      }}
                    >
                      Submit Review
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Container>
      }
    />
  );
};

export default ReviewAddForm;