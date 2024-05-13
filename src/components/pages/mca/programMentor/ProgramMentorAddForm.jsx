import React, { useEffect, useState } from "react";
import { Typography, TextField, Button, Paper, Container, FormControl, Autocomplete } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { createProgramMentor } from "../../../redux/slices/mca/programMentor/programMentor";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate } from "react-router-dom";

const ProgramMentorAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mentorName, setMentorName] = useState("");
  const [mentorImage, setMentorImage] = useState(null);
  const [designation, setDesignation] = useState("");
  const { loading, error } = useSelector((state) => state.programMentor);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
  useEffect(() => {
    dispatch(fetchDegreeProgramData());
  }, [dispatch]);

  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  };

  const handleMentorImageChange = (files) => {
    setMentorImage(files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", mentorName);
    formData.append("image", mentorImage);
    formData.append("designation", designation);
    formData.append("degree_program", selectedProgram._id);

    dispatch(createProgramMentor(formData));
    navigate("/ProgramMentor-control");

  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
            <Typography
              variant="h4"
              align="center"
              style={{ fontFamily: "Serif" }}
            >
              Program Mentor Add Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <DropzoneArea
                acceptedFiles={["image/*"]}
                filesLimit={1}
                onChange={handleMentorImageChange}
                dropzoneText="Drag and drop an image here or click"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="mentorName"
                label="Mentor Name"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="designation"
                label="Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
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
              <Button
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  marginTop: "20px",
                }}
                fullWidth
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default ProgramMentorAddForm;
