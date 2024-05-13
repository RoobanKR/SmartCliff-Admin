import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
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
  DialogActions,
  Button,
} from "@mui/material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllAdmissionProcess, deleteAdmission } from "../../../redux/slices/mca/admissionProcess/admissionProcess";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";

const AdmissionProcessControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { admissions } = useSelector((state) => state.admissionProcess);
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
    dispatch(getAllAdmissionProcess());
  }, [dispatch]);

  const [deleteId, setDeleteId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleEdit = (id) => {
    navigate(`/Admission_Process-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteAdmission(deleteId))
      .then(() => {
        dispatch(getAllAdmissionProcess());
        setDeleteId(null);
        setConfirmDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting admission process:", error);
        setDeleteId(null);
        setConfirmDialogOpen(false);
      });
  };
  

  const handleCancelDelete = () => {
    setDeleteId(null);
    setConfirmDialogOpen(false);
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
            Admission Process Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Program Name</TableCell>
                  <TableCell>Heading</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admissions.map((admission) => (
                  admission.admission.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{admission.degree_program.program_name}</TableCell>
                      <TableCell>{item.heading}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(admission._id)}
                          color="primary"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(admission._id)}
                          color="error"
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={confirmDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this admission process?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      }
    />
  );
};

export default AdmissionProcessControl;
