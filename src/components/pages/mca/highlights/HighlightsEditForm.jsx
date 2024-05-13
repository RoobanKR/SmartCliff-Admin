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
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { getHighlightById, updateHighlight } from "../../../redux/slices/mca/highlights/highlight";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";

const HighlightsEditForm = () => {
  const { highlightId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [highlight, setHighlight] = useState("");
  const [subheadings, setSubheadings] = useState([""]);

  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
  const { highlight: fetchedHighlight, loading } = useSelector(
    (state) => state.highlight
  );
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
    dispatch(getHighlightById(highlightId));
    dispatch(fetchDegreeProgramData()); 
  }, [dispatch, highlightId]);

  useEffect(() => {
    if (fetchedHighlight) {
      setTitle(fetchedHighlight.title || "");
      setDescription(fetchedHighlight.description || "");
      setHighlight(fetchedHighlight.highlight || "");
      setSubheadings(fetchedHighlight.versus.map((vs) => vs.subheading));
      setSelectedProgram(fetchedHighlight.degree_program || null);
    }
  }, [fetchedHighlight]);

  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    else if (name === "description") setDescription(value);
    else if (name === "highlight") setHighlight(value);
  };

  const handleSubheadingChange = (index, value) => {
    const updatedSubheadings = [...subheadings];
    updatedSubheadings[index] = value;
    setSubheadings(updatedSubheadings);
  };

  const handleAddSubheading = () => {
    setSubheadings((prevSubheadings) => [...prevSubheadings, ""]);
  };

  const handleRemoveSubheading = (index) => {
    const updatedSubheadings = [...subheadings];
    updatedSubheadings.splice(index, 1);
    setSubheadings(updatedSubheadings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      title,
      description,
      highlight,
      versus: subheadings.map((subheading) => ({ subheading })),
      degree_program: selectedProgram?._id,
    };

    dispatch(updateHighlight({ highlightId: highlightId, data: requestData }))
      .unwrap()
      .then((response) => {
        navigate(`/Highlight-control`);

        console.log("Highlight updated successfully:", response);
      })
      .catch((error) => {
        console.error("Error updating highlight:", error);
      });
  };

  if (loading) return <p>Loading...</p>;

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
        value={title}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="description"
        label="Description"
        value={description}
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
          value={highlight}
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
      <Grid>

      <Box mt={2}>
        {subheadings.map((subheading, index) => (
          <Box display="flex" alignItems="center" key={index}>
            <TextField
              label={`Subheading ${index + 1}`}
              value={subheading}
              onChange={(e) => handleSubheadingChange(index, e.target.value)}
              fullWidth
              margin="normal"
            />
            {index === subheadings.length - 1 && (
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
      </Grid>

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

export default HighlightsEditForm;
