import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  IconButton,
  FormControl,
  Grid,
  Paper,
  Container,
  Typography,
  Autocomplete,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAdmissionProcessById } from '../../../redux/slices/mca/admissionProcess/admissionProcess';
import { fetchDegreeProgramData } from '../../../redux/slices/mca/degreeProgram/degreeProgram';
import { updateAdmission } from '../../../redux/slices/mca/admissionProcess/admissionProcess';

function AdmissionProcessEditForm() {
  const { admissionId } = useParams();
  const dispatch = useDispatch();
  const [headings, setHeadings] = useState([{ heading: '' }]);
  const [degreeProgram, setDegreeProgram] = useState(null);
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
  const { admissionById } = useSelector((state) => state.admissionProcess);

  useEffect(() => {
    dispatch(getAdmissionProcessById(admissionId));
    dispatch(fetchDegreeProgramData()); 
  }, [dispatch, admissionId]);

  useEffect(() => {
    if (admissionById && admissionById.heading) {
      setHeadings(admissionById.heading.map((item) => ({ heading: item })));
      setDegreeProgram(admissionById.degree_program || null);
    }
  }, [admissionById]);
  

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
        admissionId,
        admissionData: {
          admission: headings,
          degree_program: degreeProgram._id,
        },
      };
      await dispatch(updateAdmission(formData));
      // Optionally, navigate to another page after successful update
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
                <Grid item xs={2}>
                  <IconButton
                    aria-label="remove heading"
                    onClick={() => handleRemoveHeading(index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddHeading}
            >
              Add Heading
            </Button>
            <FormControl fullWidth>
              <Autocomplete
                id="degree_program"
                options={degreeProgramData}
                getOptionLabel={(option) => option.program_name || ''}
                value={degreeProgram}
                onChange={(_, newValue) => setDegreeProgram(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Degree Program"
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

export default AdmissionProcessEditForm;
