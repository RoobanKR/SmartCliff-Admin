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
import { fetchOurPrograms, deleteOurProgram } from "../../../redux/slices/mca/ourProgram/ourProgram";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import { useCookies } from "react-cookie";

const OurProgramControl = () => {
  const dispatch = useDispatch();
  const { ourProgram, loading, error } = useSelector((state) => state.ourProgram);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [cookies, removeCookie] = useCookies(["token"]);

  useEffect(() => {
     if (!cookies.token || cookies.token === undefined) {
       dispatch(resetSignIn());
       navigate("/");
     } else {
       dispatch(userVerify({ token: cookies.token }));
       console.log("user verify called");
     }
   }, [cookies]);
 
 
  useEffect(() => {
    dispatch(fetchOurPrograms());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Our_Program-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteOurProgram(deleteId)) // Pass only the ID, not an object
      .then(() => {
        setOpenDialog(false);
        dispatch(fetchOurPrograms());
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
            Our Program Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Degree Program</TableCell>

                  <TableCell>Icon</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ourProgram.map((program) => (
                  <TableRow key={program._id}>
                    <TableCell>{program.title}</TableCell>
                    <TableCell>{program.description}</TableCell>
                    <TableCell>{program.degree_program ? program.degree_program.program_name : "Unknown Program"}</TableCell>

                    <TableCell>
                      {program.icon && (
                        <img
                          src={program.icon}
                          alt={`Icon for ${program.title}`}
                          style={{ width: 50, height: 50, marginRight: 5 }}
                        />
                      )}
                    </TableCell>
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
                ))}
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
              <MuiButton onClick={handleConfirmDelete} variant="contained" color="error">
                Delete
              </MuiButton>
            </DialogActions>
          </Dialog>
        </>
      }
    />
  );
};

export default OurProgramControl;
