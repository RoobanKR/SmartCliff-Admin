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
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { clearError, createWCU } from "../../../redux/slices/home/wcu/WhyCU"; // Adjust the import path as necessary
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

const WCUAddForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cookies] = useCookies(["token"]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const { error, isSuccess } = useSelector((state) => state.wcu);

    useEffect(() => {
        if (!cookies.token) {
            navigate("/");
        }
    }, [cookies, navigate]);

    const handleIconChange = (files) => {
        setIcon(files[0]); // Assuming only one icon is uploaded
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        // Validate fields
        const newErrors = {};
        if (!title) newErrors.title = "Title is required";
        if (!description) newErrors.description = "Description is required";
        if (!icon) newErrors.icon = "Icon is required";

        if (Object.keys(newErrors).length > 0) {
            setLoading(false); // Stop loading
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("icon", icon);

        try {
            await dispatch(createWCU(formData)).unwrap();
            setSnackbarMessage("WCU created successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate("/home/wcu-control"); // Redirect to the WCU list or desired page
            }, 2000);
        } catch (err) {
            console.error("Failed to create WCU:", err);
            setSnackbarMessage("Failed to create WCU. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <LeftNavigationBar
            Content={
                <Container component="main" maxWidth="md">
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
                    <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                position: "relative",
                                padding: 0,
                                margin: 0,
                                fontFamily: 'Merriweather, serif',
                                fontWeight: 700,
                                textAlign: 'center',
                                fontSize: { xs: "32px", sm: "40px" },
                                color: "#747474",
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
                            Add Why Choose Us
                        </Typography>
                        <form onSubmit={handleSubmit}>
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
                                
                            />
                            <DropzoneArea
                                onChange={handleIconChange}
                                acceptedFiles={["image/*"]}
                                filesLimit={1}
                                dropzoneText="Drag and drop icon here or click"
                            />
                            {icon === null && (
                                <Typography variant="body2" color="error">
                                    Icon is required
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                style={{ backgroundColor: "#4CAF50", color: "white",marginTop:"20px" }}
                                fullWidth
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? "Submitting..." : "Submit"} {/* Show loading text */}
                            </Button>
                        </form>
                    </Paper>
                </Container>
            }
        />
    );
};

export default WCUAddForm;