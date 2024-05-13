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
} from "@mui/material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  deleteKeyElements,
  getAllKeyElements,
} from "../../../redux/slices/business/keyElements/keyElements";

const KeyElementsControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const keyElements = useSelector((state) => state.keyElements.keyElements);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getAllKeyElements());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/key_elements-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteKeyElements(deleteId))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAllKeyElements());
      })
      .catch((error) => console.log("Error deleting keyElements:", error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  return (
    <LeftNavigationBar
      Content={
        <>
          <Typography
            gutterBottom
            variant="h4"
            align="center"
            component="div"
            style={{ fontFamily: "Serif" }}
          >
            Key Elements Fees Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Icon</TableCell>
                  <TableCell>Action</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {keyElements &&
                  keyElements.map((All_Key_Elements) => (
                    <TableRow key={All_Key_Elements._id}>
                      <TableCell>{All_Key_Elements.title}</TableCell>
                      <TableCell>
                        {All_Key_Elements.icon && (
                          <img
                            src={All_Key_Elements.icon}
                            alt={All_Key_Elements.name}
                            style={{ width: "50px", height: "50px" }}
                          />
                        )}
                      </TableCell>

                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(All_Key_Elements._id)} // Pass All_Key_Elements._id
                          color="primary"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(All_Key_Elements._id)} // Pass All_Key_Elements._id
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
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this keyElements?
            </DialogContent>
            <DialogActions>
              <MuiButton onClick={handleCloseDialog}>Cancel</MuiButton>
              <MuiButton
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
              >
                Delete
              </MuiButton>
            </DialogActions>
          </Dialog>
        </>
      }
    />
  );
};

export default KeyElementsControl;
