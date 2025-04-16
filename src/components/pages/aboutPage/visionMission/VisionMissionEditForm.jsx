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
import { updateVisionMission } from "../../../redux/slices/aboutpage/visionMission/visionMission";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import { useCookies } from "react-cookie";

const VisionMissionEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const visionMissions = useSelector((state) => state.visionMission.visionMissions);
  const [formData, setFormData] = useState({
    type: "vision",
    description: "",
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
    if (id) {
      const existingData = visionMissions.find((item) => item._id === id);
      if (existingData) {
        setFormData({
          type: existingData.type || "vision",
          description: existingData.description || "",
        });
      } else {
        setMessage({ text: "Failed to fetch data", type: "error" });
        setOpenSnackbar(true);
      }
    }
  }, [id, visionMissions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("type", formData.type);
    formDataToSend.append("description", formData.description);


    dispatch(updateVisionMission({ id, formData: formDataToSend, token: cookies.token }))
      .unwrap()
      .then(() => {
        setMessage({ text: "Updated successfully", type: "success" });
        setOpenSnackbar(true);
        setTimeout(() => navigate("/about/vision-mission-control"), 2000);
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
              Edit Vision / Mission
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="vision">Vision</MenuItem>
                    <MenuItem value="mission">Mission</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                  />
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

export default VisionMissionEditForm;