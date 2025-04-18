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
  IconButton,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { deleteReview, getAllReview } from "../../redux/slices/review/review";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useCookies } from "react-cookie";
import { useTheme } from "@material-ui/core";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const ReviewControl = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const allReviews = useSelector((state) => state.reviews.reviews);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredReviews = allReviews.filter(
    (review) =>
      review.name &&
      review.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllReview())
      .then(() => setLoading(false)) // Set loading to false once data is fetched
      .catch(() => setLoading(false)); // Also set loading to false in case of error
  }, [dispatch]);

  if (!filteredReviews) {
    return <div>Loading...</div>;
  }

  const handleEdit = (reviewsId) => {
    navigate(`/Review-edit/${reviewsId}`);
  };

  const handleConfirmDeleteOpen = (index) => {
    setConfirmDeleteOpen(true);
    setDeleteIndex(index);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteIndex(null);
  };

  const handleDelete = () => {
    if (deleteIndex !== null && filteredReviews[deleteIndex]?._id) {
      const reviewId = filteredReviews[deleteIndex]._id;
      dispatch(deleteReview({ reviewId, token: cookies.token }))
        .then(() => {
          dispatch(getAllReview());
          handleConfirmDeleteClose();
        })
        .catch((error) => {
          console.error("Error deleting Review:", error);
          handleConfirmDeleteClose();
        });
    } else {
      console.error("Invalid reviewId:", filteredReviews[deleteIndex]?._id);
    }
  };
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };
  return (
    <LeftNavigationBar
      Content={
        <>
          <Box sx={{ mb: 4, mt: 2 }}>
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: "Merriweather, serif",
                fontWeight: 700,
                textAlign: "center",
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 3,
                mt: 2,
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
              Testimonials Overview{" "}
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search by name..."
                  InputProps={{
                    startAdornment: (
                      <SearchIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                  }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ textAlign: { xs: "left", md: "right" } }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/review-add")}
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "white",

                    whiteSpace: "nowrap",
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  Add Execution Count
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: theme.palette.primary.main }}
                  >
                    <TableCell
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Ratings
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Profile
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReviews.map((review, index) => (
                    <TableRow key={index}>
                      <TableCell>{review.name}</TableCell>
                      <TableCell>{review.ratings}</TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            <Typography
                              sx={{ fontSize: "1rem", color: "white" }}
                            >
                              {review.review}
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
                                color: "black", // Arrow matches tooltip background
                              },
                            },
                          }}
                        >
                          <span>{truncateText(review.review, 5)}</span>
                        </Tooltip>
                      </TableCell>{" "}
                      <TableCell>
                        <img
                          src={review.profile}
                          alt={review.name}
                          style={{ maxWidth: "50px", maxHeight: "50px" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => handleEdit(review._id)}
                          color="primary"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleConfirmDeleteOpen(index)}
                          color="error"
                          aria-label="delete"
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this Review?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleConfirmDeleteClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleDelete} color="error">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      }
    />
  );
};

export default ReviewControl;
