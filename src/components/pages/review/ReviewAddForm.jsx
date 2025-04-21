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
  Tooltip,
  useTheme,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  clearUpdateStatus,
  createReview,
  resetReview,
} from "../../redux/slices/review/review";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { HelpOutline } from "@mui/icons-material";
import { makeStyles } from "@material-ui/core/styles";

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

const ReviewAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const classes = useStyles();
  const theme = useTheme();

  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [ratings, setRatings] = useState("");
  const [profile, setProfile] = useState(null);
  const [batch, setBatch] = useState("");
  const [role, setRole] = useState("");
  const [video, setVideo] = useState(null);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { loading, error, isSuccess } = useSelector(
    (state) => state.reviews.reviews
  );

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
          setErrors((prev) => ({
            ...prev,
            ratings: "Rating must be a number with up to 2 decimal places",
          }));
        } else if (parseFloat(value) > 5) {
          setErrors((prev) => ({
            ...prev,
            ratings: "Rating must be 5 or below",
          }));
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
        setErrors((prev) => ({
          ...prev,
          video: "Video file size must be 10MB or less",
        }));
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
      const result = await dispatch(
        createReview({ token: cookies.token, formData })
      ).unwrap();
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
          >
            <Alert severity="success">Review created successfully</Alert>
          </Snackbar>

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
                Testimonial Add Form
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
                  value={name}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Ratings"
                  name="ratings"
                  type="number"
                  value={ratings}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Batch"
                  name="batch"
                  value={batch}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Role"
                  name="role"
                  value={role}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Review"
                  name="review"
                  value={review}
                  multiline
                  rows={4}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
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
                  Submit Testimonial Data
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      }
    />
  );
};

export default ReviewAddForm;
