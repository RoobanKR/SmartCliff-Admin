import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  TablePagination,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
} from "../../redux/slices/category/category";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

const CategoryControl = () => {
  const dispatch = useDispatch();
  const categoryData = useSelector((state) => state.category.categoryData);
  const status = useSelector((state) => state.category.status);
  const error = useSelector((state) => state.category.error);
  const loading = status === "loading";
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // States for delete confirmation
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  
  // States for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies, dispatch, navigate]);

  const handleEdit = (id) => {
    navigate(`/category-edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setCategoryIdToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryIdToDelete) {
      dispatch(
        deleteCategory({ categoryId: categoryIdToDelete, token: cookies.token })
      )
        .then(() => {
          setDeleteConfirmationOpen(false);
          setSnackbarOpen(true);
          dispatch(fetchCategories());
        })
        .catch((error) => {
          console.error("Error deleting category: ", error);
        });
    }
  };

  const handleDeleteCancel = () => {
    setCategoryIdToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter the categories based on search term
  const filteredCategories = categoryData.filter(
    (category) =>
      category &&
      category.category_name &&
      category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Category Management Control
          </Typography>

          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search Categories..."
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
                onClick={() => navigate("/category-add")}
                startIcon={<AddIcon />}
              >
                Add Category
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  {["Category Name", "Image", "Description", "Actions"].map((head) => (
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
                {filteredCategories.length > 0 ? (
                  filteredCategories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category) => (
                      <TableRow key={category._id}>
                        <TableCell sx={{ textAlign: "center" }}>{category.category_name}</TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <img
                            src={category.image}
                            alt={category.category_name}
                            style={{ maxWidth: "50px", maxHeight: "50px" }}
                          />
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>{category.description}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Edit">
                              <Button
                                onClick={() => handleEdit(category._id)}
                                color="primary"
                                variant="outlined"
                              >
                                <EditIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Button
                                onClick={() => handleDeleteClick(category._id)}
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
                      <Typography>No categories found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCategories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* Confirmation Dialog */}
          <Dialog
            open={deleteConfirmationOpen}
            onClose={handleDeleteCancel}
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
                Are you sure you want to delete this category? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleDeleteCancel}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary
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
                  '&:hover': {
                    backgroundColor: theme.palette.error.dark
                  }
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Success Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
              Category successfully deleted!
            </Alert>
          </Snackbar>
        </Box>
      }
    />
  );
};

export default CategoryControl;