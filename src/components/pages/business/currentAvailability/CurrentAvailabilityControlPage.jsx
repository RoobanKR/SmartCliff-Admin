import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
} from '@mui/material';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { deleteCurrentAvailability, getAllCurrentAvailabilities } from '../../../redux/slices/business/currentAvailability/currentAvailability';

const CurrentAvailabilityControlPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { availabilities, loading } = useSelector((state) => state.currentAvailability);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [currentId, setCurrentId] = useState(null);

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
          message: 'Current availability deleted successfully!',
          severity: 'success',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete current availability',
        severity: 'error',
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
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
            Current Availability Control Page
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/business/current-availability-add')}
            sx={{ mb: 2 }}
          >
            Add New Current Availability
          </Button>
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Skillset</TableCell>
                    <TableCell>Resources</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Batch</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availabilities.map((availability) => (
                    <TableRow key={availability._id}>
                      <TableCell>{availability.skillset}</TableCell>
                      <TableCell>{availability.resources}</TableCell>
                      <TableCell>{availability.duration}</TableCell>
                      <TableCell>{availability.batch}</TableCell>
                      <TableCell>{availability.experience}</TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" onClick={() => handleEdit(availability._id)}>
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: '100%' }}
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