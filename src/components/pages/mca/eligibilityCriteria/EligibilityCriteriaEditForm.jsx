import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  FormControl,
  Grid,
  Paper,
  Autocomplete,
  Container,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  getEligibilityCriteriaById,
  updateEligibilityCriteria,
} from "../../../redux/slices/mca/eligibilityCriteria/eligibilityCriteria";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
 
function EligibilityCriteriaEditForm() {
  const { id } = useParams();
const navigate = useNavigate();
  const dispatch = useDispatch();
  const [titles, setTitles] = useState([
    { title: "", assesment: [{ subtitle: "", icon: "", objective: "" }] },
  ]);
  const [description, setDescription] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const { selectedEligibilityCriteria, status, error } = useSelector((state) => state.eligibilityCriteria);

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
    // Fetch degree program data
    dispatch(fetchDegreeProgramData());
  }, [dispatch]);
 
  useEffect(() => {
    // Fetch eligibility criteria by ID when id changes
    if (id) {
      dispatch(getEligibilityCriteriaById(id));
    }
  }, [dispatch, id]);
 
  // Update the component state with fetched eligibility criteria
  useEffect(() => {
    // Update the component state with fetched eligibility criteria
    if (selectedEligibilityCriteria) {
      const { description, eligibility, degree_program } = selectedEligibilityCriteria;
      setDescription(description);
      setTitles(eligibility);
      setSelectedProgram(degree_program);
    }
  }, [selectedEligibilityCriteria]);
 
  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  };
 
  const handleFormSubmit = async () => {
    try {
      const formData = {
        description,
        eligibility: titles,
        degree_program: selectedProgram._id,
      };
      dispatch(updateEligibilityCriteria({token: cookies.token,id,formData}));
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
              Eligibility Criteria Edit Form
            </Typography>
            <FormControl component="fieldset">
              <TextField
                label="Description"
                fullWidth
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                mb={1}
              />
              <br></br>
              {titles.map((title, titleIndex) => (
                <Grid container key={titleIndex} spacing={2} mb={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Title"
                      fullWidth
                      value={title.title}
                      onChange={(event) =>
                        setTitles((prevState) => {
                          const newState = JSON.parse(JSON.stringify(prevState)); // Deep copy prevState
                          newState[titleIndex].title = event.target.value;
                          return newState;
                        })
                      }
                    />
                  </Grid>
                  {title.assesment.map((assesment, assesmentIndex) => (
                    <Grid item xs={12} key={assesmentIndex}>
                      <TextField
                        label="assesment Title"
                        fullWidth
                        name="subtitle"
                        value={assesment.subtitle}
                        onChange={(event) =>
                          setTitles((prevState) => {
                            const newState = JSON.parse(JSON.stringify(prevState)); // Deep copy prevState
                            newState[titleIndex].assesment[assesmentIndex]["subtitle"] = event.target.value;
                            return newState;
                          })
                        }
                      />
                      <TextField
                        label="assesment objective"
                        fullWidth
                        name="objective"
                        value={assesment.objective}
                        onChange={(event) =>
                          setTitles((prevState) => {
                            const newState = JSON.parse(JSON.stringify(prevState)); // Deep copy prevState
                            newState[titleIndex].assesment[assesmentIndex]["objective"] = event.target.value;
                            return newState;
                          })
                        }
                      />
                      <TextField
                        label="Icon URL"
                        fullWidth
                        name="icon"
                        value={assesment.icon}
                        onChange={(event) =>
                          setTitles((prevState) => {
                            const newState = JSON.parse(JSON.stringify(prevState)); // Deep copy prevState
                            newState[titleIndex].assesment[assesmentIndex]["icon"] = event.target.value;
                            return newState;
                          })
                        }
                      />
                      <IconButton
                        aria-label="remove assesment"
                        onClick={() =>
                          setTitles((prevState) => {
                            const newState = JSON.parse(JSON.stringify(prevState)); // Deep copy prevState
                            newState[titleIndex].assesment.splice(assesmentIndex, 1);
                            return newState;
                          })
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
                      onClick={() =>
                        setTitles((prevState) => {
                          const newState = JSON.parse(JSON.stringify(prevState)); // Deep copy prevState
                          newState[titleIndex].assesment.push({
                            subtitle: "",
                            icon: "",
                            objective: "",
                          });
                          return newState;
                        })
                      }
                    >
                      Add assesment
                    </Button>
                  </Grid>
                </Grid>
              ))}
 
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
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
            >
              Submit
            </Button>
          </Paper>
        </Container>
      }
    />
  );
}
 
export default EligibilityCriteriaEditForm;
