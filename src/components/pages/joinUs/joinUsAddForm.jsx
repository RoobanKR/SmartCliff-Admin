import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Tooltip,
  Container,
  Paper,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";
import { createJobPosition } from "../../redux/slices/joinus/joinus";
import { useCookies } from "react-cookie";
import { HelpOutline } from "@mui/icons-material";

const JobPositionAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [formData, setFormData] = useState({
    job_position: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errors, setErrors] = useState({});

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
    
    // Clear validation errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

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
    
    setLoading(true);
    
    try {
      // Send only the form data directly, not nested within jobData
      await dispatch(createJobPosition(formData)).unwrap();
      setSnackbarOpen(true);
      setTimeout(() => navigate("/joinus-control"), 1500);
    } catch (error) {
      alert("Error: " + (error?.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

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
                  Job Position Add Form
                </Typography>
                <Tooltip title="Add a new job position with title and description" arrow>
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
                disabled={loading}
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
                {loading ? "Submitting..." : "Submit Job Position"}
              </Button>
            </form>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert onClose={() => setSnackbarOpen(false)} variant="filled" severity="success" sx={{ width: "100%" }}>
                Job position successfully added!
              </Alert>
            </Snackbar>
          </Paper>
        </Container>
      }
    />
  );
};

export default JobPositionAddForm;