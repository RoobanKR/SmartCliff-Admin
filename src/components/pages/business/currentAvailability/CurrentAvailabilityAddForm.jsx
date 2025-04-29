import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Snackbar, Alert, Typography, Tooltip, Box, Container } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { createCurrentAvailability } from "../../../redux/slices/business/currentAvailability/currentAvailability";
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

const CurrentAvailabilityAddForm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [skillset, setSkillset] = useState("");
    const [resources, setResources] = useState("");
    const [duration, setDuration] = useState("");
    const [batch, setBatch] = useState("");
    const [experience, setExperience] = useState("");
    const [remarks, setRemarks] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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

        try {
            await dispatch(createCurrentAvailability(formData));
            setSnackbarMessage("Current availability created successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setTimeout(() => navigate("/business/current-availability-control"), 1500);
        } catch (error) {
            console.error("Error submitting form:", error);
            setSnackbarMessage("Failed to create current availability. Please try again.");
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
                      Current Availability Add Form
                      </Typography>
                      <Tooltip title="This is where you can add the execution count for the service." arrow>
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
                        <Button type="submit" variant="contained" className={classes.submit} fullWidth>
                            Submit
                        </Button>
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

export default CurrentAvailabilityAddForm;