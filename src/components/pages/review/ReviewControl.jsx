import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
  Tooltip,
  Grid,
  TextField,
  TablePagination,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Avatar
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Search as SearchIcon,
  CloudUpload as UploadIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { deleteReview, getAllReview } from "../../redux/slices/review/review";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useCookies } from "react-cookie";

const ReviewControl = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const allReviews = useSelector((state) => state.reviews.reviews) || [];
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllReview());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const filteredReviews = allReviews.filter(
    (review) =>
      review && review.name &&
      review.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (reviewId) => {
    navigate(`/Review-edit/${reviewId}`);
  };

  const handleConfirmDeleteOpen = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deleteReview({ reviewId: deleteId, token: cookies.token }))
        .then(() => {
          dispatch(getAllReview());
          handleConfirmDeleteClose();
        })
        .catch((error) => {
          console.error("Error deleting Review:", error);
          handleConfirmDeleteClose();
        });
    } else {
      console.error("Invalid reviewId");
    }
  };

  const truncateText = (text, wordLimit) => {
    if (!text) return "N/A";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        <Box sx={{ p: isMobile ? 1 : 3 }}>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontWeight: 700,
                textAlign: "center",
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
              Testimonials Overview
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search by name..."
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
                  onClick={() => navigate("/review-add")}
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
                  Add New Testimonial
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
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>Profile</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>Ratings</TableCell>
                    {!isMobile && (
                      <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>Description</TableCell>
                    )}
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReviews.length > 0 ? (
                    filteredReviews
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((review) => (
                        review && (
                          <TableRow
                            key={review._id}
                            hover
                            sx={{
                              '&:nth-of-type(odd)': {
                                backgroundColor: theme.palette.action.hover
                              },
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                          >
                            <TableCell align="center">
                              <Avatar
                                src={review.profile}
                                alt={review.name || 'Profile'}
                                sx={{
                                  width: 50,
                                  height: 50,
                                  margin: '0 auto',
                                  backgroundColor: review.profile ? 'transparent' : theme.palette.grey[300]
                                }}
                              >
                                {!review.profile && review.name?.charAt(0)}
                              </Avatar>
                            </TableCell>
                            <TableCell align="center">
                              <Typography fontWeight={500}>
                                {review.name || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography>
                                {review.ratings || 'N/A'}
                              </Typography>
                            </TableCell>
                            {!isMobile && (
                              <TableCell align="center">
                                <Tooltip
                                  title={
                                    <Typography sx={{ fontSize: "1rem", color: "white" }}>
                                      {review.review || 'No review provided'}
                                    </Typography>
                                  }
                                  arrow
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        backgroundColor: "black",
                                        fontSize: "1rem",
                                        padding: "10px 12px",
                                      },
                                    },
                                    arrow: {
                                      sx: {
                                        color: "black",
                                      },
                                    },
                                  }}
                                >
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
                                    {truncateText(review.review, 5)}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                            )}
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <Tooltip title="Edit">
                                  <Button
                                    onClick={() => handleEdit(review._id)}
                                    color="primary"
                                    size={isMobile ? 'small' : 'medium'}
                                    variant="outlined"
                                  >
                                    <EditIcon />
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <Button
                                    onClick={() => handleConfirmDeleteOpen(review._id)}
                                    color="error"
                                    size={isMobile ? 'small' : 'medium'}
                                    variant="outlined"
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 4 : 5} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <UploadIcon color="disabled" sx={{ fontSize: 60, mb: 1 }} />
                          <Typography variant="h6" color="text.secondary">
                            No testimonials found
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

            {filteredReviews.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredReviews.length}
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

          <Dialog
            open={confirmDeleteOpen}
            onClose={handleConfirmDeleteClose}
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
                Are you sure you want to delete this testimonial? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleConfirmDeleteClose}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
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

export default ReviewControl;