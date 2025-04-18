import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, Container, Paper, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, CircularProgress, Chip, TablePagination
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';
import LeftNavigationBar from '../../navbars/LeftNavigationBar';
import { getAPIURL } from '../../../utils/utils';
import { deleteFooter, getAllFooters } from '../../redux/slices/footer/footer';

const FooterControl = () => {
  const dispatch = useDispatch();
  const { footers, loading, error } = useSelector((state) => state.footer);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  useEffect(() => {
    dispatch(getAllFooters());
  }, [dispatch]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setOpenDeleteDialog(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteFooter(deletingId)).unwrap();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Delete failed:', error);
      alert(`Failed to delete footer: ${error.message}`);
    }
  };
  
  if (loading && footers.length === 0) {
    return (
      <LeftNavigationBar
        Content={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        }
      />
    );
  }
  
  if (error) {
    return (
      <LeftNavigationBar
        Content={
          <Box p={3}>
            <Typography color="error" variant="h6">
              Error loading footers: {error}
            </Typography>
          </Box>
        }
      />
    );
  }
  
  return (
    <LeftNavigationBar
      Content={
        <Container maxWidth="lg">
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: 'Merriweather, serif',
                fontWeight: 700, textAlign: 'center',
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 5,
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
            >                Footer Management
              </Typography>

          <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 4 }}>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Button
                component={RouterLink}
                to="/footer-add"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              >
                Add New Footer
              </Button>
            </Box>
            
            {footers.length > 0 ? (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Logo</TableCell>
                        <TableCell>Social Links</TableCell>
                        <TableCell>Quick Links</TableCell>
                        <TableCell>Support Links</TableCell>
                        <TableCell>Last Modified</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {footers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((footer) => (
                          <TableRow key={footer._id}>
                            <TableCell sx={{backgroundColor:"gray"}}>
                              {footer.logo && (
                                <Box
                                  component="img"
                                  src={`${footer.logo}`}
                                  alt="Footer Logo"
                                  sx={{ height: 50, objectFit: 'contain' }}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {footer.socials && footer.socials.length >  0 ? (
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                  {footer.socials.slice(0, 3).map((social, index) => (
                                    <Chip key={index} label={social.platform} size="small" />
                                  ))}
                                  {footer.socials.length > 3 && (
                                    <Chip label={`+${footer.socials.length - 3} more`} size="small" />
                                  )}
                                </Box>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No social links
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {footer.quickLinks && footer.quickLinks.reduce((count, section) => count + section.links.length, 0)} links
                            </TableCell>
                            <TableCell>
                              {footer.support && footer.support.reduce((count, section) => count + section.links.length, 0)} links
                            </TableCell>
                            <TableCell>
                              {new Date(footer.updatedAt).toLocaleDateString()}
                              <Typography variant="caption" display="block">
                                By: {footer.lastModifiedBy || 'Unknown'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" justifyContent="center" gap={1}>
                                <IconButton
                                  component={RouterLink}
                                  to={`/footer-edit/${footer._id}`}
                                  size="small"
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteClick(footer._id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={footers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
              <Box py={4} textAlign="center">
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No footers found
                </Typography>
                <Button
                  component={RouterLink}
                  to="/footer-add"
                  variant="contained"
                  color="primary"
                >
                  Add New Footer
                </Button>
              </Box>
            )}
          </Paper>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this footer? This action cannot be undone.
              </DialogContentText>
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
        </Container>
      }
    />
  );
};

export default FooterControl;