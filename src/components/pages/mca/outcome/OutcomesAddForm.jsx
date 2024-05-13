import React, { useEffect, useState } from "react";
import {
  Box,
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
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate } from "react-router-dom";
import { createOutcome } from "../../../redux/slices/mca/outcome/outcome";
 
const OutcomesAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const [icon, setIcon] = useState(null);
  const [title, setTitle] = useState('');
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
  const handleIconChange = (files) => {
    setIcon(files[0]);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const formData = new FormData();
    formData.append('icon', icon);
    formData.append('title', title);
    formData.append("degree_program", selectedProgram._id);
 
    dispatch(createOutcome({formData,formData}));
    navigate("/Outcome-control");
  };
  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
            <Typography
              gutterBottom
              variant="h4"
              align="center"
              component="div"
              style={{ fontFamily: "Serif" }}
            >
              Add Outcomes
            </Typography>
            <form onSubmit={handleSubmit}>
              <DropzoneArea
                onChange={handleIconChange}
                acceptedFiles={["image/png/*"]} 
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an icon here or click"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                style={{ backgroundColor: "#4CAF50", color: "white" }}
                fullWidth
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};
 
export default OutcomesAddForm;