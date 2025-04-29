import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchJobPositionById, 
  updateJobPosition 
} from "../../redux/slices/joinus/joinus";
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Container, 
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Tooltip
} from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

const EditJobPage = () => {
  const { id } = useParams(); // Get Job ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const job = useSelector((state) => state.joinUs.selectedJob); // Get job data
  const [formData, setFormData] = useState({ job_position: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!cookies.token) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
      
      dispatch(fetchJobPositionById(id))
        .unwrap()
        .then((data) => {
          setFormData({
            job_position: data.job_position || "",
            description: data.description || "",
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [dispatch, id, cookies.token, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle form submission (Update Job Position)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.job_position) newErrors.job_position = "Job position is required";
    if (!formData.description) newErrors.description = "Description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      await dispatch(updateJobPosition({ id, jobData: formData })).unwrap();
      setSnackbarOpen(true);
      setTimeout(() => navigate("/Joinus-control"), 1500);
    } catch (error) {
      alert("Error: " + (error?.message || "Something went wrong"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
  }

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={0}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mt={2} mb={2}>
              <Button variant="outlined" color="primary" onClick={handleBack}>
                Back
              </Button>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', flex: 1 }}>
                <Typography variant="h4" sx={{ 
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
                }}>
                  Edit Job Position
                </Typography>
                <Tooltip title="Edit this job position's title and description" arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>
            <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
              <TextField
                label="Job Position"
                name="job_position"
                value={formData.job_position}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.job_position)}
                helperText={errors.job_position}
                required
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                error={Boolean(errors.description)}
                helperText={errors.description}
                required
              />
              <Button
                type="submit"
                variant="contained"
                disabled={submitLoading}
                sx={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  mt: 3,
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                }}
              >
                {submitLoading ? "Updating..." : "Update Job Position"}
              </Button>
            </form>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert onClose={() => setSnackbarOpen(false)} variant="filled" severity="success" sx={{ width: "100%" }}>
                Job position successfully updated!
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

export default EditJobPage;