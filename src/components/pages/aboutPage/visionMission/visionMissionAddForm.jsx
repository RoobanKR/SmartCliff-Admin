import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Box,
  Tooltip,
  useTheme,
  Container,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { createVisionMission } from "../../../redux/slices/aboutpage/visionMission/visionMission";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import { useCookies } from "react-cookie";
import { HelpOutline } from "@mui/icons-material";

const VisionMissionAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "vision",
    description: "",
    preview: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success", // "success" | "error"
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["token"]);
  const theme = useTheme();

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
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("type", formData.type);
    data.append("description", formData.description);

    dispatch(createVisionMission({ token: cookies.token, formData: data }))
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          severity: "success",
          message: "Successfully added!",
        });

        setTimeout(() => {
          navigate("/about/vision-mission-control");
        }, 2000);
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          severity: "error",
          message: error?.message || "Something went wrong",
        });
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
                  Vision / Mission Add Form
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
                borderRadius: "8px",
              }}
            >
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
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
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
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Content"}
              </Button>

              <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert onClose={handleSnackbarClose} variant="filled" severity={snackbar.severity} sx={{ width: '100%' }}>
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default VisionMissionAddForm;