// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Typography,
//   Box,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Switch,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import LeftNavigationBar from "../../navbars/LeftNavigationBar";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchCourse,
//   deleteCourse,
//   selectCourses,
// } from "../../redux/slices/course/course";
// import { useDispatch, useSelector } from "react-redux";
// import { useCookies } from "react-cookie";
// import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

// const CourseControl = () => {
//   const dispatch = useDispatch();
//   const [cookies, removeCookie] = useCookies(["token"]);

//   const [deleteId, setDeleteId] = useState(null);
//   const courses = useSelector(selectCourses);
//   const [openDialog, setOpenDialog] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!cookies.token || cookies.token === undefined) {
//       dispatch(resetSignIn());
//       navigate("/");
//     } else {
//       dispatch(userVerify({ token: cookies.token }));
//       console.log("user verify called");
//     }
//   }, [cookies]);

//   useEffect(() => {
//     dispatch(fetchCourse());
//   }, [dispatch]);

//   const handleEdit = (id) => {
//     navigate(`/Course-edit/${id}`);
//   };

//   const handleDelete = (id) => {
//     setDeleteId(id);
//     setOpenDialog(true);
//   };

//   const confirmDelete = () => {
//     dispatch(deleteCourse({ courseId: deleteId, token: cookies.token })).then(
//       () => {
//         setOpenDialog(false);
//         dispatch(fetchCourse()); // Refresh data after successful deletion
//       }
//     );
//   };

//   const toggleCourseStatus = async (courseId, currentStatus) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5353/update/course/isopen/${courseId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${cookies.token}`,
//           },
//         }
//       );
//       console.log(response.data);
//       dispatch(fetchCourse()); // Refresh the course list after toggling
//     } catch (error) {
//       console.error("Error toggling course status:", error);
//     }
//   };

//   return (
//     <LeftNavigationBar
//       Content={
//         <Box
//           display="flex"
//           flexDirection="column"
//           alignItems="center"
//           justifyContent="center"
//           minHeight="100vh"
//         >
//           <Typography
//             gutterBottom
//             variant="h4"
//             textAlign={"center"}
//             component="div"
//             fontFamily={"Serif"}
//           >
//             Course Control
//           </Typography>
//           <br />
//           <TableContainer component={Paper} elevation={3}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell
//                     style={{ backgroundColor: "#0C2233", color: "white" }}
//                   >
//                     Course Name
//                   </TableCell>
//                   <TableCell
//                     style={{ backgroundColor: "#0C2233", color: "white" }}
//                   >
//                     Image
//                   </TableCell>
//                   <TableCell
//                     style={{ backgroundColor: "#0C2233", color: "white" }}
//                   >
//                     Description
//                   </TableCell>
//                   <TableCell
//                     style={{ backgroundColor: "#0C2233", color: "white" }}
//                   >
//                     Status
//                   </TableCell>
//                   <TableCell
//                     style={{ backgroundColor: "#0C2233", color: "white" }}
//                   >
//                     Actions
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {courses &&
//                   courses.map((course, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{course.course_name}</TableCell>
//                       <TableCell>
//                         <img
//                           src={course.image}
//                           alt={course.course_name}
//                           style={{ maxWidth: "100px", maxHeight: "100px" }}
//                         />
//                       </TableCell>
//                       <TableCell>{course.short_description}</TableCell>
//                       <TableCell>
//                         <Switch
//                           checked={course.isOpen} // Use isOpen from your data
//                           onChange={() => toggleCourseStatus(course._id, course.isOpen)}
//                           color="primary"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <IconButton
//                           onClick={() => handleEdit(course._id)}
//                           color="primary"
//                           aria-label="edit"
//                         >
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton
//                           onClick={() => handleDelete(course._id)}
//                           color="error"
//                           aria-label="delete"
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           {/* Confirmation Dialog */}
//           <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//             <DialogTitle>Delete Course</DialogTitle>
//             <DialogContent>
//               <Typography>
//                 Are you sure you want to delete this course?
//               </Typography>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//               <Button onClick={confirmDelete} variant="contained" color="error">
//                 Delete
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       }
//     />
//   );
// };

