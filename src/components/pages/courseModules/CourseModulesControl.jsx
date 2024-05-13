import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCourseModules,
  deleteCourseModule,
} from "../../redux/slices/courseModule/courseModule";
import { useNavigate } from "react-router-dom";

const CourseModulesControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courseModules = useSelector(
    (state) => state.courseModule.courseModules
  );
  useEffect(() => {
    dispatch(getAllCourseModules());
  }, [dispatch]);

  const [deleteIndex, setDeleteIndex] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEdit = (id) => {
    navigate(`/courseModule-edit/${id}`);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteCourseModule({ moduleId: courseModules[deleteIndex]._id }))
      .then(() => {
        dispatch(getAllCourseModules());
        setOpenDeleteDialog(false);
      })
      .catch((error) => console.error("Error deleting module:", error));
  };

  console.log("courseModules", courseModules);
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
            Course Module Control
          </Typography>
          <br></br>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Heading
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courseModules.map((courseModule, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {courseModule.modules.map((module, moduleIndex) => (
                        <Typography key={`${index}-${moduleIndex}`}>
                          {`T${index + 1}: ${module.title || "N/A"}`}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      {courseModule.modules.map((module, moduleIndex) => (
                        <Typography
                          key={`${index}-${moduleIndex}`}
                          variant="body1"
                        >
                          {`H${moduleIndex + 1}: ${
                            module.sub_title[0]?.heading || "N/A"
                          } - (${
                            module.sub_title[0]?.duration || "N/A"
                          } hours)`}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(courseModule._id)}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(index)}
                        color="error"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>{" "}
            </Table>
          </TableContainer>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Are you sure you want to delete this module?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default CourseModulesControl;
