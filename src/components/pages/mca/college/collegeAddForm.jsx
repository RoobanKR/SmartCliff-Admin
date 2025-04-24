import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { Typography, Snackbar, Alert, Box, Tooltip, Container, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { createCollege } from "../../../redux/slices/mca/college/college";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useNavigate } from "react-router-dom";
import { HelpOutline } from "@mui/icons-material";

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
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
    },
}));

const CollegeAddForm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [slug, setSlug] = useState("");
    const [collegeName, setCollegeName] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();

    const [logo, setLogo] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const handleLogoChange = (files) => {
        setLogo(files[0]); // Assuming only one file is uploaded
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("slug", slug);
        formData.append("collegeName", collegeName);
        formData.append("description", description);
        formData.append("website", website);
        if (logo) {
            formData.append("logo", logo);
        }

        try {
            await dispatch(createCollege(formData));
            setSnackbarMessage("College added successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate("/college-control");
            }, 1500); // delay to let snackbar show
        } catch (error) {
            console.error("Error submitting form:", error);
            setSnackbarMessage("Failed to add college. Please try again.");
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
                                    College Add Form
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
                                margin="none"
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
                            <DropzoneArea
                                onChange={handleLogoChange}
                                acceptedFiles={["image/*"]}
                                filesLimit={1}
                                showPreviews={false}
                                showPreviewsInDropzone={true}
                                dropzoneText="Drag and drop a logo image here or click"
                            />
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

                            >
                                Submit College
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
                </Container >
            }
        />
    );
};

export default CollegeAddForm;
