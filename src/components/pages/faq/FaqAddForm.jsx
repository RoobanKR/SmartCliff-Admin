import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Button,
  IconButton,
  Divider,
  InputLabel,
  Select,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { makeStyles } from "@material-ui/core/styles";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { Alert, Autocomplete, Grid, MenuItem, Snackbar, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createFAQ } from "../../redux/slices/faq/faq";
import {
  fetchCourse,
  selectCourses,
  selectSelectedCourse,
  setSelectedCourse,
} from "../../redux/slices/course/course";
import {
  fetchDegreeProgramById,
  fetchDegreeProgramData,
  setSelectedDegreeProgram,
} from "../../redux/slices/mca/degreeProgram/degreeProgram";
import { fetchServices } from "../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../redux/slices/services/bussinessServices/BussinessSerives";
import { getAllColleges } from "../../redux/slices/mca/college/college";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  questionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: theme.spacing(2),
  },
  removeButton: {
    marginLeft: theme.spacing(2),
  },
  addModuleButton: {
    marginLeft: theme.spacing(2),
  },
}));

const FAQAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const classes = useStyles();
  const courses = useSelector(selectCourses);
  const selectedCourse = useSelector(selectSelectedCourse);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success'); // 'success' or 'error'
  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector((state) => state.businessService.businessServiceData);
  const degreeProgramData = useSelector((state) => state.degreeProgram.degreeProgramData);
  const collegeData = useSelector((state) => state.college.colleges);
  const [filteredServices, setFilteredServices] = useState([]);
  const [type, setType] = useState(null);
  useEffect(() => {
    dispatch(fetchCourse());
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
    dispatch(fetchDegreeProgramData());
    dispatch(getAllColleges());
  }, [dispatch]);

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    if (newValue) {
      const filtered = serviceData.filter((service) => service.business_services?._id === newValue._id);
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  };
  const [faqItems, setFaqItems] = useState([{ question: "", answer: "" }]);

  const handleAddItem = () => {
    setFaqItems([...faqItems, { question: "", answer: "" }]);
  };
  const handleRemoveItem = (index) => {
    const newFaqItems = [...faqItems];
    newFaqItems.splice(index, 1);
    setFaqItems(newFaqItems);
  };

  const handleCategoryChange = (event, newValue) => {
    dispatch(setSelectedCourse(newValue));
  };

  const handleProgramChange = (event, newValue) => {
    dispatch(setSelectedDegreeProgram(newValue));
  };
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        createFAQ({ faqItems, type, selectedCourse, selectedProgram, selectedService, selectedBusinessService, selectedCollege })
      );
      setSnackMessage('FAQ submitted successfully!');
      setSnackSeverity('success');
      setOpenSnackBar(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        // Replace '/control-page' with your actual control page route
        navigate('/FAQ-control');
      }, 3000);

    } catch (error) {
      // console.error("Error sending FAQ data:", error);
      setSnackMessage(`Error submitting FAQ: ${error.message}`);
      setSnackSeverity('error');
      setOpenSnackBar(true);
    }
  };


  return (
    <LeftNavigationBar
      Content={
        <Box className={classes.formContainer}>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Typography
              gutterBottom
              variant="h4"
              align="center"
              component="div"
              style={{ fontFamily: "Serif" }}
            >
              FAQ Add Form
            </Typography>
            <br></br>
            {faqItems.map((item, index) => (
              <div key={index} className={classes.questionContainer}>
                <TextField
                  className={classes.formControl}
                  label={`Question ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  required
                  value={item.question}
                  onChange={(e) => {
                    const newFaqItems = [...faqItems];
                    newFaqItems[index].question = e.target.value;
                    setFaqItems(newFaqItems);
                  }}
                />
                <TextField
                  className={classes.formControl}
                  label={`Answer ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  required
                  value={item.answer}
                  onChange={(e) => {
                    const newFaqItems = [...faqItems];
                    newFaqItems[index].answer = e.target.value;
                    setFaqItems(newFaqItems);
                  }}
                />
                {index > 0 && (
                  <IconButton
                    onClick={() => handleRemoveItem(index)}
                    className={classes.removeButton}
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
              </div>
            ))}

            <Tooltip title="Add Module">
              <IconButton
                className={classes.addModuleButton}
                onClick={handleAddItem}
              >
                <AddIcon color="secondary" />
              </IconButton>
            </Tooltip>
            <Divider style={{ margin: "16px 0" }} />

            <FormControl fullWidth margin="normal">
              <InputLabel id="type-label">Business Type</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={type}
                onChange={handleTypeChange}

              >
                <MenuItem value="hirefromus">Hire From Us</MenuItem>
                <MenuItem value="trainfromus">Train From Us</MenuItem>
                <MenuItem value="institute">Institute</MenuItem>
              </Select>
            </FormControl>
            <Divider style={{ margin: "16px 0" }} />
            <FormControl className={classes.formControl} fullWidth>
              <Autocomplete
                id="course"
                options={courses}
                getOptionLabel={(option) => option.course_name}
                value={selectedCourse || null}
                onChange={handleCategoryChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Course"
                    fullWidth
                  />
                )}
              />
            </FormControl>

            <Divider style={{ margin: "16px 0" }} />
            <Grid item xs={12}>
              <Autocomplete
                id="Business Services"
                options={businessServiceData || []}
                getOptionLabel={(option) => option?.name || ""}
                value={selectedBusinessService}
                onChange={handleBussinessServiceChange}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Business Services"
                    fullWidth
                  />
                )}
              />
            </Grid><br />
            <Grid item xs={12}>
              <Autocomplete
                id="service"
                options={filteredServices || []}
                getOptionLabel={(option) => option?.title || ""}
                value={selectedService}
                onChange={(_, newValue) => setSelectedService(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Service"
                    fullWidth
                  />
                )}
              />
            </Grid><br />
            <Grid item xs={12}>
              <Autocomplete
                id="degree_program"
                options={degreeProgramData || []}
                getOptionLabel={(option) => (option ? option.program_name : "")}
                value={selectedProgram}
                onChange={(_, newValue) => setSelectedProgram(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Program"
                    fullWidth
                  />
                )}
              />
            </Grid><br />
            <Grid item xs={12}>
              <Autocomplete
                id="college"
                options={collegeData || []}
                getOptionLabel={(option) => (option ? option.collegeName : "")}
                value={selectedCollege}
                onChange={(_, newValue) => setSelectedCollege(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="College"
                    fullWidth
                  />
                )}
              />
            </Grid><br />
            <Snackbar
              open={openSnackBar}
              autoHideDuration={6000}
              onClose={() => setOpenSnackBar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert onClose={() => setOpenSnackBar(false)} severity={snackSeverity} variant="filled">
                {snackMessage}
              </Alert>
            </Snackbar>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#4CAF50", color: "white" }}
              fullWidth
            >
              Submit
            </Button>
          </form>
        </Box>
      }
    />
  );
};

export default FAQAddForm;
