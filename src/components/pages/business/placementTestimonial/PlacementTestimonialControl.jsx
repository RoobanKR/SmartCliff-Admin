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
  deleteTestimonial,
  getAllTestimonial,
  getAllTestimonials,
} from "../../../redux/slices/business/placementTestimonial/placementTestimonial";

const PlacementControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const placementTestimonials = useSelector(
    (state) => state.placementTestimonial.placementTestimonials
  );
  console.log("placementTestimonials", placementTestimonials);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getAllTestimonials());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/placement_testimonial-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTestimonial(deleteId))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAllTestimonials());
      })
      .catch((error) => console.log("Error deleting placement:", error));
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
            Testimonial Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Review</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {placementTestimonials.map((testimonial) => (
                  <TableRow key={testimonial._id}>
                    <TableCell>{testimonial.name}</TableCell>
                    <TableCell>
                      {testimonial.image && (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          style={{ width: "50px", height: "50px" }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{testimonial.review}</TableCell>
                    <TableCell>{testimonial.designation}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(testimonial._id)}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(testimonial._id)}
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
              Are you sure you want to delete this testimonial?
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

export default PlacementControl;
