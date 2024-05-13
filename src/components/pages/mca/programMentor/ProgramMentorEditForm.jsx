import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import {
  getProgramMentorById,
  updateProgramMentor,
} from "../../../redux/slices/mca/programMentor/programMentor";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate, useParams } from "react-router-dom";

const ProgramMentorEditForm = () => {
  const { mentorId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mentorName, setMentorName] = useState("");
  const [mentorImage, setMentorImage] = useState(null);
  const [designation, setDesignation] = useState("");

  const [existingImage, setExistingImage] = useState("");
  
  const { loading, error } = useSelector((state) => state.programMentor);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const programMentorById = useSelector(
    (state) => state.programMentor.programMentorById // Changed from programMentor.programMentor
  );
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
console.log("programMentorById",programMentorById);
  useEffect(() => {
    dispatch(getProgramMentorById(mentorId)); // Fetch program mentor by ID
    dispatch(fetchDegreeProgramData());
  }, [dispatch, mentorId]);

  useEffect(() => {
    if (programMentorById) {
      setMentorName(programMentorById.name || "");
      setDesignation(programMentorById.designation || "");
      setSelectedProgram(programMentorById.degree_program || null);
      setExistingImage(programMentorById.image || "");

    }
  }, [programMentorById]);

  const handleMentorImageChange = (files) => {
    setMentorImage(files[0]);
  };

  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", mentorName);
    if (mentorImage) {
      formData.append("image", mentorImage);
    }    formData.append("designation", designation);
    formData.append("degree_program", selectedProgram._id);

    dispatch(updateProgramMentor({ mentorId, formData })); // Pass mentorId along with formData
    navigate("/ProgramMentor-control");
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
            <Typography variant="h4" align="center" style={{ fontFamily: "Serif" }}>
              Program Mentor Edit Form
            </Typography>
            <form onSubmit={handleSubmit}>
            <DropzoneArea
                    onChange={(fileArray) => setMentorImage(fileArray[0])}
                    acceptedFiles={["image/jpeg", "image/jpg"]}
            filesLimit={1}
            showPreviews={false}
            showPreviewsInDropzone={true}
            dropzoneText="Drag and drop an image here or click"
          />
          <Typography
            variant="subtitle1"
            color="textSecondary"
            style={{ marginTop: "16px" }}
          >
            Existing Image:
          </Typography>
          {existingImage && (
            <Typography style={{ marginLeft: "16px" }}>
              {existingImage.split("/").pop()}
            </Typography>
          )}
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
                  getOptionLabel={(option) => (option ? option.program_name : "")}
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

export default ProgramMentorEditForm;
