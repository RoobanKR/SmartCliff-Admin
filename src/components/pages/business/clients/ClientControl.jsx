import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DialogActions,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button as MuiButton,
  Snackbar,
  Alert,
  TextField,
  Grid,
  TablePagination,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
  Button,
  Box,
} from "@mui/material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  deleteClient,
  getAllClient,
} from "../../../redux/slices/services/client/Client";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const ClientControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients, loading } = useSelector((state) => state.clients);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getAllClient());
  }, [dispatch]);

  const handleEdit = (clientId) => {
    navigate(`/business/Client-edit/${clientId}`);
  };

  const handleConfirmDeleteOpen = (id) => {
    setConfirmDeleteOpen(true);
    setDeleteId(id);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const handleDelete = () => {
    dispatch(deleteClient(deleteId)).then(() => {
      dispatch(getAllClient());
      handleConfirmDeleteClose();
      setSnackbarOpen(true);
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredClients = (clients || []).filter(
    (client) =>
      client &&
      client.name &&
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            Client Control
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search Clients..."
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
                onClick={() => navigate("/business/Client-add")}
                startIcon={<AddIcon />}
              >
                Add New Client
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} elevation={3}>
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
                    Name
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Image
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Type
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
                {filteredClients.length > 0 ? (
                  filteredClients
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((client) => (
                      <TableRow key={client._id}>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>
                          {client.image && (
                            <img
                              src={client.image}
                              alt={client.name}
                              style={{ width: "50px", height: "50px" }}
                            />
                          )}
                        </TableCell>
                        <TableCell>{client.type}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="Edit">
                              <Button
                                onClick={() => handleEdit(client._id)}
                                color="primary"
                                variant="outlined"
                              >
                                <EditIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Button
                                onClick={() =>
                                  handleConfirmDeleteOpen(client._id)
                                }
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
            count={filteredClients.length}
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
                minWidth: isMobile ? "90%" : 400,
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: theme.palette.error.light,
                color: "white",
                fontWeight: 600,
              }}
            >
              Confirm Deletion
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="body1">
                Are you sure you want to delete this client? This action cannot
                be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleConfirmDeleteClose}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary,
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
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%", fontWeight: 500 }}
            >
              Client deleted successfully!
            </Alert>
          </Snackbar>
        </Box>
      }
    />
  );
};

export default ClientControl;
