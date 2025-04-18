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
  Tooltip,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate, useParams } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchSemesterById, selectSemesterData, selectSemesterError, updateSemester } from "../../../redux/slices/mca/semester/semester";
import { HelpOutline } from "@material-ui/icons";


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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
        semester: "",
        subheading: "",
        icon: "",
        submain: [{ inner_heading: "", inner_subheading: "", inner_url: "" }],
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
                inner_subheading: "",
                inner_url: ""
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate("/Semester-control");
  };

  const handleFormSubmit = async () => {
    try {
      // Filter out empty semesters and their empty submain items
      const filteredSemesters = semesters.map(semester => {
        // Filter out empty submain items
        const filteredSubmain = semester.submain.filter(item =>
          item.inner_heading || item.inner_subheading || item.inner_url
        );

        return {
          ...semester,
          submain: filteredSubmain
        };
      }).filter(semester =>
        // Keep semester only if it has any filled field or non-empty submain array
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

      // Only include properties that have values
      const cleanFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== undefined && v !== null)
      );

      await dispatch(updateSemester({ semesterId: id, formData: cleanFormData }));
      setSnackbarMessage("Semester updated successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbarMessage("Error updating semester. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper
            elevation={0}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              mt={2}
              mb={2}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
              >
                Back
              </Button>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flex: 1
              }}>
                <Typography
                  variant="h4"
                  sx={{
                    position: "relative",
                    padding: 0,
                    margin: 0,
                    fontFamily: "Merriweather, serif",
                    fontWeight: 300,
                    fontSize: { xs: "32px", sm: "40px" },
                    color: "#747474",
                    textAlign: "center",
                    textTransform: "uppercase",
                    paddingBottom: "5px",
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
                  Semester Edit Form
                </Typography>

                <Tooltip
                  title="This is where you can edit degree program details and images."
                  arrow
                >
                  <HelpOutline
                    sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }}
                  />
                </Tooltip>
              </Box>
            </Box>
            <form
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}>
              <FormControl component="fieldset">
                <TextField
                  label="Description"
                  fullWidth
                  value={description}
                  onChange={handleDescriptionChange}
                  style={{ marginBottom: "20px" }}
                />
                {semesters.map((semester, semesterIndex) => (
                  <Grid container key={semesterIndex} spacing={2} mb={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Semester Heading"
                        fullWidth
                        name="heading"
                        value={semester.heading}
                        style={{ marginBottom: "20px" }}
                        onChange={(event) =>
                          handleSemesterChange(semesterIndex, event)
                        }
                      />
                      <TextField
                        label="Semester"
                        fullWidth
                        name="semester"
                        style={{ marginBottom: "20px" }}
                        value={semester.semester}
                        onChange={(event) =>
                          handleSemesterChange(semesterIndex, event)
                        }
                      />
                      <TextField
                        label="Semester Subheading"
                        fullWidth
                        name="subheading"
                        style={{ marginBottom: "20px" }}
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
                        style={{ marginBottom: "20px" }}
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
                          style={{ marginBottom: "20px" }}
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
                          style={{ marginBottom: "20px" }}
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
                          style={{ marginBottom: "20px" }}
                          value={inner.inner_url || ""}
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
                  onClick={handleEditSemester}
                  style={{ marginBottom: "20px" }}
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
              <Button
                variant="contained"
                style={{
                  display: "block",
                  margin: "24px auto 0", // centers the button horizontally
                  backgroundColor: "#ff6d00", // orange
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
                onClick={handleFormSubmit}
              >
                Update Semester
              </Button>
            </form>

            {semesterError && (
              <Typography color="error" variant="body1">
                {semesterError}
              </Typography>
            )}
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
        </ Container>
      }
    />
  );
}

export default SemesterEditForm;