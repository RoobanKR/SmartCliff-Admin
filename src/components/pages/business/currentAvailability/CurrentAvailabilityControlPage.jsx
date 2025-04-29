import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  TablePagination,
} from "@mui/material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  deleteCurrentAvailability,
  getAllCurrentAvailabilities,
} from "../../../redux/slices/business/currentAvailability/currentAvailability";
import SearchIcon from "@mui/icons-material/Search";

const CurrentAvailabilityControlPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { availabilities, loading } = useSelector(
    (state) => state.currentAvailability
  );
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getAllCurrentAvailabilities());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/business/current-availability-edit/${id}`); // Adjust the path as necessary
  };

  const handleDelete = (id) => {
    setCurrentId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const resultAction = await dispatch(deleteCurrentAvailability(currentId));
      if (deleteCurrentAvailability.fulfilled.match(resultAction)) {
        setSnackbar({
          open: true,
          message: "Current availability deleted successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete current availability",
        severity: "error",
      });
    } finally {
      setOpenDialog(false);
      setCurrentId(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentId(null);
  };
  const filteredAvailabilities = (availabilities || []).filter((availability) =>
    availability && availability.skillset 
      ? availability.skillset.toLowerCase().includes(searchTerm.toLowerCase())
      : false
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
          <Typography
            variant="h4"
            sx={{
              position: "relative",
              padding: 0,
              margin: 0,
              fontFamily: "Merriweather, serif",
              fontWeight: 700,
              textAlign: "center",
              fontSize: { xs: "32px", sm: "40px" },
              color: "#747474",
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
            Current Availability Control Page
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search by Skillset..."
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
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
                onClick={() => navigate("/business/current-availability-add")}
              >
                Add New Current Availability
              </Button>
            </Grid>
          </Grid>
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Skillset
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Resources
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Duration
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Batch
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Experience
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAvailabilities.length > 0 ? (
                    filteredAvailabilities
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((availability) => (
                        <TableRow key={availability._id}>
                          <TableCell>{availability.skillset}</TableCell>
                          <TableCell>{availability.resources}</TableCell>
                          <TableCell>{availability.duration}</TableCell>
                          <TableCell>{availability.batch}</TableCell>
                          <TableCell>{availability.experience}</TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              onClick={() => handleEdit(availability._id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(availability._id)}
                              sx={{ ml: 1 }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography>No current availabilities found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAvailabilities.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this current availability?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default CurrentAvailabilityControlPage;
