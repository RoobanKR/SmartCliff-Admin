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
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  deleteProgramFees,
  getAllProgramFees,
} from "../../../redux/slices/mca/programFees/programfees";
import { deleteOutcome, getAllOutcomes } from "../../../redux/slices/mca/outcome/outcome";

const OutcomeControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const outcomes = useSelector((state) => state.outcomes.outcomes);


  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getAllOutcomes());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Outcome-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteOutcome({outcomeId:deleteId}))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAllOutcomes());
      })
      .catch((error) => console.log("Error deleting program:", error));
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
           Outcomes Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Icon</TableCell>
                   <TableCell>Program</TableCell>
                  <TableCell>Action</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {outcomes &&
                  outcomes.map(
                    (
                        outcome // Add conditional check for programFees
                    ) => (
                      <TableRow key={outcome._id}>
                        <TableCell>{outcome.title}</TableCell>
                        <TableCell>
                          {" "}
                          {outcome.icon && (
                            <img
                              src={outcome.icon}
                              alt={outcome.name}
                              style={{ width: "50px", height: "50px" }}
                            />
                          )}{" "}
                        </TableCell>
                        <TableCell>{outcome.degree_program.program_name}</TableCell>

                        <TableCell>
                          <IconButton
                            onClick={() => handleEdit(outcome._id)}
                            color="primary"
                            aria-label="edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(outcome._id)}
                            color="error"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  )}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this program?
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

export default OutcomeControl;
