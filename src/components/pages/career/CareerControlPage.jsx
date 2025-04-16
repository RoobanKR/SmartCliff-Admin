import React, { useEffect } from 'react';
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
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteCareer, fetchAllCareers } from '../../redux/slices/career/career';
import LeftNavigationBar from '../../navbars/LeftNavigationBar';

const CareerControlPage = () => {
      const navigate = useNavigate();
    
  const dispatch = useDispatch();
  const { careers, loading, error } = useSelector((state) => state.career);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchAllCareers());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/career-edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this career?')) {
      try {
        const resultAction = await dispatch(deleteCareer(id));
        if (deleteCareer.fulfilled.match(resultAction)) {
          setSnackbar({
            open: true,
            message: resultAction.payload.message,
            severity: 'success',
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete career',
          severity: 'error',
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
            Career Control Page
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/career-add')} // Adjust the navigation path as necessary
            sx={{ mb: 2 }}
          >
            Add New Career
          </Button>
          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {careers.map((career) => (
                    <TableRow key={career._id}>
                      <TableCell>{career.title}</TableCell>
                      <TableCell>{career.description}</TableCell>
                      <TableCell>
                        {career.image ? (
                          <Box
                            component="img"
                            src={`${career.image}`}
                            alt={career.title}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                        ) : (
                          <span>No image available</span>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" onClick={() => handleEdit(career._id)}>
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(career._id)}
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
        </Box>
      }
    />
  );
};

export default CareerControlPage;