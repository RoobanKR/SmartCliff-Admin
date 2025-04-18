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
  Grid,
  TextField,
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

  useEffect(() => {
    dispatch(getAllGallery());
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
      dispatch(deleteGallery({galleryId:galleryId}));
      handleConfirmDeleteClose();
    } else {
      console.error("Error: galleryId is undefined");
    }
  };

  // Filter gallery items based on search term
  const filteredGallery = gallery.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = item.year.toString().includes(searchTerm);
    return matchesName || matchesYear; // Match either name or year
  });

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
            Gallery Control
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
                  <TableCell style={{ backgroundColor: "#0C2233", color: "white", textAlign: "center" }}>
                    Name
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#0C2233", color: "white", textAlign: "center" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#0C2233", color: "white", textAlign: "center" }}>
                    Month
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#0C2233", color: "white", textAlign: "center" }}>
                    Year
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#0C2233", color: "white", textAlign: "center" }}>
                    Image
                  </TableCell>
                  <TableCell style={{ backgroundColor: "#0C2233", color: "white", textAlign: "center" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(filteredGallery) && filteredGallery.length > 0 ? (
                  filteredGallery.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.month}</TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>
                        <img src={item.image} alt={item.name} style={{ maxWidth: "80px" }} />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(item._id)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleConfirmDeleteOpen(item._id)} color="error">
                          <DeleteIcon />
                        </IconButton>
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