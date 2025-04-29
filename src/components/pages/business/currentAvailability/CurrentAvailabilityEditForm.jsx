import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Snackbar, Alert, Typography, Tooltip, Box, Container, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { getCurrentAvailabilityById, updateCurrentAvailability } from "../../../redux/slices/business/currentAvailability/currentAvailability";
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
    // submit: {
    //     margin: theme.spacing(3, 0, 2),
    //     backgroundColor: theme.palette.success.main,
    //     color: theme.palette.success.contrastText,
    // },
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
                setTimeout(() => navigate("/business/current-availability-control"), 1500);
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
    const handleBack = () => {
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
                      Current Availability Edit Form
                      </Typography>
                      <Tooltip title="This is where you can Edit the Current Availability." arrow>
                        <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                      </Tooltip>
                    </Box>
                  </Box>
                    <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
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
                                          <Grid item xs={12} sx={{ mt: 2, textAlign: "center" }}>

                        <Button  type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: "#ff6d00",
                        color: "#fff",
                        padding: "8px 24px",
                        textTransform: "uppercase",
                        borderRadius: "4px",
                        mt: 2,
                        "&:hover": {
                          backgroundColor: "#e65100",
                        },
                      }}>
                            Update
                        </Button>
                    </Grid>
                    </form>
                    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Paper>
                </Container>
            }
        />
    );
};

export default CurrentAvailabilityEditForm;