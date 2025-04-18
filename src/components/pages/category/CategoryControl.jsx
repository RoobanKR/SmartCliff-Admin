import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

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
  }, [cookies]);

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

  return (
    <LeftNavigationBar
      Content={
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: "Merriweather, serif",
                fontWeight: 700,
                textAlign: "center",
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mt: 2,
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
          </Box>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#1976d2", color: "white" }}
                  >
                    Category Name
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#1976d2", color: "white" }}
                  >
                    Image
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#1976d2", color: "white" }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#1976d2", color: "white" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryData.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.category_name}</TableCell>
                    <TableCell>
                      <img
                        src={category.image}
                        alt={category.category_name}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleEdit(category._id)}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        sx={{ mt: 2 }}
                        variant="outlined"
                        onClick={() => handleDeleteClick(category._id)}
                        color="error"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Confirmation Dialog */}
          <Dialog open={deleteConfirmationOpen} onClose={handleDeleteCancel}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this category?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default CategoryControl;
