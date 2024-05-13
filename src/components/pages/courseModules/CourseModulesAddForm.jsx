import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Box,
  Typography,
  TextField,
  Button,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { submitCourseModules } from "../../redux/slices/courseModule/courseModule";
import { useDispatch, useSelector } from "react-redux";

import { Autocomplete, FormControl } from "@mui/material";
import { fetchCourse, selectCourses } from "../../redux/slices/course/course";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    maxWidth: 600,
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  subHeadingContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: theme.spacing(2),
  },
  addModuleButton: {
    display: "flex",
    alignItems: "center",
    marginTop: 2,
  },
}));

const CourseModulesAddForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([{ title: "", sub_title: [] }]);
  const courses = useSelector(selectCourses);
  useEffect(() => {
    dispatch(fetchCourse());
  }, [dispatch]);

  const handleCourseChange = (_, newValue) => {
    setSelectedCourse(newValue);
  };

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const handleAddDuration = (index) => {
    const updatedModules = [...modules];
    updatedModules[index].sub_title.push({ duration: "", heading: "" });
    setModules(updatedModules);
  };

  const handleAddModule = () => {
    setModules([...modules, { title: "", sub_title: [] }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("course", selectedCourse._id);
    // Dispatch the submitCourseModules action
    dispatch(submitCourseModules({ modules, course: selectedCourse._id }));
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
              Course Modules
            </Typography>
            {modules.map((module, index) => (
              <div key={index}>
                <TextField
                  className={classes.formControl}
                  label={`Title ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  required
                  value={module.title}
                  onChange={(e) =>
                    handleModuleChange(index, "title", e.target.value)
                  }
                />
                {module.sub_title.map((detail, subIndex) => (
                  <div key={subIndex} className={classes.subHeadingContainer}>
                    <TextField
                      className={classes.formControl}
                      label={`Duration ${subIndex + 1}`}
                      variant="outlined"
                      fullWidth
                      required
                      value={detail.duration}
                      onChange={(e) =>
                        handleModuleChange(index, "sub_title", [
                          ...module.sub_title.slice(0, subIndex),
                          { ...detail, duration: e.target.value },
                          ...module.sub_title.slice(subIndex + 1),
                        ])
                      }
                    />
                    <TextField
                      className={classes.formControl}
                      label={`Heading ${subIndex + 1}`}
                      variant="outlined"
                      fullWidth
                      required
                      value={detail.heading}
                      onChange={(e) =>
                        handleModuleChange(index, "sub_title", [
                          ...module.sub_title.slice(0, subIndex),
                          { ...detail, heading: e.target.value },
                          ...module.sub_title.slice(subIndex + 1),
                        ])
                      }
                    />
                  </div>
                ))}
                <Tooltip title="Add Another Duration">
                  <div className={classes.addModuleButton}>
                    <IconButton onClick={() => handleAddDuration(index)}>
                      <AddIcon color="secondary" />
                    </IconButton>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                      style={{ marginLeft: "5px" }}
                    >
                      Add Sub Heading
                    </Typography>
                  </div>
                </Tooltip>
                <br />
                <Tooltip title="">
                  <div className={classes.addModuleButton}>
                    <IconButton onClick={handleAddModule}>
                      <AddIcon color="secondary" />
                    </IconButton>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                      style={{ marginLeft: "5px" }}
                    >
                      Add Heading
                    </Typography>
                  </div>
                </Tooltip>
              </div>
            ))}
            <FormControl fullWidth>
              <Autocomplete
                id="course"
                options={courses || []}
                getOptionLabel={(option) => (option ? option.course_name : "")}
                value={selectedCourse}
                onChange={handleCourseChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Courses"
                    fullWidth
                  />
                )}
              />
            </FormControl>
            <br /> <br />
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

export default CourseModulesAddForm;
