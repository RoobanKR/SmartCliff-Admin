import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Button,
  IconButton,
  Divider,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { makeStyles } from "@material-ui/core/styles";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { Autocomplete, Tooltip } from "@mui/material";
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
  const classes = useStyles();
  const courses = useSelector(selectCourses);
  const selectedCourse = useSelector(selectSelectedCourse);
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
  const selectedDegreeProgram = useSelector(
    (state) => state.degreeProgram.selectedDegreeProgram
  );
  const [selectedService, setSelectedService] = useState(null);
  const serviceData = useSelector((state) => state.service.serviceData);
  const dispatch = useDispatch();
  const [faqItems, setFaqItems] = useState([{ question: "", answer: "" }]);
 
  const handleAddItem = () => {
    setFaqItems([...faqItems, { question: "", answer: "" }]);
  };
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);
  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
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
 
  useEffect(() => {
    dispatch(fetchCourse());
    dispatch(fetchDegreeProgramData());
  }, [dispatch]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      await dispatch(
        createFAQ({ faqItems, selectedCourse, selectedDegreeProgram,selectedService })
      );
      console.log("FAQ data sent successfully");
    } catch (error) {
      console.error("Error sending FAQ data:", error);
    }
  };
 
  console.log("degreeProgramData", degreeProgramData);
 
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
            <FormControl className={classes.formControl} fullWidth>
              <Autocomplete
                id="degreeProgram"
                options={degreeProgramData}
                getOptionLabel={(option) => option.program_name || ""}
                value={selectedDegreeProgram || null}
                onChange={handleProgramChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Degree Program"
                    fullWidth
                  />
                )}
              />
            </FormControl>
            <FormControl fullWidth>
                <Autocomplete
                  id="service"
                  options={serviceData || []}
                  getOptionLabel={(option) => (option ? option.title : "")}
                  value={selectedService}
                  onChange={handleServiceChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="service"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
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
 