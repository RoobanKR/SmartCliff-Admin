import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,

} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { deleteProgramMentor, getAllProgramMentors } from "../../../redux/slices/mca/programMentor/programMentor";
import { useNavigate } from "react-router-dom";

const ProgramMentorControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const programMentors = useSelector((state) => state.programMentor.programMentor);
  const [openDialog, setOpenDialog] = useState(false);
  const [mentorId, setDeleteId] = useState(null);


  useEffect(() => {
    dispatch(getAllProgramMentors());
  }, [dispatch]);
  const handleEdit = (id) => {
    navigate(`/Program_Mentor-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProgramMentor(mentorId))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAllProgramMentors());
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
        <Container component="main" maxWidth="xl">
          <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
            <Typography
              variant="h4"
              align="center"
              style={{ fontFamily: "Serif" }}
            >
              Program Mentor List
            </Typography>
            <br></br>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ backgroundColor: "#0C2233", color: "white" }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#0C2233", color: "white" }}
                    >
                      Designation
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#0C2233", color: "white" }}
                    >
                      Program
                    </TableCell>

                    <TableCell
                      style={{ backgroundColor: "#0C2233", color: "white" }}
                    >
                      Image
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#0C2233", color: "white" }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    programMentors.map((mentor) => (
                      <TableRow key={mentor._id}>
                        <TableCell>{mentor.name}</TableCell>
                        <TableCell>{mentor.designation}</TableCell>
                        <TableCell>{mentor?.degree_program?.program_name}</TableCell>

                        <TableCell>
                          {mentor.image && (
                            <img
                              src={mentor.image}
                              alt={mentor.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEdit(mentor._id)}
                            color="primary"
                            aria-label="edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(mentor._id)}
                            color="error"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  }
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
          </Paper>
        </Container>
      }
    />
  );
};

export default ProgramMentorControl;
