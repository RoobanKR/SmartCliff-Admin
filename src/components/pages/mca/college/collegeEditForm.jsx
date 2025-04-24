import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { Typography, Snackbar, Alert, IconButton, Container, Tooltip, Box } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import { updateCollege, getCollegeById } from "../../../redux/slices/mca/college/college";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useParams, useNavigate } from "react-router-dom";
import { HelpOutline } from "@material-ui/icons";

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

const CollegeEditForm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    // State for form fields
    const [slug, setSlug] = useState("");
    const [collegeName, setCollegeName] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [logo, setLogo] = useState(null);
    const [existingLogoUrl, setExistingLogoUrl] = useState("");
    const [logoPreview, setLogoPreview] = useState(null);

    // Snackbar states
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    // Get the selected college from Redux store
    const selectedCollege = useSelector((state) => state.college.selectedCollege);
    const loading = useSelector((state) => state.college.loading);

    // Fetch college details when component mounts
    useEffect(() => {
        dispatch(getCollegeById(id));
    }, [dispatch, id]);

    // Populate form when college data is loaded
    useEffect(() => {
        if (selectedCollege) {
            setSlug(selectedCollege.slug || "");
            setCollegeName(selectedCollege.collegeName || "");
            setDescription(selectedCollege.description || "");
            setWebsite(selectedCollege.website || "");

            // Handle logo URL - ensure it's a full URL or handle relative paths
            const logoUrl = selectedCollege.logoUrl || selectedCollege.logo;
            if (logoUrl) {
                // If logoUrl is a relative path, prepend the base URL
                const fullLogoUrl = logoUrl.startsWith('http')
                    ? logoUrl
                    : `${process.env.REACT_APP_BASE_URL}/${logoUrl}`;
                setExistingLogoUrl(fullLogoUrl);
            }
        }
    }, [selectedCollege]);

    const handleLogoChange = (files) => {
        if (files[0]) {
            setLogo(files[0]);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleRemoveLogo = () => {
        setExistingLogoUrl("");
        setLogo(null);
        setLogoPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("slug", slug);
        formData.append("collegeName", collegeName);
        formData.append("description", description);
        formData.append("website", website);

        // Handle logo upload or removal
        if (logo) {
            formData.append("logo", logo);
        } else if (!existingLogoUrl) {
            // If no logo is present, send a flag to remove the existing logo
            formData.append("removeLogo", "true");
        }

        try {
            await dispatch(updateCollege({ id, formData })).unwrap();
            setSnackbarMessage("College updated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            // Optional: Navigate back to list or detail view after successful update
            setTimeout(() => {
                navigate("/college-control"); // Adjust the route as needed
            }, 1500);
        } catch (error) {
            console.error("Error updating college:", error);
            setSnackbarMessage(error.message || "Failed to update college. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };  // Extract unique job positions for dropdown filter


    // Prevent rendering until college data is loaded
    if (loading) {
        return <Typography>Loading...</Typography>;
    }

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
                            mb={1}
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
                                    College Edit Form
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
                            style={{
                                border: "2px dotted #D3D3D3",
                                padding: "20px",
                                borderRadius: "8px",
                            }}
                            onSubmit={handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="slug"
                                label="Slug"
                                name="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="collegeName"
                                label="College Name"
                                name="collegeName"
                                value={collegeName}
                                onChange={(e) => setCollegeName(e.target.value)}
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
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="website"
                                label="Website"
                                name="website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                            />

                            {/* Logo Preview Section */}
                            {(existingLogoUrl || logoPreview) && (
                                <div className={classes.logoContainer}>
                                    <Typography variant="subtitle1">Current Logo:</Typography>
                                    <img
                                        src={logoPreview || existingLogoUrl}
                                        alt="College Logo"
                                        className={classes.logoImage}
                                    />
                                    <IconButton
                                        className={classes.removeLogoButton}
                                        onClick={handleRemoveLogo}
                                        color="secondary"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </div>
                            )}

                            <DropzoneArea
                                onChange={handleLogoChange}
                                acceptedFiles={["image/*"]}
                                filesLimit={1}
                                showPreviews={false}
                                showPreviewsInDropzone={true}
                                dropzoneText="Drag and drop a new logo image here or click (Optional)"
                            />

                            <Button
                                type="submit"
                                variant="contained"


                                style={{
                                    display: "block",
                                    margin: "24px auto 0", // centers the button horizontally
                                    backgroundColor: " #ff6d00", // green
                                    color: "#fff",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    textTransform: "uppercase",
                                    cursor: "pointer",
                                }}
                            >
                                Update College
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

export default CollegeEditForm;