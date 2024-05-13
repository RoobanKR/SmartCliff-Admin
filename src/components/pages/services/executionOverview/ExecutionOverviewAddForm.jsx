import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { fetchExecutionHighlights } from "../../../redux/slices/services/executionHighlights/Execution_Highlights";
import { RemoveCircleOutline } from "@mui/icons-material";
import { createExecutionOverview } from "../../../redux/slices/services/executionOverview/ExecutionOverview";

const ExecutionOverviewAddForm = () => {
  const dispatch = useDispatch();
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
  const [selectedStack, setselectedStack] = useState(null);
  const [year, setYear] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    duration: "",
    year: "",
  });
  const [stack, setStack] = useState("");
  const [count, setCount] = useState("");
  const [touchedFields, setTouchedFields] = useState({
    stack: false,
    count: false,
    image: false,
    service: false,
  });

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchExecutionHighlights());
  }, [dispatch]);

  const handleAddField = () => {
    setFields([...fields, { type: "", typeName: "" }]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...fields];
    updatedFields[index][field] = value;
    setFields(updatedFields);
    setErrors({
      ...errors,
      [field]: value.trim() ? "" : `${field} is required`,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update state for the respective field
    switch (name) {
      case "stack":
        // Validation for stack (only alphabets)
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            stack: "Stack must contain only letters",
          }));
        } else {
          setErrors((prev) => ({ ...prev, stack: "" }));
        }
        setStack(value);
        break;
      case "count":
        // Validation for count (only digits)
        if (!/^\d+$/.test(value)) {
          setErrors((prev) => ({ ...prev, count: "Count must be a number" }));
        } else {
          setErrors((prev) => ({ ...prev, count: "" }));
        }
        setCount(value);
        break;
      case "year":
        // Validation for year (only digits from 1947 to 2050)
        if (!/^(19[4-9]\d|20[0-4]\d|2050)$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            year: "Year must be between 1947 and 2050",
          }));
        } else {
          setErrors((prev) => ({ ...prev, year: "" }));
        }

        setYear(value);
        break;
      default:
        break;
    }

    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleRemoveField = (index) => {
    // Define handleRemoveField function
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };

  const handleStackChange = (_, newValue) => {
    setselectedStack(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Validate form fields before submission
      if (!name.trim() || !duration.trim() || !year.trim()) {
        setErrors({
          name: !name.trim() ? "Name is required" : "",
          duration: !duration.trim() ? "Duration is required" : "",
          year: !year.trim() ? "Year is required" : "",
        });
        return;
      }

      // Dispatch the createExecutionOverview action with the form data
      await dispatch(
        createExecutionOverview({
          type: fields.map((field) => field.type),
          typeName: fields.map((field) => field.typeName),
          batchName: name,
          stack: selectedStack,
          duration: duration,
          status: status,
          year: year,
          service: selectedService,
        })
      );

      // Reset form fields after successful submission
      setName("");
      setFields([{ type: "", typeName: "" }]);
      setSelectedService(null);
      setStatus("");
      setSelectedDate(new Date());
      setDuration("");
      setselectedStack(null);
      setYear("");
      setErrors({ name: "", duration: "", year: "" });
    } catch (error) {
      console.error("Error:", error);
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
            Add Execution Overview
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
                          required
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
                        required
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
                          hai
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
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  InputProps={{
                    inputProps: {
                      pattern: /^[a-zA-Z0-9\s/]*$/,
                    },
                  }}
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
                  error={Boolean(errors.duration)}
                  helperText={errors.duration}
                  inputProps={{
                    pattern: /^[0-9a-zA-Z\s/]*$/,
                  }}
                />
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
                  error={Boolean(errors.year)}
                  helperText={errors.year}
                  InputProps={{
                    inputProps: {
                      pattern: "^(19[4-9]\\d|20[0-4]\\d|2050)$",
                    },
                  }}
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
                        required
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
                        required
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    label="Status"
                    fullWidth
                    required
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

export default ExecutionOverviewAddForm;
