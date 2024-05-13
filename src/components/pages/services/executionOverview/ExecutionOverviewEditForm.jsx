import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { useDispatch, useSelector } from "react-redux";
import { fetchExecutionHighlights } from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { RemoveCircleOutline } from "@mui/icons-material";

import {
  fetchExecutionOverviewById,
  updateExecutionOverview,
} from "../../../redux/slices/services/executionOverview/ExecutionOverview";

const ExecutionOverviewEditForm = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [fields, setFields] = useState([{ type: "", typeName: "" }]);
  const [selectedService, setSelectedService] = useState(null);
  const [status, setStatus] = useState("");
  const serviceData = useSelector((state) => state.service.serviceData);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [duration, setDuration] = useState("");
  const executionHighlights = useSelector(
    (state) => state.executionHighlights.executionHighlights
  );
  const [year, setYear] = useState("");
  const [selectedStack, setselectedStack] = useState(null);

  const executionOverview = useSelector(
    (state) => state.executionOverviews.executionOverview
  );
  const isLoading = useSelector((state) => state.executionOverviews.loading);

  useEffect(() => {
    dispatch(fetchExecutionOverviewById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (executionOverview) {
      setName(executionOverview.batchName);
      setFields(
        executionOverview.type.map((type, index) => ({
          type,
          typeName: executionOverview.typeName[index],
        }))
      );
      setselectedStack(executionOverview.stack);
      setDuration(executionOverview.duration);
      setStatus(executionOverview.status);
      setYear(executionOverview.year.toString());
      setSelectedService(executionOverview.service);
    }
  }, [executionOverview]);

  const handleAddField = () => {
    setFields([...fields, { type: "", typeName: "" }]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...fields];
    updatedFields[index][field] = value;
    setFields(updatedFields);
  };

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };
  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };
  const handleStackChange = (_, newValue) => {
    setselectedStack(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(
        updateExecutionOverview({
          id,
          payload: {
            type: fields.map((field) => field.type),
            typeName: fields.map((field) => field.typeName),
            batchName: name,
            stack: selectedStack._id,
            duration: duration,
            status: status,
            year: parseInt(year),
            service: selectedService._id,
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LeftNavigationBar
      Content={
        <Paper
          elevation={3}
          style={{ padding: 20, margin: "auto", maxWidth: 600 }}
        >
          <Typography
            gutterBottom
            variant="h4"
            align="center"
            component="div"
            style={{ fontFamily: "Serif" }}
          >
            Edit Execution Overview
          </Typography>
          <br />

          <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={2}>
              {fields.map((field, index) => (
                <Grid item key={index}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={field.type}
                          onChange={(e) =>
                            handleFieldChange(index, "type", e.target.value)
                          }
                          label="Type"
                          fullWidth
                        >
                          <MenuItem value="Clientname">Client Name</MenuItem>
                          <MenuItem value="Institution Name">
                            Institution Name
                          </MenuItem>
                          <MenuItem value="Industry Partner">
                            Industry Partner
                          </MenuItem>
                          <MenuItem value="College Name">College Name</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <TextField
                        label="Type Name"
                        variant="outlined"
                        value={field.typeName}
                        onChange={(e) =>
                          handleFieldChange(index, "typeName", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                    {index === fields.length - 1 && (
                      <Grid item>
                        <IconButton onClick={handleAddField}>
                          <AddIcon />
                        </IconButton>
                      </Grid>
                    )}
                    {index !== 0 && (
                      <Grid item>
                        <IconButton onClick={() => handleRemoveField(index)}>
                          <RemoveCircleOutline />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="BatchName"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="duration"
                  label="duration"
                  name="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    id="service"
                    options={serviceData || []}
                    getOptionLabel={(option) => (option ? option.title : "")}
                    value={selectedService}
                    onChange={handleServiceChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Service"
                        fullWidth
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    id="stack"
                    options={executionHighlights || []}
                    getOptionLabel={(option) => (option ? option.stack : "")}
                    value={selectedStack}
                    onChange={handleStackChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="stack"
                        fullWidth
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="year"
                  label="year"
                  name="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    label="Status"
                    fullWidth
                  >
                    <MenuItem value="in-progress">In-progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      }
    />
  );
};

export default ExecutionOverviewEditForm;
