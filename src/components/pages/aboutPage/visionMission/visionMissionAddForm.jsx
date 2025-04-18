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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("type", formData.type);
    data.append("description", formData.description);

    dispatch(createVisionMission({ token: cookies.token, formData: data }))
      .unwrap()
      .then(() => {
        alert("Successfully added!");
        navigate("/about/vision-mission-control");
      })
      .catch((error) => {
        alert("Error: " + (error?.message || "Something went wrong"));
      })
      .finally(() => setLoading(false));
  };

  return (
    <LeftNavigationBar
      Content={
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={2}
            mb={1}
          >
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: "Merriweather, serif",
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
              Vision / Mission
              <br /> Add Form
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
          <Card elevation={0} sx={{ maxWidth: 800, margin: "auto" }}>
            <CardContent>
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
                >
                  Add Content
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      }
    />
  );
};

export default VisionMissionAddForm;
