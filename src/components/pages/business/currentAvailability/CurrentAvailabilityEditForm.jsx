import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Snackbar, Alert, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { getCurrentAvailabilityById, updateCurrentAvailability } from "../../../redux/slices/business/currentAvailability/currentAvailability";

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

const CurrentAvailabilityEditForm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ID from the URL
    const [skillset, setSkillset] = useState("");
    const [resources, setResources] = useState("");
    const [duration, setDuration] = useState("");
    const [batch, setBatch] = useState("");
    const [experience, setExperience] = useState("");
    const [remarks, setRemarks] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resultAction = await dispatch(getCurrentAvailabilityById(id));
                if (getCurrentAvailabilityById.fulfilled.match(resultAction)) {
                    const availability = resultAction.payload; // Assuming the payload contains the availability data
                    setSkillset(availability.skillset);
                    setResources(availability.resources);
                    setDuration(availability.duration);
                    setBatch(availability.batch);
                    setExperience(availability.experience);
                    setRemarks(availability.remarks);
                }
            } catch (error) {
                console.error("Error fetching current availability:", error);
                setSnackbarMessage("Failed to fetch current availability. Please try again.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        };

        fetchData();
    }, [dispatch, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = {
            skillset,
            resources,
            duration,
            batch,
            experience,
            remarks,
        };
    
        console.log("Submitting form data:", formData); // Log the data being submitted
    
        try {
            const resultAction = await dispatch(updateCurrentAvailability({ id, formData }));
            console.log("Update result:", resultAction); 
            if (updateCurrentAvailability.fulfilled.match(resultAction)) {
                setSnackbarMessage("Current availability updated successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                navigate("/business/current-availability-control");
            }
        } catch (error) {
            console.error("Error updating form:", error);
            setSnackbarMessage("Failed to update current availability. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

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
                        Edit Current Availability
                    </Typography>
                    <br />
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="skillset"
                            label="Skillset"
                            name="skillset"
                            value={skillset}
                            onChange={(e) => setSkillset(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="resources"
                            label="Resources"
                            name="resources"
                            value={resources}
                            onChange={(e) => setResources(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="duration"
                            label="Duration"
                            name="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="batch"
                            label="Batch"
                            name="batch"
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="experience"
                            label="Experience"
                            name="experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="remarks"
                            label="Remarks"
                            name="remarks"
                            multiline
                            rows={4}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                        <Button type="submit" variant="contained" className={classes.submit} fullWidth>
                            Update
                        </Button>
                    </form>
                    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Paper>
            }
        />
    );
};

export default CurrentAvailabilityEditForm;