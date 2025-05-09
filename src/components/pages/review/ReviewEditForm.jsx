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
  Tooltip,
  Box,
  useTheme,
  IconButton,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../redux/slices/services/services/Services";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { getAllBussinessServices } from "../../redux/slices/services/bussinessServices/BussinessSerives";
import {
  clearUpdateStatus,
  getReviewById,
  resetReview,
  updateReview,
} from "../../redux/slices/review/review";
import { useCookies } from "react-cookie";
import { HelpOutline, Clear as ClearIcon } from "@mui/icons-material";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
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
  mediaContainer: {
    position: "relative",
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  profileImage: {
    maxWidth: "200px",
    maxHeight: "200px",
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  video: {
    maxWidth: "100%",
    marginTop: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
}));

const ReviewsEditForm = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { reviewId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const { allReview, updateSuccess, successMessage, error, isSuccess } =
    useSelector((state) => state.reviews);


  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
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
  const [profilePreview, setProfilePreview] = useState(null);
  const [existingVideo, setExistingVideo] = useState("");
  const [videoPreview, setVideoPreview] = useState(null);

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
      dispatch(getReviewById(reviewId))
        .then((response) => {
          const data = response.payload;
          if (data) {
            setName(data.name || "");
            setDescription(data.review || "");
            setRatings(data.ratings || "");
            setBatch(data.batch || "");
            setRole(data.role || "");

            // Handle profile image URL
            if (data.profile) {
              // If profile is a relative path, prepend the base URL
              const fullProfileUrl = data.profile.startsWith("http")
                ? data.profile
                : `${process.env.REACT_APP_BASE_URL}/${data.profile}`;
              setExistingProfile(fullProfileUrl);
            }

            // Handle video URL
            if (data.video) {
              // If video is a relative path, prepend the base URL
              const fullVideoUrl = data.video.startsWith("http")
                ? data.video
                : `${process.env.REACT_APP_BASE_URL}/${data.video}`;
              setExistingVideo(fullVideoUrl);
            }
          }
        })
        .catch((error) => console.error("Error fetching Review:", error));
    }
  }, [reviewId, dispatch]);

  useEffect(() => {
    if (updateSuccess) {
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
          setErrors((prev) => ({
            ...prev,
            ratings: "Rating must be 5 or below",
          }));
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

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(fileArray[0]);
    }
  };

  const handleRemoveProfile = () => {
    setExistingProfile("");
    setProfile(null);
    setProfilePreview(null);
  };

  const handleVideoChange = (fileArray) => {
    if (fileArray.length > 0) {
      const file = fileArray[0];
      const maxSize = 40 * 1024 * 1024; // 10MB in bytes

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          video: "Video file size must be 10MB or less",
        }));
        setVideo(null);
        return;
      }

      setVideo(file);
      setErrors((prev) => ({ ...prev, video: "" }));

      // Create video preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveVideo = () => {
    setExistingVideo("");
    setVideo(null);
    setVideoPreview(null);
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
    } else if (!existingProfile) {
      // If no profile is present, send a flag to remove the existing profile
      formData.append("removeProfile", "true");
    }

    if (video) {
      formData.append("video", video);
    } else if (!existingVideo) {
      // If no video is present, send a flag to remove the existing video
      formData.append("removeVideo", "true");
    }

    try {
      await dispatch(
        updateReview({ reviewId, formData, token: cookies.token })
      ).unwrap();
      setSnackbarMessage("Review updated successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => {
        dispatch(clearUpdateStatus());
        navigate("/Review-control");
      }, 2000);
    } catch (error) {
      setSnackbarMessage("Error updating review");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error("Error updating review:", error);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                flex: 1,
              }}
            >
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
                Testimonial Edit Form
              </Typography>
              <Tooltip
                title="This is where you can add the execution count for the service."
                arrow
              >
                <HelpOutline
                  sx={{
                    color: "#747474",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={2000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert severity="success" variant="filled">
              {successMessage || "Review Updated successfully"}
            </Alert>
          </Snackbar>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} variant="filled">
              {error}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              border: "2px dotted #D3D3D3",
              padding: "20px",
              marginTop: "20px",
              borderRadius: "8px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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

              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Review"
                  name="review"
                  variant="outlined"
                  required
                  multiline
                  rows={4}
                  value={review}
                  onChange={(e) => handleChange(e)}
                  error={!!errors.review}
                  helperText={errors.review}
                />
              </Grid>
              <Grid item xs={12}>
                {/* Profile Image Preview Section */}
                {(existingProfile || profilePreview) && (
                  <div className={classes.mediaContainer}>
                    <Typography variant="subtitle1">Current Profile Image:</Typography>
                    <img
                      src={profilePreview || existingProfile}
                      alt="Profile"
                      className={classes.profileImage}
                    />
                    <IconButton
                      className={classes.removeButton}
                      onClick={handleRemoveProfile}
                      color="secondary"
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                )}

                <div style={{ marginTop: "16px" }}>
                  <DropzoneArea
                    onChange={handleImageChange}
                    acceptedFiles={[
                      "image/png",
                      "image/svg+xml",
                      "image/jpeg",
                      "image/jpg",
                      "image/*",
                    ]}
                    filesLimit={1}
                    showPreviews={false}
                    showPreviewsInDropzone={true}
                    dropzoneText="Drag and drop a profile image (PNG, SVG, JPG, JPEG) here or click"
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                {/* Video Preview Section */}
                {(existingVideo || videoPreview) && (
                  <div className={classes.mediaContainer}>
                    <Typography variant="subtitle1">Current Video:</Typography>
                    <video
                      controls
                      className={classes.video}
                      src={videoPreview || existingVideo}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <IconButton
                      className={classes.removeButton}
                      onClick={handleRemoveVideo}
                      color="secondary"
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                )}

                <div style={{ marginTop: "16px" }}>
                  <DropzoneArea
                    onChange={handleVideoChange}
                    acceptedFiles={["video/*"]}
                    filesLimit={1}
                    maxFileSize={40 * 1024 * 1024} // 10MB
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
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="warning"
                type="submit"
                className={classes.submit}
              >
                Update Testimonial Data
              </Button>
            </Box>
          </form>
        </Container>
      }
    />
  );
};

export default ReviewsEditForm;