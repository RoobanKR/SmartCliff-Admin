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
import { getAllSemesters, deleteSemester } from "../../../redux/slices/mca/semester/semester";
import { useNavigate } from "react-router-dom";

const SemesterControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const semesters = useSelector((state) => state.semester.semesters);
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch all semesters when component mounts
    dispatch(getAllSemesters());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Semester-edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteSemester(deleteId)).then(() => {
        dispatch(getAllSemesters()); // Fetch all semesters again after successful deletion
        setOpenDialog(false); // Close the dialog
      });
    }
  };
  

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setOpenDialog(false);
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
            Semester Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>heading</TableCell>
                  <TableCell>inner_heading</TableCell>
                  <TableCell>Icon</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {semesters.map((semester) => (
                  <TableRow key={semester._id}>
                    <TableCell>{semester.description}</TableCell>
                    <TableCell>
                      {semester.semester.map((item) => (
                        <div key={item._id}>
                          <p>{item.heading}</p>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {semester.semester.map((submains) =>
                        submains.submain.map((item) => (
                          <Typography key={item._id}>
                            {item.inner_heading}
                          </Typography>
                        ))
                      )}
                    </TableCell>
                    <TableCell>
                      {semester.semester.map((item) => (
                        <img
                          key={item._id}
                          src={item.icon}
                          alt="Icon"
                          style={{
                            width: "50px",
                            height: "50px",
                            marginRight: "5px",
                          }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(semester._id)}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(semester._id)}
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
          <Dialog open={openDialog} onClose={handleDeleteCancel}>
            <DialogTitle>Delete Semester</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this semester?
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
        </>
      }
    />
  );
};

export default SemesterControl;
