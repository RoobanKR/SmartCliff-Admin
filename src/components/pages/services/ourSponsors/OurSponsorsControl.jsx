import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  TextField,
  TablePagination,
  Chip,
  useTheme,
  useMediaQuery,
  Grid,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { deleteOurSponsors, fetchAllOurSponsors } from '../../../redux/slices/services/ourSponsors/ourSponsors';

const OurSponsorsControlPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ourSponsors, loading } = useSelector((state) => state.ourSponsors);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSponsorId, setSelectedSponsorId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(fetchAllOurSponsors());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/degreeprogram/our-sponsor-edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedSponsorId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const resultAction = await dispatch(deleteOurSponsors(selectedSponsorId));
      if (deleteOurSponsors.fulfilled.match(resultAction)) {
        setSnackbar({
          open: true,
          message: 'Sponsor deleted successfully',
          severity: 'success',
        });
        dispatch(fetchAllOurSponsors());
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete sponsor',
        severity: 'error',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSponsorId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedSponsorId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddSponsor = () => {
    navigate('/degreeprogram/our-sponsor-add');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredSponsors = ourSponsors.filter(sponsor =>
    sponsor && (
      (sponsor.companyName && sponsor.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sponsor.type && sponsor.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sponsor.category && sponsor.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sponsor.service?.title && sponsor.service.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sponsor.business_service?.name && sponsor.business_service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sponsor.degree_program?.program_name && sponsor.degree_program.program_name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  if (loading) {
    return (
      <LeftNavigationBar
        Content={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress size={60} />
          </Box>
        }
      />
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ p: isMobile ? 2 : 3, maxWidth: 1600, mx: 'auto' }}>
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
            Our Sponsors Panel
          </Typography>

          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search sponsors..."
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
                onClick={handleAddSponsor}
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
                Add New Sponsor
              </Button>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Company</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Category</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Contributions</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Service</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Business Service</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Degree Program</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSponsors.length > 0 ? (
                    filteredSponsors
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((sponsor) => (
                        <TableRow
                          key={sponsor._id}
                          hover
                          sx={{
                            '&:nth-of-type(odd)': {
                              backgroundColor: theme.palette.action.hover
                            },
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell sx={{ textAlign: "center" }}>{sponsor.companyName || 'N/A'}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{sponsor.type || 'N/A'}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{sponsor.category || 'N/A'}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{sponsor.contributions ? sponsor.contributions.join(', ') : 'N/A'}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{sponsor.service?.title || 'N/A'}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{sponsor.business_service?.name || 'N/A'}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{sponsor.degree_program?.program_name || 'N/A'}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <Tooltip title="Edit">
                                <Button
                                  onClick={() => handleEdit(sponsor._id)}
                                  color="primary"
                                  size={isMobile ? 'small' : 'medium'}
                                  variant="outlined"                                >
                                  <EditIcon />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <Button
                                  onClick={() => handleDeleteClick(sponsor._id)}
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
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                          No sponsors found
                        </Typography>
                        {searchTerm && (
                          <Typography variant="body2" color="text.secondary">
                            No results for "{searchTerm}"
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredSponsors.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredSponsors.length}
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
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
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
                Are you sure you want to delete this sponsor? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleDeleteCancel}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
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

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      }
    />
  );
};

export default OurSponsorsControlPage;