// export default CourseControl;


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
  Switch,
  TextField,
  TablePagination,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Grid,
  Tooltip,
  CircularProgress
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  School as SchoolIcon
} from "@mui/icons-material";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useNavigate } from "react-router-dom";
import {
  fetchCourse,
  deleteCourse,
  selectCourses,
} from "../../redux/slices/course/course";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";
import axios from "axios";

const CourseControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const courses = useSelector(selectCourses) || [];
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!cookies.token) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies, dispatch, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCourse());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Course-edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/Course-view/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteCourse({ courseId: deleteId, token: cookies.token }))
      .then(() => {
        dispatch(fetchCourse());
        setConfirmDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
      });
  };

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
    setDeleteId(null);
  };

  const handleAddCourse = () => {
    navigate('/Course-add');
  };

  const toggleCourseStatus = async (courseId, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:5353/update/course/isopen/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      dispatch(fetchCourse());
    } catch (error) {
      console.error("Error toggling course status:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCourses = courses.filter(course =>
    course && (
      (course.course_name && course.course_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.short_description && course.short_description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  if (loading) {
    return (
      <LeftNavigationBar
        Content={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress size={60} thickness={4} />
          </Box>
        }
      />
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontWeight: 700, textAlign: 'center',
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 3,
                mt: -3,
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
              Course Management
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search courses..."
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                  }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddCourse}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark
                    },
                    whiteSpace: 'nowrap',
                    width: { xs: '100%', md: 'auto' }
                  }}
                >
                  Add New Course
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Table Section */}
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Course</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Image</TableCell>
                    {!isMobile && (
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
                    )}
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((course) => (
                        <TableRow
                          key={course._id}
                          hover
                          sx={{
                            '&:nth-of-type(odd)': {
                              backgroundColor: theme.palette.action.hover
                            },
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight={500}>
                              {course.course_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Avatar
                              src={course.image}
                              alt={course.course_name}
                              variant="rounded"
                              sx={{
                                width: 60,
                                height: 60,
                                backgroundColor: course.image ? 'transparent' : theme.palette.grey[300]
                              }}
                            >
                              {!course.image && <SchoolIcon />}
                            </Avatar>
                          </TableCell>
                          {!isMobile && (
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {course.short_description || 'No description'}
                              </Typography>
                            </TableCell>
                          )}
                          <TableCell>
                            <Tooltip title={course.isOpen ? "Active" : "Inactive"}>
                              <Switch
                                checked={course.isOpen}
                                onChange={() => toggleCourseStatus(course._id, course.isOpen)}
                                color="primary"
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>

                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() => handleEdit(course._id)}
                                  color="primary"
                                  size={isMobile ? 'small' : 'medium'}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => handleDelete(course._id)}
                                  color="error"
                                  size={isMobile ? 'small' : 'medium'}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 4 : 5} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <SchoolIcon color="disabled" sx={{ fontSize: 60, mb: 1 }} />
                          <Typography variant="h6" color="text.secondary">
                            No courses found
                          </Typography>
                          {searchTerm && (
                            <Typography variant="body2" color="text.secondary">
                              No results for "{searchTerm}"
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredCourses.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredCourses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                  '& .MuiTablePagination-toolbar': {
                    paddingLeft: 2,
                    paddingRight: 1
                  }
                }}
              />
            )}
          </Paper>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={confirmDialogOpen}
            onClose={handleCloseDialog}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: isMobile ? '90%' : 400
              }
            }}
          >
            <DialogTitle sx={{
              backgroundColor: theme.palette.error.light,
              color: 'white',
              fontWeight: 600
            }}>
              Confirm Deletion
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="body1">
                Are you sure you want to delete this course? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
                sx={{
                  backgroundColor: theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: theme.palette.error.dark
                  }
                }}
              >
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