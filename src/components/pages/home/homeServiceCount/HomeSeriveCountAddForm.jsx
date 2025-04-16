import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Snackbar, Alert, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { createHomeServiceCount } from "../../../redux/slices/home/homeServiceCount/homeServiceCount";

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

const HomeServiceCountAddForm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [count, setCount] = useState("");
    const [service, setService] = useState("");
    const [slug, setSlug] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validation
        if (!count || !service || !slug) {
            setSnackbarSeverity("error");
            setSnackbarMessage("All fields are required");
            setSnackbarOpen(true);
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('count', count);
            formData.append('service', service);
            formData.append('slug', slug);
    
            // Dispatch the createHomeServiceCount action
            const response = await dispatch(createHomeServiceCount(formData)).unwrap();
            
            // Ensure the message is a string
            let successMessage = 'Home service count created successfully';
            
            if (response) {
                if (typeof response === 'string') {
                    successMessage = response;
                } else if (typeof response === 'object') {
                    if (response.message && typeof response.message === 'string') {
                        successMessage = response.message;
                    } else {
                        // Handle object response more carefully
                        successMessage = 'Services Count completed successfully';
                    }
                }
            }
            
            setSnackbarMessage(successMessage);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
                setTimeout(() => {
                navigate('/home/service-count-control'); // Adjust the navigation path as necessary
            }, 1500);


            // Reset form fields after successful submission
            setCount("");
            setService("");
            setSlug("");
    
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Create a safe error message string
            let errorMessage = 'An error occurred';
            
            if (error) {
                if (typeof error === 'string') {
                    errorMessage = error;
                } else if (typeof error === 'object') {
                    // Try to extract a meaningful error message from various possible structures
                    if (typeof error.message === 'string') {
                        errorMessage = error.message;
                    } else if (error.response?.data) {
                        const data = error.response.data;
                        if (typeof data === 'string') {
                            errorMessage = data;
                        } else if (typeof data === 'object') {
                            if (typeof data.message === 'string') {
                                errorMessage = data.message;
                            } else if (data.error && typeof data.error === 'string') {
                                errorMessage = data.error;
                            } else {
                                // Last resort: stringify but keep it reasonable
                                try {
                                    const stringified = JSON.stringify(data);
                                    errorMessage = stringified.length > 100 
                                        ? stringified.substring(0, 100) + '...' 
                                        : stringified;
                                } catch (e) {
                                    errorMessage = 'Failed to process error details';
                                }
                            }
                        }
                    }
                }
            }
            
            setSnackbarSeverity("error");
            setSnackbarMessage(errorMessage);
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
                        Add Home Service Count
                    </Typography>
                    <br />
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="count"
                            label="Count"
                            name="count"
                            value={count}
                            onChange={(e) => setCount(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="service"
                            label="Service"
                            name="service"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                        />
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
                        <Button type="submit" variant="contained" className={classes.submit} fullWidth>
                            Submit
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

export default HomeServiceCountAddForm;