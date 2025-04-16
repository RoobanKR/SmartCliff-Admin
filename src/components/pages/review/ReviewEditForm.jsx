import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Autocomplete,
  FormControl,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../redux/slices/services/services/Services";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { getAllBussinessServices } from "../../redux/slices/services/bussinessServices/BussinessSerives";
import { clearUpdateStatus, getReviewById, resetReview, updateReview } from "../../redux/slices/review/review";
import { useCookies } from "react-cookie";

const ReviewsEditForm = () => {
  const { reviewId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const { allReview, updateSuccess, successMessage, error, isSuccess } = useSelector(
    (state) => state.reviews
  );
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reviewState, setReviewState] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [review, setDescription] = useState("");
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState("");
  const [batch, setBatch] = useState("");
  const [role, setRole] = useState("");
  const [video, setVideo] = useState(null);
  const [existingProfile, setExistingProfile] = useState("");
  const [existingVideo, setExistingVideo] = useState("");

  // Validation
  const [errors, setErrors] = useState({
    name: "",
    review: "",
    ratings: "",
    batch: "",
    role: "",
    video: "",
  });

  useEffect(() => {
    if (reviewId) {
      dispatch(getReviewById(reviewId)).then(
        (response) => {
          const data = response.payload;
          if (data) {
            setName(data.name || "");
            setDescription(data.review || "");
            setRatings(data.ratings || "");
            setBatch(data.batch || "");
            setRole(data.role || "");
            setExistingProfile(data.profile || "");
            setExistingVideo(data.video || "");

          }
        }
      ).catch((error) => console.error("Error fetching Review:", error)); 
    }
  }, [reviewId, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
      setOpenSnackbar(true);
      setTimeout(() => {
        dispatch(clearUpdateStatus());
        navigate("/Review-control");
      }, 2000);
    }
  }, [updateSuccess, dispatch, navigate]);


  const handleChange = (event) => {
    const { name, value } = event.target;
  
    switch (name) {
      case "name":
        setName(value);
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            name: "Name must contain only letters",
          }));
        } else {
          setErrors((prev) => ({ ...prev, name: "" }));
        }
        break;
      case "review":
        setDescription(value);
        break;
      case "ratings":
        // Ensure ratings is treated as a string
        const ratingsValue = value.toString();
        setRatings(ratingsValue);
        if (parseFloat(ratingsValue) > 5) {
          setErrors((prev) => ({ ...prev, ratings: "Rating must be 5 or below" }));
        } else {
          setErrors((prev) => ({ ...prev, ratings: "" }));
        }
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
  };
  
  
  const handleImageChange = (fileArray) => {
    if (fileArray.length > 0) {
      setProfile(fileArray[0]);
    }
  };

  const handleVideoChange = (fileArray) => {
    if (fileArray.length > 0) {
      const file = fileArray[0];
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  
      if (file.size > maxSize) {
        setErrors((prev) => ({ ...prev, video: "Video file size must be 10MB or less" }));
        setVideo(null);
        return;
      }
  
      setVideo(file);
      setErrors((prev) => ({ ...prev, video: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }
    if (!review.trim()) {
      setErrors((prev) => ({ ...prev, review: "Review is required" }));
      return;
    }
    if (parseFloat(ratings) > 5) {
      setErrors((prev) => ({ ...prev, ratings: "Rating must be 5 or below" }));
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
    formData.append("review", review);
    formData.append("ratings", ratings); // Ensure ratings is a string
    formData.append("batch", batch);
    formData.append("role", role);
    
    if (profile) {
      formData.append("profile", profile);
    }
    
    if (video) {
      formData.append("video", video);
    }
  
    try {
      const result = await dispatch(updateReview({ reviewId, formData, token: cookies.token })).unwrap();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };
  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="sm">
          <Card elevation={4} sx={{ borderRadius: "15px", overflow: "hidden", marginTop: 4 }}>
            <CardContent sx={{ padding: 4 }}>
              <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)}>
                <Alert severity="success">
                  {successMessage || "Review Updated successfully"}
                </Alert>
              </Snackbar>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
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
                Edit Review
              </Typography>
              <br />
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Grid container spacing={2}>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      variant="outlined"
                      required
                      value={name}
                      onChange={(e) => handleChange(e)}
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Review"
                      name="review"
                      variant="outlined"
                      required
                      value={review}
                      onChange={(e) => handleChange(e)}
                      error={!!errors.review}
                      helperText={errors.review}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Batch"
                      name="batch"
                      variant="outlined"
                      required
                      value={batch}
                      onChange={(e) => handleChange(e)}
                      error={!!errors.batch}
                      helperText={errors.batch}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Role"
                      name="role"
                      variant="outlined"
                      required
                      value={role}
                      onChange={(e) => handleChange(e)}
                      error={!!errors.role}
                      helperText={errors.role}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div style={{marginTop: '16px'}}>
                      <DropzoneArea
                        onChange={handleImageChange}
                        acceptedFiles={["image/png", "image/svg+xml", "image/jpeg", "image/jpg", "image/*"]}
                        filesLimit={1}
                        showPreviews={false}
                        showPreviewsInDropzone={true}
                        dropzoneText="Drag and drop a profile image (PNG, SVG, JPG, JPEG) here or click"
                      />
                    </div>
                 
                    {existingProfile && (
                      <div>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          style={{ marginTop: "16px" }}
                        >
                          Existing Profile:
                        </Typography>
                        <Typography style={{ marginLeft: "16px" }}>
                          {existingProfile.split("/").pop()}
                        </Typography>
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <div style={{marginTop: '16px'}}>
                      <DropzoneArea
                        onChange={handleVideoChange}
                        acceptedFiles={["video/*"]}
                        filesLimit={1}
                        maxFileSize={10 * 1024 * 1024} // 10MB
                        showPreviews={false}
                        showPreviewsInDropzone={true}
                        dropzoneText="Upload a Video (Max: 10MB)"
                      />
                      {errors.video && (
                        <Typography color="error" variant="caption">
                          {errors.video}
                        </Typography>
                      )}
                    </div>
                   
                    {existingVideo && (
                      <div>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          style={{ marginTop: "16px" }}
                        >
                          Existing Video:
                        </Typography>
                        <Typography style={{ marginLeft: "16px" }}>
                          {existingVideo.split("/").pop()}
                        </Typography>
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ratings"
                      name="ratings"
                      variant="outlined"
                      required
                      type="number"
                      value={ratings}
                      onChange={(e) => handleChange(e)}
                      error={!!errors.ratings}
                      helperText={errors.ratings}
                      inputProps={{
                        step: "0.1", // Allows decimals like 4.6, 3.2
                        min: "0", // Optional: If you want to restrict negative values
                        max: "5", // Ensures the maximum rating is 5
                      }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ 
                    mt: 3,
                    backgroundColor: "#4CAF50",
                    color: "white",
                    fontWeight: "bold",
                    padding: "12px",
                    "&:hover": {
                      backgroundColor: "#45a049",
                    }, 
                  }}
                >
                  Update Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      }
    />
  );
};

export default ReviewsEditForm;