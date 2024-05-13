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

const ProgramFeesControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const programFees = useSelector((state) => state.programFees.programFees);
  const loading = useSelector((state) => state.programFees.loading);
  const error = useSelector((state) => state.programFees.error);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getAllProgramFees());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Program_Fees-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProgramFees(deleteId))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAllProgramFees());
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
            Program Fees Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Icon</TableCell>
                   <TableCell>Program</TableCell>
                  <TableCell>Action</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {programFees &&
                  programFees.map(
                    (
                      program // Add conditional check for programFees
                    ) => (
                      <TableRow key={program._id}>
                        <TableCell>{program.title}</TableCell>
                        <TableCell>{program.description}</TableCell>
                        <TableCell>
                          {" "}
                          {program.icon && (
                            <img
                              src={program.icon}
                              alt={program.name}
                              style={{ width: "50px", height: "50px" }}
                            />
                          )}{" "}
                        </TableCell>
                        <TableCell>{program?.degree_program?.program_name}</TableCell>

                        <TableCell>
                          <IconButton
                            onClick={() => handleEdit(program._id)}
                            color="primary"
                            aria-label="edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(program._id)}
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

export default ProgramFeesControl;
