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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  FilterList as FilterIcon
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
import { getAPIURL } from "../../../utils/utils";

const CourseControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const courses = useSelector(selectCourses) || [];
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Extract unique categories from courses
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set();
    courses.forEach(course => {
      if (course.category && course.category.category_name) {
        uniqueCategories.add(course.category.category_name);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [courses]);

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
        `${getAPIURL()}/update/course/isopen/${courseId}`,
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

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

  const filteredCourses = courses.filter(course =>
    course && (
      (course.course_name && course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.short_description && course.short_description.toLowerCase().includes(searchTerm.toLowerCase())))
      &&
      (categoryFilter === '' || 
       (course.category && course.category.category_name === categoryFilter))
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
                fontWeight: 700,
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

            {/* Search and Filter Section */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="category-filter-label">Category</InputLabel>
                  <Select
                    labelId="category-filter-label"
                    id="category-filter"
                    value={categoryFilter}
                    onChange={handleCategoryFilterChange}
                    input={<OutlinedInput label="Category" />}
                    sx={{ backgroundColor: 'background.paper' }}
                    startAdornment={<FilterIcon color="action" sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="">
                      <em>All Categories</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={clearFilters}
                  disabled={!searchTerm && !categoryFilter}
                  sx={{
                    borderColor: theme.palette.grey[400],
                    color: theme.palette.text.primary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
              <Grid item xs={6} md={3} sx={{ textAlign: { xs: 'right', md: 'right' } }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddCourse}
                  fullWidth
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark
                    },
                    whiteSpace: 'nowrap',
                  }}
                >
                  Add New Course
                </Button>
              </Grid>
            </Grid>
            
            {/* Active Filters Display */}
            {(searchTerm || categoryFilter) && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {searchTerm && (
                  <Chip 
                    label={`Search: ${searchTerm}`} 
                    onDelete={() => setSearchTerm('')} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
                {categoryFilter && (
                  <Chip 
                    label={`Category: ${categoryFilter}`} 
                    onDelete={() => setCategoryFilter('')} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
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
                      <>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category</TableCell>
                      </>
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
                            <>
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
                              <TableCell>
                                {course.category && course.category.category_name ? (
                                  <Chip 
                                    label={course.category.category_name}
                                    size="small"
                                    color="primary"
                                    onClick={() => setCategoryFilter(course.category.category_name)}
                                    sx={{ 
                                      cursor: 'pointer',
                                      backgroundColor: categoryFilter === course.category.category_name ? 
                                        theme.palette.primary.main : 
                                        theme.palette.primary.light,
                                      color: 'white'
                                    }}
                                  />
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    No category
                                  </Typography>
                                )}
                              </TableCell>
                            </>
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
                              <Tooltip title="View">
                                <IconButton
                                  onClick={() => handleView(course._id)}
                                  color="info"
                                  size={isMobile ? 'small' : 'medium'}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
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
                      <TableCell colSpan={isMobile ? 4 : 6} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <SchoolIcon color="disabled" sx={{ fontSize: 60, mb: 1 }} />
                          <Typography variant="h6" color="text.secondary">
                            No courses found
                          </Typography>
                          {(searchTerm || categoryFilter) && (
                            <Typography variant="body2" color="text.secondary">
                              Try adjusting your search filters
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