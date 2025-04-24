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
  Tooltip,
  TextField,
  TablePagination,
  useTheme,
  useMediaQuery,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useNavigate } from "react-router-dom";
import {
  deleteHomeServiceCount,
  getAllHomeServicesCount,
} from "../../../redux/slices/home/homeServiceCount/homeServiceCount";
import { Delete, Edit } from "@mui/icons-material";

const HomeServiceCountControlPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { homeServices, loading, error } = useSelector(
    (state) => state.homeServices
  );
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(getAllHomeServicesCount());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/home/service-count-edit/${id}`);
  };

  const handleDelete = async (id) => {
    setServiceIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (serviceIdToDelete) {
      try {
        const resultAction = await dispatch(
          deleteHomeServiceCount(serviceIdToDelete)
        );

        // Extract a safe message to display
        let successMessage = "Home service count deleted successfully";
        if (resultAction.payload) {
          if (typeof resultAction.payload === "string") {
            successMessage = resultAction.payload;
          } else if (
            typeof resultAction.payload === "object" &&
            resultAction.payload.message
          ) {
            if (typeof resultAction.payload.message === "string") {
              successMessage = resultAction.payload.message;
            }
          }
        }

        setSnackbar({
          open: true,
          message: successMessage,
          severity: "success",
        });

        // Refresh the list after deletion
        dispatch(getAllHomeServicesCount());
      } catch (error) {
        console.error("Error deleting home service count:", error);

        // Create a safe error message string
        let errorMessage = "Failed to delete home service count";

        if (error) {
          if (typeof error === "string") {
            errorMessage = error;
          } else if (typeof error === "object") {
            if (typeof error.message === "string") {
              errorMessage = error.message;
            } else if (error.response?.data) {
              const data = error.response.data;
              if (typeof data === "string") {
                errorMessage = data;
              } else if (typeof data === "object") {
                if (typeof data.message === "string") {
                  errorMessage = data.message;
                } else if (
                  data.errorMessage &&
                  typeof data.errorMessage === "string"
                ) {
                  errorMessage = data.errorMessage;
                }
              }
            }
          }
        }

        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
    }
    setDeleteDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const filteredHomeServices = homeServices.filter(
    (service) =>
      service.service &&
      service.service.toLowerCase().includes(searchTerm.toLowerCase())
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
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ p: isMobile ? 1 : 3 }}>
          {/* Header Section */}
          <Box sx={{ mb: 4, mt: 2 }}>
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
              Execution Count Panel
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search home services..."
                  InputProps={{
                    startAdornment: (
                      <SearchIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 1,
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
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/home/service-count-add")}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    whiteSpace: "nowrap",
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  Add Execution Count
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Table Section */}
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: theme.palette.primary.main }}
                  >
                    <TableCell sx={{ color: "white", fontWeight: 600, textAlign: "center" }}>
                      Count
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600, textAlign: "center" }}>
                      Service
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600, textAlign: "center" }}>
                      Slug
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", fontWeight: 600, textAlign: "center" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHomeServices.length > 0 ? (
                    filteredHomeServices
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((service) => (
                        <TableRow key={service._id}>
                          <TableCell sx={{ textAlign: "center" }}>{service.count}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{service.service}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{service.slug}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Button
                              variant="outlined"
                              onClick={() => handleEdit(service._id)}
                            >
                              <Edit />
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(service._id)}
                              sx={{ ml: 1 }}
                            >
                              <Delete />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                          No home service counts found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredHomeServices.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredHomeServices.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                  "& .MuiTablePagination-toolbar": {
                    paddingLeft: 2,
                    paddingRight: 1,
                  },
                }}
              />
            )}
          </Paper>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
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
                Are you sure you want to delete this home service count? This
                action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
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
        </Box>
      }
    />
  );
};

export default HomeServiceCountControlPage;
