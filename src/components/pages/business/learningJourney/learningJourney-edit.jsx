import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { Typography, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchLearningJourneyById, updateLearningJourney } from "../../../redux/slices/business/learningJourney/learningJourney";

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
    imagePreview: {
        maxWidth: "100%",
        maxHeight: 200,
        margin: theme.spacing(2, 0),
    },
}));

const LearningJourneyEditForm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    console.log("Learning Journey ID:", id); // Debug log
    
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [loading, setLoading] = useState(true);

    // Fetch the existing learning journey data
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    setSnackbarMessage("No learning journey ID provided.");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                    setLoading(false);
                    return;
                }
                
                const response = await dispatch(fetchLearningJourneyById(id)).unwrap();
                if (response) {
                    setType(response.type || "");
                    setTitle(response.title || "");
                    setDescription(response.description || "");
                    setExistingImage(response.image || "");
                } else {
                    setSnackbarMessage("Learning journey data not found.");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching learning journey:", error);
                setSnackbarMessage("Failed to load learning journey data. Please try again.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                setLoading(false);
            }
        };
        
        fetchData();
    }, [id, dispatch]);
    
    const handleImageChange = (files) => {
        if (files.length > 0) {
            setImage(files[0]);
            setExistingImage(""); // Clear existing image preview if new image is selected
        } else {
            setImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!id) {
            setSnackbarMessage("Cannot update learning journey: ID is missing.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append("type", type);
        formData.append("title", title);
        formData.append("description", description);
        if (image) {
            formData.append("image", image);
        }

        try {
            await dispatch(updateLearningJourney({ id, formData })).unwrap();
            setSnackbarMessage("Learning Journey updated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            // Optional: navigate back after successful update
            setTimeout(() => navigate(-1), 1000);
        } catch (error) {
            console.error("Error updating learning journey:", error);
            setSnackbarMessage("Failed to update Learning Journey. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return <div>Loading...</div>;
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
                fontWeight: 700, textAlign: 'center',
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
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
                        Edit Learning Journey
                    </Typography>
                    <br />
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal" variant="outlined" required>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                label="Type"
                            >
                                <MenuItem value="hirefromus">Hire From Us</MenuItem>
                                <MenuItem value="trainfromus">Train From Us</MenuItem>
                                <MenuItem value="institute">Institute</MenuItem>
                            </Select>
                        </FormControl>
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
                        
                        {existingImage && !image && (
                            <div>
                                <Typography variant="subtitle1">Current Image:</Typography>
                                <img 
                                    src={existingImage} 
                                    alt="Current Learning Journey" 
                                    className={classes.imagePreview}
                                    style={{ width: "20%", height: "auto" }}
                                />
                            </div>
                        )}
                        
                        <DropzoneArea
                            onChange={handleImageChange}
                            acceptedFiles={["image/*"]}
                            filesLimit={1}
                            showPreviews={false}
                            showPreviewsInDropzone={true}
                            dropzoneText="Drag and drop a new image here or click to replace the current image"
                        />
                        
                        <Button 
                            type="submit" 
                            variant="contained" 
                            className={classes.submit} 
                            fullWidth
                        >
                            Update Learning Journey
                        </Button>
                    </form>
                    <Snackbar 
                        open={snackbarOpen} 
                        autoHideDuration={6000} 
                        onClose={handleSnackbarClose} 
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Paper>
            }
        />
    );
};

export default LearningJourneyEditForm;