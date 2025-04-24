import React, { useEffect, useState } from "react";
import {
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
  DialogActions,
  Button,
  CircularProgress,
  Box,
  TextField,
  TablePagination,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteContactPage, getAllContactPages } from "../../redux/slices/contactPage/contactPage";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

const ContactPageControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contactPages = useSelector((state) => state.contactPage.contactPages) || [];
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllContactPages());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact pages:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/contact-page-edit/${id}`);
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
      dispatch(deleteContactPage(deleteId))
        .then(() => {
          dispatch(getAllContactPages());
          handleConfirmDeleteClose();
        })
        .catch((error) => {
          console.error("Error deleting contact page:", error);
          handleConfirmDeleteClose();
        });
    }
  };

  const filteredContactPages = contactPages.filter(contactPage =>
    contactPage.contact && contactPage.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Contact Page Control Panel
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search contact pages..."
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
                  onClick={() => navigate("/contact-page-add")}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    whiteSpace: "nowrap",
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  Add Contact Page
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Table Section */}
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: theme.palette.primary.main }}
                  >
                    <TableCell sx={{ color: "white", fontWeight: 600, textAlign: "center" }}>
                      Contact
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600, textAlign: "center" }}>
                      Image
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600, textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredContactPages.length > 0 ? (
                    filteredContactPages
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((contactPage) => (
                        <TableRow key={contactPage._id}>
                          <TableCell sx={{ textAlign: "center" }}>{contactPage.contact}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <img
                              src={contactPage.image}
                              alt={contactPage.contact}
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                padding: "10px",
                                background:
                                  "linear-gradient(135deg, rgb(44, 46, 84) 10%, rgb(26, 28, 51) 90%)",
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Button
                              variant="outlined"
                              onClick={() => handleEdit(contactPage._id)}
                              color="primary"
                              aria-label="edit"
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleConfirmDeleteOpen(contactPage._id)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                          No contact pages found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredContactPages.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredContactPages.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                  "& .MuiTablePagination-toolbar": {
                    paddingLeft: 2,
                    paddingRight: 1,
                  },
                }}
              />
            )}
          </Paper>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={confirmDeleteOpen}
            onClose={ handleConfirmDeleteClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: isMobile ? "90%" : 400,
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: theme.palette.error.light,
                color: "white",
                fontWeight: 600,
              }}
            >
              Confirm Deletion
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="body1">
                Are you sure you want to delete this contact page? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleConfirmDeleteClose}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary,
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
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                  },
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

export default ContactPageControl;