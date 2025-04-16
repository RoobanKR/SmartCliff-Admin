import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCareerOpportunities,
  deleteCareerOpportunity,
} from "../../redux/slices/careerOppertunities/careerOppertunities";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";
import { deleteBatch, fetchBatches } from "../../redux/slices/batch/batches";

const BatchControl = () => {
  const dispatch = useDispatch();
  const batches = useSelector(
    (state) => state.batches.batches
  );
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  useEffect(() => {
    dispatch(fetchBatches());
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
    navigate(`/Batch-edit/${id}`);
  };

  const handleConfirmDeleteOpen = (index) => {
    setConfirmDeleteOpen(true);
    setDeleteIndex(index);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteIndex(null);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const batchId = batches[deleteIndex]._id;
      dispatch(deleteBatch({batchId,token: cookies.token})) // Pass only batchId
        .then(() => {
          handleConfirmDeleteClose();
          dispatch(fetchBatches());
        })
        .catch((error) => {
          console.error("Error deleting career batch: ", error);
        });
    }
  };
  
  return (
    <LeftNavigationBar
      Content={
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Typography
            gutterBottom
            variant="h4"
            textAlign={"center"}
            component="div"
            fontFamily={"Serif"}
          >
            Batch Control
          </Typography>
          <br />
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Category Name
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Course Name
                  </TableCell>
                  
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Branch
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Image
                  </TableCell>
                  
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((batch, index) => (
                  <TableRow key={index}>
                    <TableCell>{batch.category.category_name}</TableCell>
                    <TableCell>{batch.course.course_name}</TableCell>

                    
                    <TableCell>{batch.branch}</TableCell>
                    <TableCell>
                      <img
                        src={batch.image}
                        alt={batch.company_name}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(batch._id)}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleConfirmDeleteOpen(index)}
                        color="error"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Delete Confirmation Dialog */}
          <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this career batch?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmDeleteClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default BatchControl;
