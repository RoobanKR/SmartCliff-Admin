import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { makeStyles } from "@material-ui/core/styles";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { MenuItem, Paper, Chip } from "@mui/material";
import axios from "axios";
import { DropzoneArea } from "material-ui-dropzone";
import { fetchHiringById, resetHiringData, updateHiring } from "../../../redux/slices/hiring/hiring/Hiring";
import { useDispatch, useSelector } from "react-redux";

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

const HiringUpdateForm = () => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);
  
  const hiringData = useSelector((state) => state.hiring.data);
  const status = useSelector((state) => state.hiring.status);
  const error = useSelector((state) => state.hiring.error);

  const [eligibility, setEligibility] = useState("");
  const [eligibilityChips, setEligibilityChips] = useState([]);
  const [yearOfPassing, setYearOfPassing] = useState("");
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusText, setStatusText] = useState("");
  const [companyLogo, setCompanyLogo] = useState(null);

  useEffect(() => {
    if (!cookies.token) {
      navigate("/");
      return;
    }

    dispatch(fetchHiringById({ id, token: cookies.token }));

    return () => {
      dispatch(resetHiringData());
    };
  }, [id, cookies.token, dispatch, navigate]);

  useEffect(() => {
    if (hiringData) {
      setEligibility(hiringData.eligibility.join(", "));
      setEligibilityChips(hiringData.eligibility);
      setYearOfPassing(hiringData.yop);
      setRole(hiringData.role);
      setCompanyName(hiringData.company_name);
      setStartDate(hiringData.start_date);
      setEndDate(hiringData.end_date);
      setStatusText(hiringData.status);
    }
  }, [hiringData]);

  const handleEligibilityChange = (e) => {
    setEligibility(e.target.value);
  };

  const handleEligibilityBlur = () => {
    const chips = eligibility.split(",").map((item) => item.trim());
    setEligibilityChips(chips.filter((chip) => chip !== ""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("status", statusText);
    formData.append("eligibility", JSON.stringify(eligibilityChips));
    formData.append("yop", yearOfPassing);
    formData.append("role", role);
    formData.append("company_name", companyName);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);

    if (companyLogo) {
      formData.append("company_logo", companyLogo);
    }

    dispatch(
      updateHiring({
        id,
        formData,
        token: cookies.token,
      })
    );
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }


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
                Hiring Update Form
              </Typography>
              <TextField
                className={classes.formControl}
                label="Comapnay Name"
                variant="outlined"
                fullWidth
                required
                name="company_name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
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
              <TextField
                className={classes.formControl}
                label="Year of Passing"
                variant="outlined"
                fullWidth
                required
                name="yop"
                value={yearOfPassing}
                onChange={(e) => setYearOfPassing(e.target.value)}
              />
              <TextField
                className={classes.formControl}
                label="Role"
                variant="outlined"
                fullWidth
                required
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <Grid item xs={12}>
                <TextField
                  label="Start Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  name="start_date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="End Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  name="end_date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
              >
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="current">Current</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
              </TextField>
              <DropzoneArea
                acceptedFiles={["image/*"]}
                dropzoneText="Drag and drop company logo here or click"
                onChange={(files) => setCompanyLogo(files[0])}
                filesLimit={1}
                showAlerts={false}
                className={classes.formControl}
              />
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

export default HiringUpdateForm;
