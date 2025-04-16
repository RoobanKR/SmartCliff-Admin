import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  FormControl,
  FormLabel,
  Grid,
  Paper,
  Autocomplete,
  Container,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate } from "react-router-dom";
import { createSemester } from "../../../redux/slices/mca/semester/semester";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

function SemesterAddForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [semesters, setSemesters] = useState([
    { heading: "", semester: "", subheading: "", icon: "", submain: [{ inner_heading: "", inner_subheading: "", inner_url: "" }] },
  ]);
  const [description, setDescription] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    dispatch(fetchDegreeProgramData());
  }, [dispatch]);

  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  };

  const handleAddSemester = () => {
    setSemesters([
      ...semesters,
      { heading: "", semester: "", subheading: "", icon: "", submain: [{ inner_heading: "", inner_subheading: "", inner_url: "" }] },
    ]);
  };

  const handleRemoveSemester = (index) => {
    const updatedSemesters = [...semesters];
    updatedSemesters.splice(index, 1);
    setSemesters(updatedSemesters);
  };

  const handleSemesterChange = (index, event) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[index][event.target.name] = event.target.value;
    setSemesters(updatedSemesters);
  };

  const handleAddInnerSchema = (index) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[index].submain.push({ inner_heading: "", inner_subheading: "", inner_url: "" });
    setSemesters(updatedSemesters);
  };

  const handleRemoveInnerSchema = (semesterIndex, innerIndex) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex].submain.splice(innerIndex, 1);
    setSemesters(updatedSemesters);
  };

  const handleInnerSchemaChange = (semesterIndex, innerIndex, event) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex].submain[innerIndex][event.target.name] =
      event.target.value;
    setSemesters(updatedSemesters);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFormSubmit = async () => {
    try {
      const filteredSemesters = semesters.map(semester => {
        const filteredSubmain = semester.submain.filter(item =>
          item.inner_heading || item.inner_subheading || item.inner_url
        );

        return {
          ...semester,
          submain: filteredSubmain
        };
      }).filter(semester =>
        semester.heading ||
        semester.semester ||
        semester.subheading ||
        semester.icon ||
        semester.submain.length > 0
      );

      const formData = {
        description: description || undefined,
        semester: filteredSemesters,
        degree_program: selectedProgram?._id,
      };

      const cleanFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== undefined && v !== null)
      );

      await dispatch(createSemester(cleanFormData));
      setSnackbarMessage("Semester created successfully!");
      setSnackbarOpen(true);

    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbarMessage("Error submitting form. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate("/Semester-control");
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper
            elevation={3}
            style={{ padding: 20, maxHeight: "80vh", overflowY: "auto" }}
          >
            <FormControl component="fieldset">
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
                Semester Add Form
              </Typography>
              <TextField
                label="Description"
                fullWidth
                value={description}
                onChange={handleDescriptionChange}
                mb={1}
              />
              <br />
              {semesters.map((semester, semesterIndex) => (
                <Grid container key={semesterIndex} spacing={2} mb={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Semester Heading"
                      fullWidth
                      name="heading"
                      value={semester.heading}
                      onChange={(event) =>
                        handleSemesterChange(semesterIndex, event)
                      }
                    />
                    <TextField
                      label="Semester"
                      fullWidth
                      name="semester"
                      value={semester.semester}
                      onChange={(event) =>
                        handleSemesterChange(semesterIndex, event)
                      }
                    />
                    <TextField
                      label="Semester Subheading"
                      fullWidth
                      name="subheading"
                      value={semester.subheading}
                      onChange={(event) =>
                        handleSemesterChange(semesterIndex, event)
                      }
                    />
                    <TextField
                      label="Icon URL"
                      fullWidth
                      name="icon"
                      value={semester.icon}
                      onChange={(event) =>
                        handleSemesterChange(semesterIndex, event)
                      }
                    />
                  </Grid>
                  {semester.submain.map((inner, innerIndex) => (
                    <Grid item xs={12} key={innerIndex}>
                      <TextField
                        label="Inner Heading"
                        fullWidth
                        name="inner_heading"
                        value={inner.inner_heading}
                        onChange={(event) =>
                          handleInnerSchemaChange(
                            semesterIndex,
                            innerIndex,
                            event
                          )
                        }
                      />
                      <TextField
                        label="Inner Subheading"
                        fullWidth
                        name="inner_subheading"
                        value={inner.inner_subheading}
                        onChange={(event) =>
                          handleInnerSchemaChange(
                            semesterIndex,
                            innerIndex,
                            event
                          )
                        }
                      />
                      <TextField
                        label="Inner URL"
                        fullWidth
                        name="inner_url"
                        value={inner.inner_url}
                        onChange={(event) =>
                          handleInnerSchemaChange(
                            semesterIndex,
                            innerIndex,
                            event
                          )
                        }
                      />
                      <Button
                        variant="outlined"
                        startIcon={<RemoveIcon />}
                        onClick={() =>
                          handleRemoveInnerSchema(semesterIndex, innerIndex)
                        }
                      >
                        Remove Inner Schema
                      </Button>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddInnerSchema(semesterIndex)}
                    >
                      Add Inner Schema
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      startIcon={<RemoveIcon />}
                      onClick={() => handleRemoveSemester(semesterIndex)}
                    >
                      Remove Semester
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddSemester}
              >
                Add Semester
              </Button>
              <FormControl fullWidth>
                <Autocomplete
                  id="degree_program"
                  options={degreeProgramData || []}
                  getOptionLabel={(option) =>
                    option ? option.program_name : ""
                  }
                  value={selectedProgram}
                  onChange={handleProgramChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Program"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleFormSubmit}>
              Submit
            </Button>
          </Paper>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={handleSnackbarClose} severity="success">
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      }
    />
  );
};

export default SemesterAddForm;