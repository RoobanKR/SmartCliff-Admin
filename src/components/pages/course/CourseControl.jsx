import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchCourse, deleteCourse, selectCourses } from "../../redux/slices/course/course";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

const CourseControl = () => {
  const dispatch = useDispatch();
  const [cookies, removeCookie] = useCookies(["token"]);

  const [deleteId, setDeleteId] = useState(null);
  const courses = useSelector(selectCourses);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
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
    dispatch(fetchCourse());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Course-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteCourse({ courseId: deleteId, token: cookies.token }))
      .then(() => {
        setOpenDialog(false);
        dispatch(fetchCourse()); // Refresh data after successful deletion
      });
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
            Course Control
          </Typography>
          <br></br>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Course Name
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Image
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses &&
                  courses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>{course.course_name}</TableCell>
                      <TableCell>
                        <img
                          src={course.images[0]}
                          alt={course.course_name}
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                      </TableCell>
                      <TableCell>{course.short_description}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(course._id)}
                          color="primary"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(course._id)}
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
          {/* Confirmation Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete this course?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={confirmDelete} variant="contained" color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default CourseControl;
