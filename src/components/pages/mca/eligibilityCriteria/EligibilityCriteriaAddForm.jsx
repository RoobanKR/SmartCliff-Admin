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
import axios from "axios";
import { createEligibilityCriteria } from "../../../redux/slices/mca/eligibilityCriteria/eligibilityCriteria";
import { useDispatch, useSelector } from "react-redux";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";

function EligibilityCriteriaAddForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [titles, setTitles] = useState([
    { title: "", assesment: [{ subtitle: "", icon: "",objective:"" }] },
  ]);
  const [description, setDescription] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
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
    dispatch(fetchDegreeProgramData());
  }, [dispatch]);

  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  }
  const handleAddTitle = () => {
    setTitles([
      ...titles,
      { title: "", assesment: [{ subtitle: "", icon: "",objective:"" }] },
    ]);
  };

  const handleRemoveTitle = (index) => {
    const updatedTitles = [...titles];
    updatedTitles.splice(index, 1);
    setTitles(updatedTitles);
  };

  const handleTitleChange = (index, event) => {
    const updatedTitles = [...titles];
    updatedTitles[index].title = event.target.value;
    setTitles(updatedTitles);
  };

  const handleAddAssessment = (index) => {
    const updatedTitles = [...titles];
    updatedTitles[index].assesment.push({ subtitle: "", icon: "",objective:"" });
    setTitles(updatedTitles);
  };

  const handleRemoveAssessment = (titleIndex, assesmentIndex) => {
    const updatedTitles = [...titles];
    updatedTitles[titleIndex].assesment.splice(assesmentIndex, 1);
    setTitles(updatedTitles);
  };

  const handleAssessmentChange = (titleIndex, assesmentIndex, event) => {
    const updatedTitles = [...titles];
    updatedTitles[titleIndex].assesment[assesmentIndex][event.target.name] =
      event.target.value;
    setTitles(updatedTitles);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFormSubmit = async () => {
    try {
      const formData = {
        description,
        eligibility: titles,
        degree_program:selectedProgram._id
      };
      dispatch(createEligibilityCriteria({token: cookies.token,formData}));
      navigate(`/EligibilityCriteria-control`);

    } catch (error) {
      console.error("Error submitting form:", error);
    }
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
              Eligibility Criteria Add Form
            </Typography>
        <FormControl component="fieldset">
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={handleDescriptionChange}
            mb={1} // Adding margin bottom
          />
          <br></br>
          {titles.map((title, titleIndex) => (
            <Grid container key={titleIndex} spacing={2} mb={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  fullWidth
                  value={title.title}
                  onChange={(event) => handleTitleChange(titleIndex, event)}
                />
              </Grid>
              {title.assesment.map((assesment, assesmentIndex) => (
                <Grid item xs={12} key={assesmentIndex}>
                  <TextField
                    label="Assessment Title"
                    fullWidth
                    name="subtitle"
                    value={assesment.subtitle}
                    onChange={(event) =>
                      handleAssessmentChange(titleIndex, assesmentIndex, event)
                    }
                  />
                   <TextField
                    label="Assessment objective"
                    fullWidth
                    name="objective"
                    value={assesment.objective}
                    onChange={(event) =>
                      handleAssessmentChange(titleIndex, assesmentIndex, event)
                    }
                  />
                  <TextField
                    label="Icon URL"
                    fullWidth
                    name="icon"
                    value={assesment.icon}
                    onChange={(event) =>
                      handleAssessmentChange(titleIndex, assesmentIndex, event)
                    }
                  />
                  <IconButton
                    aria-label="remove assesment"
                    onClick={() =>
                      handleRemoveAssessment(titleIndex, assesmentIndex)
                    }
                  >
                    <RemoveIcon /> remove assesment
                  </IconButton>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddAssessment(titleIndex)}
                >
                  Add Assessment
                </Button>
              </Grid>
              
            </Grid>
          ))}

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
        </Container>
      }
    />
  );
};

export default EligibilityCriteriaAddForm;
