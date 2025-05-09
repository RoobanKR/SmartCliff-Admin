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
import { deleteAddress, getAllAddresses } from "../../redux/slices/contactPage/addressPage";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

const AddressControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addresses, loading } = useSelector((state) => state.address);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getAllAddresses());
  }, [dispatch]);

  const handleEdit = (id) => navigate(`/address-edit/${id}`);

  const handleConfirmDeleteOpen = (id) => {
    setConfirmDeleteOpen(true);
    setDeleteId(id);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const handleDelete = () => {
    dispatch(deleteAddress(deleteId)).then(() => {
      handleConfirmDeleteClose();
      setSnackbarOpen(true);
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredAddresses = (addresses || []).filter(
    (item) =>
      item &&
      item.street &&
      item.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <LeftNavigationBar
        Content={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        }
      />
    );

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
            Address Control Panel
          </Typography>
          <Grid container spacing={ 2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search Addresses..."
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
                onClick={() => navigate("/address-add")}
                startIcon={<AddIcon />}
              >
                Add Address
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  {["Street", "Address", "City", "Image", "Actions"].map((head) => (
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
                {filteredAddresses.length > 0 ? (
                  filteredAddresses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow key={item._id}>
                        <TableCell sx={{ textAlign: "center" }}>{item.street}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{item.address}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{item.city}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <img
                            src={item.image}
                            alt={item.street}
                            style={{ maxWidth: "50px", maxHeight: "50px" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit">
                              <Button
                                onClick={() => handleEdit(item._id)}
                                color="primary"
                                variant="outlined"
                              >
                                <EditIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Button
                                onClick={() => handleConfirmDeleteOpen(item._id)}
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
                    <TableCell colSpan={5} align="center">
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
            count={filteredAddresses.length}
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
                Are you sure you want to delete this address entry? This action cannot be undone.
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
            autoHideDuration={3000}
            onClose={ handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={handleSnackbarClose} variant="filled" severity="success" sx={{ width: "100%" }}>
              Address deleted successfully!
            </Alert>
          </Snackbar>
        </Box>
      }
    />
  );
};

export default AddressControl;
