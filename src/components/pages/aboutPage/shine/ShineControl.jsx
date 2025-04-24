import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableSortLabel,
  Grid,
  Tooltip,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  deleteShine,
  fetchShines,
} from "../../../redux/slices/aboutpage/shine/shine";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from "@mui/icons-material/CloudUpload";

const ShineControlPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shines, loading, error } = useSelector((state) => state.shines);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchShines());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/about/shine-edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const resultAction = await dispatch(deleteShine(deleteId));
      if (deleteShine.fulfilled.match(resultAction)) {
        setSnackbar({
          open: true,
          message: resultAction.payload.message || "Deleted successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete shine",
        severity: "error",
      });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Filter shines based on search term
  const filteredShines = shines.filter(shine =>
    shine && (
      (shine.title && shine.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (shine.description && shine.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  if (loading) {
    return (
      <LeftNavigationBar
        Content={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        }
      />
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ maxWidth: 1200, mx: "auto", p: isMobile ? 1 : 2 }}>
          <Typography
            variant="h4"
            sx={{
              position: "relative",
              padding: 0,
              margin: 0,
              fontWeight: 300,
              fontSize: { xs: "32px", sm: "40px" },
              color: "#747474",
              textAlign: "center",
              textTransform: "uppercase",
              paddingBottom: "5px",
              mb: 3,
              mt: -2,
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
            Shine Panel
          </Typography>

          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search shines..."
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
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/about/shine-add")}
                startIcon={<AddIcon />}
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
                Add New Shine
              </Button>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell style={{ color: "white", textAlign: "center" }}>
                      <TableSortLabel>Title</TableSortLabel>
                    </TableCell>
                    <TableCell style={{ color: "white", textAlign: "center" }}>
                      Description
                    </TableCell>
                    {!isMobile && (
                      <>
                        <TableCell style={{ color: "white", textAlign: "center" }}>
                          Image
                        </TableCell>
                        <TableCell style={{ color: "white", textAlign: "center" }}>
                          Definitions
                        </TableCell>
                      </>
                    )}
                    <TableCell style={{ color: "white", textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredShines.length > 0 ? (
                    filteredShines.map((shine) => (
                      <TableRow
                        key={shine._id}
                        hover
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: theme.palette.action.hover
                          },
                          '&:last-child td, &:last-child th': { border: 0 }
                        }}
                      >
                        <TableCell sx={{ textAlign: "center" }}>
                          <Typography fontWeight={500}>
                            {shine.title || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
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
                            {shine.description || 'No description'}
                          </Typography>
                        </TableCell>
                        {!isMobile && (
                          <>
                            <TableCell sx={{ textAlign: "center" }}>
                              {shine.image ? (
                                <Box
                                  component="img"
                                  src={shine.image}
                                  alt={shine.title}
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                  }}
                                />
                              ) : (
                                <span>No image available</span>
                              )}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {shine.shineDefinition &&
                                shine.shineDefinition.length > 0 ? (
                                shine.shineDefinition.map((def, index) => (
                                  <div key={index}>
                                    <strong>{def.title}</strong>: {def.description}{" "}
                                    (Color: {def.color})
                                  </div>
                                ))
                              ) : (
                                <span>No definitions available</span>
                              )}
                            </TableCell>
                          </>
                        )}
                        <TableCell sx={{ textAlign: "center" }}>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Edit">
                              <Button
                                variant="outlined"
                                color="primary"
                                size={isMobile ? 'small' : 'medium'}
                                onClick={() => handleEdit(shine._id)}
                              >
                                <EditIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Button
                                variant="outlined"
                                color="error"
                                size={isMobile ? 'small' : 'medium'}
                                onClick={() => handleDeleteClick(shine._id)}
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
                      <TableCell colSpan={isMobile ? 3 : 5} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <UploadIcon color="disabled" sx={{ fontSize: 60, mb: 1 }} />
                          <Typography variant="h6" color="text.secondary">
                            No shines found
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
          </Paper>

          <Dialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
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
              Confirm Delete
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="body1">
                Are you sure you want to delete this shine? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setConfirmOpen(false)}
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
                color="error"
                variant="contained"
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

export default ShineControlPage;