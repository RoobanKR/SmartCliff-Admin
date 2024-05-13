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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate, useParams } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchSemesterById, selectSemesterData, selectSemesterError, updateSemester } from "../../../redux/slices/mca/semester/semester";


function SemesterEditForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [semesters, setSemesters] = useState([]);
  const [description, setDescription] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
  const semesterData = useSelector(selectSemesterData);
  const semesterError = useSelector(selectSemesterError);

  useEffect(() => {
    dispatch(fetchDegreeProgramData());
    dispatch(fetchSemesterById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (semesterData) {
      setDescription(semesterData.description);
      setSemesters(semesterData.semester);
      setSelectedProgram(semesterData.degree_program);
    }
  }, [semesterData]);

  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  };

  const handleEditSemester = () => {
    setSemesters([
      ...semesters,
      {
        heading: "",
        subheading: "",
        icon: "",
        submain: [{ inner_heading: "", inner_subheading: "" }],
      },
    ]);
  };

  const handleRemoveSemester = (index) => {
    const updatedSemesters = [...semesters];
    updatedSemesters.splice(index, 1);
    setSemesters(updatedSemesters);
  };

  const handleSemesterChange = (index, event) => {
    const updatedSemesters = semesters.map((semester, i) => {
      if (i === index) {
        return {
          ...semester,
          [event.target.name]: event.target.value,
        };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };
  

  const handleAddInnerSchema = (index) => {
    setSemesters(prevSemesters => {
      const updatedSemesters = prevSemesters.map((semester, i) => {
        if (i === index) {
          return {
            ...semester,
            submain: [
              ...semester.submain,
              {
                inner_heading: "",
                inner_subheading: ""
              }
            ]
          };
        }
        return semester;
      });
      return updatedSemesters;
    });
  };
  
  

  const handleRemoveInnerSchema = (semesterIndex, innerIndex) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex].submain.splice(innerIndex, 1);
    setSemesters(updatedSemesters);
  };

  const handleInnerSchemaChange = (semesterIndex, innerIndex, event) => {
    const updatedSemesters = semesters.map((semester, i) => {
      if (i === semesterIndex) {
        const updatedSubmain = semester.submain.map((inner, j) => {
          if (j === innerIndex) {
            return {
              ...inner,
              [event.target.name]: event.target.value,
            };
          }
          return inner;
        });
        return {
          ...semester,
          submain: updatedSubmain,
        };
      }
      return semester;
    });
    setSemesters(updatedSemesters);
  };
  

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFormSubmit = async () => {
    try {
      const formData = {
        description,
        semester: semesters,
        degree_program: selectedProgram._id,
      };

      await dispatch(updateSemester({ semesterId: id, formData }));

        navigate("/Semester-control");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error states or display error messages to the user
    }
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          {" "}
          <Paper
            elevation={3}
            style={{ padding: 20, maxHeight: "80vh", overflowY: "auto" }}
          >
            <FormControl component="fieldset">
              <Typography
                variant="h4"
                align="center"
                style={{ fontFamily: "Serif" }}
              >
                Semester Edit Form
              </Typography>{" "}
              <TextField
                label="Description"
                fullWidth
                value={description}
                onChange={handleDescriptionChange}
                mb={1} // Adding margin bottom
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
                      <IconButton
                        aria-label="remove inner schema"
                        onClick={() =>
                          handleRemoveInnerSchema(semesterIndex, innerIndex)
                        }
                      >
                        <RemoveIcon /> Remove Inner Schema
                      </IconButton>
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
                    <IconButton
                      aria-label="remove semester"
                      onClick={() => handleRemoveSemester(semesterIndex)}
                    >
                      <RemoveIcon /> Remove Semester
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleEditSemester}
              >
                Update Semester
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
            >
              Submit
            </Button>
            {semesterError && (
              <Typography color="error" variant="body1">
                {semesterError}
              </Typography>
            )}
          </Paper>
        </Container>
      }
    />
  );
}

export default SemesterEditForm;
