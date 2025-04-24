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
  Tooltip,
  Box,
  useTheme,
  Container,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { updateVisionMission } from "../../../redux/slices/aboutpage/visionMission/visionMission";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import { useCookies } from "react-cookie";
import { HelpOutline } from "@mui/icons-material";

const VisionMissionEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const visionMissions = useSelector(
    (state) => state.visionMission.visionMissions
  );
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

    dispatch(
      updateVisionMission({
        id,
        formData: formDataToSend,
        token: cookies.token,
      })
    )
      .unwrap()
      .then(() => {
        setMessage({ text: "Updated successfully", type: "success" });
        setOpenSnackbar(true);
        setTimeout(() => navigate("/about/vision-mission-control"), 2000);
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

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={0}>
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
                  Vision / Mission Edit Form
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
              autoHideDuration={3000}
              onClose={() => setOpenSnackbar(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}

            >
              <Alert variant="filled" severity={message.type}>{message.text}</Alert>
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
          </Paper>
        </Container>
      }
    />
  );
};

export default VisionMissionEditForm;
