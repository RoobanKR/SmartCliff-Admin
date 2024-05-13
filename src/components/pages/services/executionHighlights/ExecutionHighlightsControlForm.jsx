import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  deleteExecutionHighlights,
  fetchExecutionHighlights,
} from "../../../redux/slices/services/executionHighlights/Execution_Highlights";

const ExecutionHighlightsControl = () => {
  const dispatch = useDispatch();
  const executionHighlights = useSelector(
    (state) => state.executionHighlights.executionHighlights
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchExecutionHighlights())
      .then(() => setLoading(false)) // Set loading to false once data is fetched
      .catch(() => setLoading(false)); // Also set loading to false in case of error
  }, [dispatch]);

  if (!executionHighlights) {
    return <div>Loading...</div>;
  }

  const handleEdit = (executionHighlightId) => {
    navigate(`/Execution_Highlights-edit/${executionHighlightId}`);
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
      const executionHighlightId = executionHighlights[deleteIndex]._id;
      dispatch(deleteExecutionHighlights(executionHighlightId))
        .then(() => {
          dispatch(fetchExecutionHighlights());
          handleConfirmDeleteClose();
        })
        .catch((error) => {
          console.error("Error deleting executiveHighlights:", error);
          handleConfirmDeleteClose();
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
            Execution Highlights Control
          </Typography>
          <br />
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Stack Name
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
                {executionHighlights.map((executionHighlight, index) => (
                  <TableRow key={index}>
                    <TableCell>{executionHighlight.stack}</TableCell>
                    <TableCell>
                      <img
                        src={executionHighlight.image}
                        alt={executionHighlight.stack}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(executionHighlight._id)}
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
          <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this career opportunity?
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

export default ExecutionHighlightsControl;
