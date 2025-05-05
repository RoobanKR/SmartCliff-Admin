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
  Grid,
  TextField,
  Tooltip,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import {
  deleteGallery,
  getAllGallery,
} from "../../redux/slices/gallery/gallery";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const GalleryControl = () => {
  const dispatch = useDispatch();
  const gallery = useSelector((state) => state.gallery.gallery) ?? [];
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [galleryId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        await dispatch(getAllGallery()).unwrap();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/gallery-edit/${id}`);
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
    if (galleryId) {
      dispatch(deleteGallery({ galleryId: galleryId }));
      handleConfirmDeleteClose();
    } else {
      console.error("Error: galleryId is undefined");
    }
  };

  // Filter gallery items based on search term
  const filteredGallery = Array.isArray(gallery) ? gallery.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = item.year.toString().includes(searchTerm);
    return matchesName || matchesYear; // Match either name or year
  }) : [];

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
  }

  if (error) {
    return <Typography color="error" align="center">Error: {error}</Typography>;
  }

  return (
    <LeftNavigationBar
      Content={
        <Box>
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
                        mt: -1,
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
                       Gallery Management
                    </Typography>

          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search Name, Year..."
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
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
                color="primary"
                onClick={() => navigate("/gallery-add")}
                startIcon={<AddIcon />}
              >
                Add gallery
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                    Name
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                    Month
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                    Year
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                    Image
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#1976d2", color: "white", textAlign: "center" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGallery.length > 0 ? (
                  filteredGallery
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.month}</TableCell>
                        <TableCell>{item.year}</TableCell>
                        <TableCell>
  <Box
    sx={{
      display: "flex",
      overflowX: "auto",
      maxWidth: 200,
      gap: 1,
      paddingY: 1,
      "& img": {
        width: 80,
        height: 60,
        objectFit: "cover",
        borderRadius: "4px",
        flexShrink: 0,
      },
    }}
  >
    {item.images && item.images.map((url, index) => (
      <img key={index} src={url} alt={`gallery-${index}`} />
    ))}
  </Box>
</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit">
                              <Button
                                onClick={() => handleEdit(item._id)}
                                color="primary"
                                variant="outlined"
                              >
                                <EditIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Button
                                onClick={() => handleConfirmDeleteOpen(item._id)} 
                                color="error"
                                variant="outlined"
                              >
                                <DeleteIcon />
                              </Button>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredGallery.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this gallery item?
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
      }
    />
  );
};

export default GalleryControl;