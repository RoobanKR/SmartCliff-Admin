import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Switch,
  IconButton,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { 
  fetchJobPositions, 
  updateSelectedJobPosition, 
  deleteJobPosition 
} from "../../redux/slices/joinus/joinus";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const JobPositionControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobPositions = useSelector((state) => state.joinUs?.jobPositions || []);

  useEffect(() => {
    dispatch(fetchJobPositions());
  }, [dispatch]);

  // Handle Toggle Switch
  const handleToggle = async (id, selected) => {
    await dispatch(updateSelectedJobPosition({ id, selected: !selected }));
    dispatch(fetchJobPositions());
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job position?")) {
      await dispatch(deleteJobPosition(id));
      dispatch(fetchJobPositions());
    }
  };

  // Handle Edit (Redirect to Edit Page)
  const handleEdit = (id) => {
    navigate(`/joinus-edit/${id}`);
  };

  return (
        <LeftNavigationBar
          Content={
    
    <TableContainer component={Paper} sx={{ p: 2, mt: 3 }}>
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: 'Merriweather, serif',
                fontWeight: 700, textAlign: 'center',
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 3,
                "&::before": {
                  content: '""',
                  width: "28px",
                  height: "5px",
                  display: "block",
                  position: "absolute",
                  bottom: "3px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#747474",
                },
                "&::after": {
                  content: '""',
                  width: "100px",
                  height: "1px",
                  display: "block",
                  position: "relative",
                  marginTop: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#747474",
                },
              }}
            >
        Job Position Control
      </Typography>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="Search Job"
                      InputProps={{
                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ textAlign: { xs: "left", md: "right" } }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate("/about/aboutus-add")}
                      startIcon={<AddIcon />}
                    >
                      Add About Us
                    </Button>
                  </Grid>
                </Grid>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Job Position</b></TableCell>
            <TableCell><b>Description</b></TableCell>
            <TableCell><b>Selected</b></TableCell>
            <TableCell><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobPositions.map((job) => (
            <TableRow key={job._id}>
              <TableCell>{job.job_position}</TableCell>
              <TableCell>{job.description}</TableCell>
              <TableCell>
                <Switch
                  checked={job.selected || false}
                  onChange={() => handleToggle(job._id, job.selected)}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(job._id)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(job._id)} color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      }
      />
  );
};

export default JobPositionControl;
