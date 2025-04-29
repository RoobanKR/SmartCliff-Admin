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
  TextField,
  Grid,
  TablePagination,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  deleteLearningJourney,
  fetchAllLearningJourneys,
} from "../../../redux/slices/business/learningJourney/learningJourney";
import { useNavigate } from "react-router-dom";

const LearningJourneyControlPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const learningJourneys = useSelector((state) => state.journey.learningJourneys) || [];
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Error deleting learning journey:", error);
      });
  };

  const handleCloseDialog = () => {
    setDeleteId(null);
    setConfirmDialogOpen(false);
  };

  const filteredLearningJourneys = learningJourneys.filter((journey) =>
    (journey.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (journey.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (journey.type || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <LeftNavigationBar
        Content={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress />
          </Box>
        }
      />
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h4"
            sx={{
              position: "relative",
              padding: 0,
              margin: 0,
              fontWeight: 700,
              textAlign: "center",
              fontWeight: 300,
              fontSize: { xs: "32px", sm: "40px" },
              color: "#747474",
              textAlign: "center",
              textTransform: "uppercase",
              paddingBottom: "5px",
              mb: 3,
              mt: -1,
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
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search Learning Journeys..."
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/business/learningjourney-add")}
                startIcon={<AddIcon />}
              >
                Add Learning Journey
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  {["Type", "Title", "Description", "Actions"].map((head) => (
                    <TableCell
                      key={head}
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLearningJourneys.length > 0 ? (
                  filteredLearningJourneys
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((journey) => (
                      <TableRow key={journey._id}>
                        <TableCell sx={{ textAlign: "center" }}>{journey.type || "N/A"}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{journey.title || "N/A"}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{journey.description || "N/A"}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit">
                              <Button
                                onClick={() => handleEdit(journey._id)}
                                color="primary"
                                variant="outlined"
                              >
                                <EditIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Button
                                onClick={() => handleDelete(journey._id)}
                                color="error"
                                variant="outlined"
                              >
                                <DeleteIcon />
                              </Button>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography>No entries found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLearningJourneys.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Dialog
            open={confirmDialogOpen}
            onClose={handleCloseDialog}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Are you sure you want to delete this learning journey? This action cannot be undone.
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
        </Box>
      }
    />
  );
};

export default LearningJourneyControlPage;