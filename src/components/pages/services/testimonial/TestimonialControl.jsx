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
import { deleteTestimonial, getAllTestimonial } from "../../../redux/slices/services/testimonial/Testimonial";

const TestimonialControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const testimonials = useSelector((state) => state.testimonial.testimonials);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getAllTestimonial());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Service_Testimonial-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTestimonial(deleteId))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAllTestimonial());
      })
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
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: 'Merriweather, serif',
                fontWeight: 700, textAlign: 'center',
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 3,
                mt: -4,
                "&::before": {
                  content: '""',
                  width: "28px",
                  height: "5px",
                  display: "block",
                  position: "absolute",
                  bottom: "3px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#747474",
                },
                "&::after": {
                  content: '""',
                  width: "100px",
                  height: "1px",
                  display: "block",
                  position: "relative",
                  marginTop: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#747474",
                },
              }}
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
                  <TableCell>Service</TableCell>
                  <TableCell>Stack</TableCell>
                  <TableCell>Action</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {testimonials &&
                  testimonials.map((testimonial) => (
                    <TableRow key={testimonial._id}>
                      <TableCell>{testimonial.name}</TableCell>
                      <TableCell>
                        {" "}
                        {testimonial.image && (
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            style={{ width: "50px", height: "50px" }}
                          />
                        )}{" "}
                      </TableCell>
                      <TableCell>{testimonial.review}</TableCell>
                      <TableCell>{testimonial.service.title}</TableCell>
                      <TableCell>{testimonial.stack.stack}</TableCell>

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

export default TestimonialControl;
