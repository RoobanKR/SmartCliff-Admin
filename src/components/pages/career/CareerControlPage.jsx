import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Button,
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
  Snackbar,
  Alert,
  TextField,
  Grid,
  TablePagination,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  deleteCareer,
  fetchAllCareers,
} from "../../redux/slices/career/career";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

const CareerControlPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { careers, loading } = useSelector((state) => state.career);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchAllCareers());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/career-edit/${id}`);
  };

  const handleConfirmDeleteOpen = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const handleDelete = () => {
    dispatch(deleteCareer(deleteId)).then(() => {
      handleConfirmDeleteClose();
      setSnackbarOpen(true);
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredCareers = careers.filter((career) =>
    career.title.toLowerCase().includes(searchTerm.toLowerCase())
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ p: isMobile ? 1 : 3 }}>
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
            Career Control Page
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                     <Grid item xs={12} md={6}>
                       <TextField
                         fullWidth
                         variant="outlined"
                         size="small"
                         placeholder="Search About Us..."
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
                         onClick={() => navigate('/career-add')}
                         startIcon={<AddIcon />}
                       >
                         Add Career
                       </Button>
                     </Grid>
                   </Grid>
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
                  {filteredCareers.length > 0 ? (
                    filteredCareers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((career) => (
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
                              onClick={() => handleConfirmDeleteOpen(career._id)}
                              sx={{ ml: 1 }}
                            >
                              Delete
                            </Button>
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
          </Paper>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCareers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Dialog
            open={confirmDeleteOpen}
            onClose={handleConfirmDeleteClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: isMobile ? '90%' : 400
              }
            }}
          >
            <DialogTitle sx={{
              backgroundColor: theme.palette.error.light,
              color: 'white',
              fontWeight: 600
            }}>
              Confirm Deletion
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="body1">
                Are you sure you want to delete this career entry? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleConfirmDeleteClose}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="contained"
                color="error"
                sx={{
                  backgroundColor: theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: theme.palette.error.dark
                  }
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="success"
              variant="filled"
              sx={{ width: '100%' }}
            >
              Career deleted successfully!
            </Alert>
          </Snackbar>
        </Box>
      }
    />
  );
};

export default CareerControlPage;