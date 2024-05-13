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
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCourseModule,
  getCourseModuleById,
} from "../../redux/slices/courseModule/courseModule";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
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

const CourseModulesEditForm = () => {
  const { moduleId } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [modules, setModules] = useState([{ title: "", sub_title: [] }]);
  const courses = useSelector(selectCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        dispatch(fetchCourse());

        const [courseModulesResponse] = await Promise.all([
          dispatch(getCourseModuleById(moduleId)),
        ]);

        const fetchedCourseModule = courseModulesResponse.payload;

        if (!fetchedCourseModule) {
          console.error("Course module data not available");
          return;
        }
        setSelectedCourse(fetchedCourseModule.course || null);

        setModules(fetchedCourseModule.modules || []);
      } catch (error) {
        console.error("Error fetching course module details:", error);
      }
    };

    fetchModuleDetails();
  }, [dispatch, moduleId]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("modules", JSON.stringify(modules));
    formData.append("course", selectedCourse._id);

    // Check if selectedCourses is an array before using map

    try {
      await dispatch(updateCourseModule({ moduleId, formData }));
      const updatedCourseModule = await dispatch(getCourseModuleById(moduleId));
      navigate(`/Course_Modules-control`);
    } catch (error) {
      console.error("Error updating course module:", error);
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
                <Tooltip title="Add Another Module">
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
            {/* Autocomplete for Courses */}
            <Autocomplete
              id="course"
              options={courses || []}
              getOptionLabel={(option) => (option ? option.course_name : "")}
              value={selectedCourse}
              onChange={(_, newValue) => setSelectedCourse(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Courses"
                  fullWidth
                />
              )}
            />
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

export default CourseModulesEditForm;
