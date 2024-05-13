import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { makeStyles } from "@material-ui/core/styles";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { MenuItem, Paper, Chip, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DropzoneArea } from "material-ui-dropzone";
import axios from "axios";
import { getAPIURL } from "../../../../utils/utils";

// Styles
const useStyles = makeStyles((theme) => ({
  formContainer: {
    padding: theme.spacing(2),
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const HiringAddForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [eligibility, setEligibility] = useState("");
  const [eligibilityChips, setEligibilityChips] = useState([]);
  const [companyLogo, setCompanyLogo] = useState(null);

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      navigate("/");
    }
  }, [cookies]);

  const handleEligibilityChange = (e) => {
    setEligibility(e.target.value);
  };

  const handleEligibilityBlur = () => {
    const chips = eligibility.split(",").map((item) => item.trim());
    setEligibilityChips(chips.filter((chip) => chip !== ""));
    // Set eligibility as a comma-separated string
    setEligibility(chips.filter((chip) => chip !== "").join(", "));
  };

  const handleDeleteChip = (chipIndex) => {
    const updatedChips = [...eligibilityChips];
    updatedChips.splice(chipIndex, 1);
    setEligibilityChips(updatedChips);
  };

  const handleLogoChange = (files) => {
    setCompanyLogo(files[0]); // Assuming you only allow uploading one file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("hiring_id", e.target.hiring_id.value);
    formData.append("eligibility", JSON.stringify(eligibilityChips));
    formData.append("yop", e.target.yop.value);
    formData.append("role", e.target.role.value);
    formData.append("company_name", e.target.company_name.value);
    formData.append("start_date", e.target.start_date.value);
    formData.append("end_date", e.target.end_date.value);
    formData.append("status", e.target.status.value);
    if (companyLogo) {
      formData.append("company_logo", companyLogo);
    }
    try {
      const response = await axios.post(
        `${getAPIURL()}/create/hiring`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      console.log(response.data);
      // Redirect or show success message here
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <LeftNavigationBar
      Content={
        <div className={classes.formContainer}>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
              <Typography
                gutterBottom
                variant="h4"
                align="center"
                component="div"
                style={{ fontFamily: "Serif" }}
              >
                Hiring Add Form
              </Typography>
              <TextField
                className={classes.formControl}
                label="Hiring ID"
                variant="outlined"
                fullWidth
                required
                name="hiring_id"
              />
              <TextField
                className={classes.formControl}
                label="Eligibility"
                variant="outlined"
                fullWidth
                required
                name="eligibility"
                value={eligibility}
                onChange={handleEligibilityChange}
                onBlur={handleEligibilityBlur}
              />
              <div>
                {eligibilityChips.map((chip, index) => (
                  <Chip
                    key={index}
                    label={chip}
                    onDelete={() => handleDeleteChip(index)}
                    className={classes.chip}
                  />
                ))}
              </div>
              <TextField
                className={classes.formControl}
                label="Year of Passing"
                variant="outlined"
                fullWidth
                required
                name="yop"
              />
              <TextField
                className={classes.formControl}
                label="Role"
                variant="outlined"
                fullWidth
                required
                name="role"
              />
              <TextField
                className={classes.formControl}
                label="Company Name"
                variant="outlined"
                fullWidth
                required
                name="company_name"
              />
              <Grid item xs={12}>
                <TextField
                  label="Start Date"
                  type="date"
                  defaultValue=""
                  className={classes.formControl}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  name="start_date"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="End Date"
                  type="date"
                  defaultValue=""
                  className={classes.formControl}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  name="end_date"
                />
              </Grid>
              <TextField
                select
                className={classes.formControl}
                label="Status"
                variant="outlined"
                fullWidth
                required
                name="status"
              >
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="current">Current</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
              </TextField>
              <DropzoneArea
                acceptedFiles={["image/*"]}
                dropzoneText="Drag and drop company logo here or click"
                onChange={handleLogoChange}
                filesLimit={1}
                showAlerts={false}
                className={classes.formControl}
              />
              <br></br>
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#4CAF50", color: "white" }}
                fullWidth
              >
                Submit
              </Button>
            </Paper>
          </form>
        </div>
      }
    />
  );
};

export default HiringAddForm;
