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
    Tooltip,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { clearError, createWCU } from "../../../redux/slices/home/wcu/WhyCU"; // Adjust the import path as necessary
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { HelpOutline } from "@material-ui/icons";

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

    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };  // Extract unique job positions for dropdown filter


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
                    <Paper elevation={0} >
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
                                    Why Choose Us Add Form
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
                        <form style={{
                            border: "2px dotted #D3D3D3",
                            padding: "20px",
                            borderRadius: "8px",
                        }}
                            onSubmit={handleSubmit}>
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
                                style={{
                                    display: "block",
                                    margin: "24px auto 0", // centers the button horizontally
                                    backgroundColor: " #1976d2", // green
                                    color: "#fff",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    textTransform: "uppercase",
                                    cursor: "pointer",
                                }}
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? "Submitting..." : "Submit WCH"} {/* Show loading text */}
                            </Button>
                        </form>
                    </Paper>
                </Container>
            }
        />
    );
};

export default WCUAddForm;