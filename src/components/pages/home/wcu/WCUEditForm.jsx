import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { Typography, Snackbar, Alert, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import { updateWCU, getWCUById } from "../../../redux/slices/home/wcu/WhyCU"; // Adjust the import path as necessary
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useParams, useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    paper: {
        maxWidth: 600,
        margin: "auto",
        padding: theme.spacing(3),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    logoContainer: {
        position: 'relative',
        marginBottom: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logoImage: {
        maxWidth: '200px',
        maxHeight: '200px',
        marginTop: theme.spacing(2),
        borderRadius: theme.spacing(1),
    },
    removeLogoButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
}));

const WCUEditForm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    // State for form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState(null);
    const [existingIconUrl, setExistingIconUrl] = useState("");
    const [iconPreview, setIconPreview] = useState(null);

    // Snackbar states
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Get the selected WCU from Redux store
    const selectedWCU = useSelector((state) => state.wcu.selectedWCU);
    const loading = useSelector((state) => state.wcu.loading);

    // Fetch WCU details when component mounts
    useEffect(() => {
        dispatch(getWCUById(id));
    }, [dispatch, id]);

    // Populate form when WCU data is loaded
    useEffect(() => {
        if (selectedWCU) {
            setTitle(selectedWCU.title || "");
            setDescription(selectedWCU.description || "");

            // Handle icon URL - ensure it's a full URL or handle relative paths
            const iconUrl = selectedWCU.iconUrl || selectedWCU.icon;
            if (iconUrl) {
                const fullIconUrl = iconUrl.startsWith('http')
                    ? iconUrl
                    : `${process.env.REACT_APP_BASE_URL}/${iconUrl}`;
                setExistingIconUrl(fullIconUrl);
            }
        }
    }, [selectedWCU]);

    const handleIconChange = (files) => {
        if (files[0]) {
            setIcon(files[0]);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreview(reader.result);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleRemoveIcon = () => {
        setExistingIconUrl("");
        setIcon(null);
        setIconPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);

        // Handle icon upload or removal
        if (icon) {
            formData.append("icon", icon);
        } else if (!existingIconUrl) {
            // If no icon is present, send a flag to remove the existing icon
            formData.append("removeIcon", "true");
        }

        try {
            await dispatch(updateWCU({ id, wcuData: formData })).unwrap();
            setSnackbarMessage("WCU updated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            // Optional: Navigate back to list or detail view after successful update
            setTimeout(() => {
                navigate("/home/wcu-control"); // Adjust the route as needed
            }, 1500);
        } catch (error) {
            console.error("Error updating WCU:", error);
            setSnackbarMessage(error.message || "Failed to update WCU. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Prevent rendering until WCU data is loaded
    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <LeftNavigationBar
            Content={
                <Paper className={classes.paper} elevation={3}>
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
                        Edit Why Choose Us
                    </Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="title"
                            label="Title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="description"
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {/* Icon Preview Section */}
                        {(existingIconUrl || iconPreview) && (
                            <div className={classes.logoContainer}>
                                <Typography variant="subtitle1">Current Icon:</Typography>
                                <img
                                    src={iconPreview || existingIconUrl}
                                    alt="WCU Icon"
                                    className={classes.logoImage}
                                />
                                <IconButton
                                    className={classes.removeLogoButton}
                                    onClick={handleRemoveIcon}
                                    color="secondary"
                                >
                                    <ClearIcon />
                                </IconButton>
                            </div>
                        )}

                        <DropzoneArea
                            onChange={handleIconChange}
                            acceptedFiles={["image/*"]}
                            filesLimit={1}
                            showPreviews={false}
                            showPreviewsInDropzone={true}
                            dropzoneText="Drag and drop a new icon image here or click (Optional)"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            className={classes.submit}
                            fullWidth
                        >
                            Update WCU
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
            }
        />
    );
};

export default WCUEditForm;