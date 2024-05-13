import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  IconButton,
  FormControl,
  FormLabel,
  Grid,
  Paper,
  Container,
  Typography,
  Autocomplete,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import axios from 'axios'; // Import Axios
import { useDispatch, useSelector } from 'react-redux';
import { fetchDegreeProgramData } from '../../../redux/slices/mca/degreeProgram/degreeProgram';
import { createAdmissionProcess } from '../../../redux/slices/mca/admissionProcess/admissionProcess';

function AdmissionProcessAddForm() {
  const dispatch = useDispatch();

  const [headings, setHeadings] = useState([{ heading: '' }]);
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
  const handleAddHeading = () => {
    setHeadings([...headings, { heading: '' }]);
  };

  const handleRemoveHeading = (index) => {
    const updatedHeadings = [...headings];
    updatedHeadings.splice(index, 1);
    setHeadings(updatedHeadings);
  };

  const handleHeadingChange = (index, event) => {
    const updatedHeadings = [...headings];
    updatedHeadings[index].heading = event.target.value;
    setHeadings(updatedHeadings);
  };

  const handleFormSubmit = async () => {
    try {
      const formData = {
        admission: headings,
        degree_program: selectedProgram._id,
      };

      dispatch(createAdmissionProcess(formData));
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
              Admission Process Fees
            </Typography>
            {headings.map((heading, index) => (
              <Grid container key={index} spacing={2} alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    label={`Heading ${index + 1}`}
                    fullWidth
                    value={heading.heading}
                    onChange={(event) => handleHeadingChange(index, event)}
                  />
                </Grid>
                <Grid>
                <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddHeading}
            >
              Add Heading
            </Button>
                <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleRemoveHeading(index)}
              >
              Remove Heading
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

export default AdmissionProcessAddForm;
