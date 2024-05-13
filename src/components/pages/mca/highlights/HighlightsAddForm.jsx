import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
  Box,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import axios from "axios";
import { createHighlight } from "../../../redux/slices/mca/highlights/highlight";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";

const HighlightForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(null);

  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );

  const [highlightData, setHighlightData] = useState({
    title: "",
    description: "",
    highlight: "",
    degree_program: "", // Assuming this is the ID of the degree program
    subheadings: [""],
  });
 const [cookies, removeCookie] = useCookies(["token"]);

 useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
      console.log("user verify called");
    }
  }, [cookies]);


  useEffect(() => {
    dispatch(fetchDegreeProgramData());
  }, [dispatch]);
  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHighlightData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubheadingChange = (index, value) => {
    const updatedSubheadings = [...highlightData.subheadings];
    updatedSubheadings[index] = value;
    setHighlightData((prevData) => ({
      ...prevData,
      subheadings: updatedSubheadings,
    }));
  };

  const handleAddSubheading = () => {
    setHighlightData((prevData) => ({
      ...prevData,
      subheadings: [...prevData.subheadings, ""],
    }));
  };

  const handleRemoveSubheading = (index) => {
    const updatedSubheadings = [...highlightData.subheadings];
    updatedSubheadings.splice(index, 1);
    setHighlightData((prevData) => ({
      ...prevData,
      subheadings: updatedSubheadings,
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const subheadingsArray = highlightData.subheadings.map((subheading) => ({
      subheading,
    }));

    const requestData = {
      title: highlightData.title,
      description: highlightData.description,
      versus: subheadingsArray, // Assign the subheadings array
      highlight: highlightData.highlight,
      degree_program: selectedProgram._id,
    };

    // Dispatch the createHighlight async thunk
    dispatch(createHighlight(requestData))
      .unwrap()
      .then((response) => {
        console.log("Highlight created successfully:", response);
        // Optionally redirect or show a success message
      })
      .catch((error) => {
        console.error("Error creating highlight:", error);
        // Handle error, show error message, etc.
      });
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
            style={{ fontFamily: 'Serif' }}
          >
            HighLight Edit Form
          </Typography>
    <form onSubmit={handleSubmit}>
      <TextField
        name="title"
        label="Title"
        value={highlightData.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="description"
        label="Description"
        value={highlightData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="highlight-label">Highlight</InputLabel>
        <Select
          labelId="highlight-label"
          name="highlight"
          value={highlightData.highlight}
          onChange={handleChange}
        >
          <MenuItem value="smartcliff">Smartcliff</MenuItem>
          <MenuItem value="traditional">Traditional</MenuItem>
        </Select>
      </FormControl>
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
      <Box mt={2}>
        {highlightData.subheadings.map((subheading, index) => (
          <Box display="flex" alignItems="center" key={index}>
            <TextField
              label={`Subheading ${index + 1}`}
              value={subheading}
              onChange={(e) => handleSubheadingChange(index, e.target.value)}
              fullWidth
              margin="normal"
            />
            {index === highlightData.subheadings.length - 1 && (
              <IconButton onClick={handleAddSubheading}>
                <AddIcon />
              </IconButton>
            )}
            {index > 0 && (
              <IconButton onClick={() => handleRemoveSubheading(index)}>
                <RemoveIcon />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
    </Paper>
        </Container>
      }
    />
  );
}

export default HighlightForm;
