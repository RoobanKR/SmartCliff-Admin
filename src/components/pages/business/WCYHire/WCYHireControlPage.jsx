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
  TableSortLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TablePagination,
  Grid,
  Tooltip,
} from '@mui/material';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { deleteWCYHire, fetchWCYHires } from '../../../redux/slices/business/WCYHire/WcyHire'; // Adjust the import path as necessary
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const WCYHireControlPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wcyHires, loading } = useSelector((state) => state.wcyHire);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    dispatch(fetchWCYHires());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/business/wcy-hire-edit/${id}`); // Adjust the navigation path as necessary
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        const resultAction = await dispatch(deleteWCYHire(deleteId));
        if (deleteWCYHire.fulfilled.match(resultAction)) {
          setSnackbar({
            open: true,
            message: 'WCY Hire deleted successfully!',
            severity: 'success',
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete WCY Hire',
          severity: 'error',
        });
      } finally {
        setConfirmDeleteOpen(false);
        setDeleteId(null);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCloseDialog = () => {
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const filteredWCYHires = wcyHires.filter((wcyHire) => {
    return (
      (filterType ? wcyHire.type === filterType : true) &&
      (wcyHire.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       wcyHire.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            WCY Hire Control Page
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search..."
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
                onClick={() => navigate('/business/wcy-hire-add')} // Adjust the navigation path as necessary
                startIcon={<AddIcon />}
              >
                Add New WCY Hire
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel onClick={() => setFilterType('type')}>Type</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel>Title</TableSortLabel>
                  </TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Definitions</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWCYHires.length > 0 ? (
                  filteredWCYHires
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((wcyHire) => (
                      <TableRow key={wcyHire._id}>
                        <TableCell>{wcyHire.type}</TableCell>
                        <TableCell>{wcyHire.title}</TableCell>
                        <TableCell>{wcyHire.description}</TableCell>
                        <TableCell>
                          {wcyHire.image ? (
                            <Box
                              component="img"
                              src={`${wcyHire.image}`}
                              alt={wcyHire.title}
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
                        <TableCell>
                          {wcyHire.wcyDefinition && wcyHire.wcyDefinition.length > 0 ? (
                            wcyHire.wcyDefinition.map((def, index) => (
                              <div key={index}>
                                <strong>{def.title}</strong>: {def.description}
                              </div>
                            ))
                          ) : (
                            <span>No definitions available</span>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <Button variant="outlined" onClick={() => handleEdit(wcyHire._id)}>
                              <EditIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(wcyHire._id)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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
            count={filteredWCYHires.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Dialog
            open={confirmDeleteOpen}
            onClose={handleCloseDialog}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: '400px',
              },
            }}
          >
            <DialogTitle sx={{
              backgroundColor: '#f44336',
              color: 'white',
              fontWeight: 600,
            }}>
              Confirm Deletion
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="body1">
                Are you sure you want to delete this WCY Hire entry? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{
                  borderColor: '#ccc',
                  color: '#000',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
                sx={{
                  backgroundColor: '#f44336',
                  '&:hover': {
                    backgroundColor: '#d32f2f',
                  },
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

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

export default WCYHireControlPage;