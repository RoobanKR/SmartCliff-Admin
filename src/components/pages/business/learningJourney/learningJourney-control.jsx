import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useNavigate } from "react-router-dom";
import {
  deleteLearningJourney,
  fetchAllLearningJourneys,
} from "../../../redux/slices/business/learningJourney/learningJourney";

const LearningJourneyControlPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const learningJourneys =
    useSelector((state) => state.journey.learningJourneys) || [];
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchAllLearningJourneys());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching learning journeys:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/business/learningjourney-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteLearningJourney(deleteId))
      .unwrap()
      .then(() => {
        dispatch(fetchAllLearningJourneys());
        setConfirmDialogOpen(false);
        setSnackbarOpen(true); // Snackbar shown here
      })
      .catch((error) => {
        console.error("Error deleting learning journey:", error);
      });
  };

  const handleCloseDialog = () => {
    setDeleteId(null);
    setConfirmDialogOpen(false);
  };

  if (loading) {
    return (
      <LeftNavigationBar
        Content={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
          >
            <CircularProgress />
          </Box>
        }
      />
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <>
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
                mt: -4,
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
             Learning Journeys
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/business/learningjourney-add")}
            sx={{ mb: 2 }}
          >
            Add Learning Journey
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {learningJourneys.length > 0 ? (
                  learningJourneys.map((journey) => (
                    <TableRow key={journey.id}>
                      <TableCell>{journey.type || "N/A"}</TableCell>
                      <TableCell>{journey.title || "N/A"}</TableCell>
                      <TableCell>{journey.description || "N/A"}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(journey._id)}
                          color="primary"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(journey._id)}
                          color="error"
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No learning journeys found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Learning journey deleted successfully!
            </Alert>
          </Snackbar>

          <Dialog open={confirmDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Are you sure you want to delete this learning journey?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      }
    />
  );
};

export default LearningJourneyControlPage;
