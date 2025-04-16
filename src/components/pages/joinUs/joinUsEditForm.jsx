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
  CircularProgress 
} from "@mui/material";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useCookies } from "react-cookie";

const EditJobPage = () => {
  const { id } = useParams(); // Get Job ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const cookies = useCookies(["token"]);

  const job = useSelector((state) => state.joinUs.selectedJob); // Get job data
  const [formData, setFormData] = useState({ job_position: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [dispatch, id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (Update Job Position)
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateJobPosition({ id, jobData: formData, token: cookies.token }));
    navigate("/Joinus-control"); // Redirect to job list after update
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
  }

  return (
        <LeftNavigationBar
          Content={
    
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 5 }}>
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
          Edit Job Position
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Job Position"
            name="job_position"
            fullWidth
            margin="normal"
            value={formData.job_position}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Update Job
          </Button>
          <Button onClick={() => navigate("/Joinus-control")} sx={{ mt: 2, ml: 2 }}>
            Cancel
          </Button>
        </form>
      </Paper>
    </Container>
      }
      />
  );
};

export default EditJobPage;
