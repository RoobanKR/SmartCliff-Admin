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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Tooltip
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
// import { clearMessages, createHowItWorks } from "../../../redux/features/business/howItWorks/howItWorksSlice"; // Adjust the import path as necessary
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { createHowItWorks, clearMessages } from "../../../redux/slices/business/howItWorks/howItWorks";
import { HelpOutline } from "@mui/icons-material";

const HowItWorksAddForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cookies] = useCookies(["token"]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const { error, successMessage } = useSelector((state) => state.howItWorks);

    useEffect(() => {
        if (!cookies.token) {
            navigate("/");
        }

        // Clear any previous messages when component mounts
        dispatch(clearMessages());
    }, [cookies, navigate, dispatch]);

    const handleImageChange = (files) => {
        setImage(files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate fields
        const newErrors = {};
        if (!title) newErrors.title = "Title is required";
        if (!description) newErrors.description = "Description is required";
        if (!type) newErrors.type = "Type is required";
        if (!image) newErrors.image = "Image is required";

        if (Object.keys(newErrors).length > 0) {
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("type", type);
        formData.append("image", image);

        try {
            await dispatch(createHowItWorks(formData)).unwrap();
            // Success handling is done in the useEffect that watches for successMessage
            setSnackbarMessage("How its work created successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate("/business/how-it-works-control");
            }, 2000);
        } catch (err) {
            console.error("Failed to create How It Works item:", err);
            setSnackbarMessage("Failed to create How It Works item. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const    handleBack = () => {
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
                <Typography variant="h4" sx={{ position: "relative", padding: 0, margin: 0, fontWeight: 300, fontSize: { xs: "32px", sm: "40px" }, color: "#747474", textAlign: "center", textTransform: "uppercase", paddingBottom: "5px", "&::before": { content: '""', width: "28px", height: "5px", display: "block", position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, "&::after ": { content: '""', width: "100px", height: "1px", display: "block", position: "relative", marginTop: "5px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, }}>
                Add How It Works
                </Typography>
                <Tooltip title="This is where you can add the How It Works." arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>            
            <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={4}
                            />
                            <FormControl
                                fullWidth
                                margin="normal"
                                required
                            >
                                <InputLabel id="type-label">Type</InputLabel>
                                <Select
                                    labelId="type-label"
                                    value={type}
                                    label="Type"
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <MenuItem value="hirefromus">Hire From Us</MenuItem>
                                    <MenuItem value="trainfromus">Train From Us</MenuItem>
                                    <MenuItem value="institute">Institute</MenuItem>
                                </Select>
                            </FormControl>
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Image *
                                </Typography>
                                <DropzoneArea
                                    onChange={handleImageChange}
                                    acceptedFiles={["image/*"]}
                                    filesLimit={1}
                                    dropzoneText="Drag and drop image here or click"
                                    maxFileSize={5000000} // 5MB in bytes
                                />
                                {image === null && (
                                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                        Image is required
                                    </Typography>
                                )}
                            </Box>
                            <Button
                                type="submit"
                                variant="contained"
                                style={{color: "white", marginTop: "20px" }}
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </Button>
                        </form>
                        <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <Alert
                            onClose={handleSnackbarClose}
                            severity={snackbarSeverity}
                            sx={{ width: "100%" }}
                            variant="filled"
                        >
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                    </Paper>
                </Container>
            }
        />
    );
};

export default HowItWorksAddForm;