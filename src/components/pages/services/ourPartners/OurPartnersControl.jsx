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
  Avatar,
  useTheme,
  useMediaQuery,
  Grid,
  Tooltip,
  IconButton,
  Link,
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
  Visibility as ViewIcon,
  Business as BusinessIcon,
  Link as LinkIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { deleteOurPartners, fetchAllOurPartners } from '../../../redux/slices/services/ourPartners/ourPartners';

const OurPartnersControlPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ourPartners, loading, error } = useSelector((state) => state.ourPartners);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(fetchAllOurPartners());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/degreeprogram/our-partners-edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/degreeprogram/our-partners-view/${id}`);
  };

  const handleDeleteClick = (id) => {
    setSelectedPartnerId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const resultAction = await dispatch(deleteOurPartners(selectedPartnerId));
      if (deleteOurPartners.fulfilled.match(resultAction)) {
        setSnackbar({
          open: true,
          message: 'Partner deleted successfully',
          severity: 'success',
        });
        dispatch(fetchAllOurPartners());
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete partner',
        severity: 'error',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedPartnerId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedPartnerId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddPartner = () => {
    navigate('/degreeprogram/our-partners-add');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPartners = ourPartners.filter(partner =>
    partner && (
      (partner.company?.companyName && partner.company.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (partner.websiteLink && partner.websiteLink.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (partner.service?.title && partner.service.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (partner.business_service?.name && partner.business_service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (partner.degree_program?.program_name && partner.degree_program.program_name.toLowerCase().includes(searchTerm.toLowerCase()))
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
              fontFamily: 'Merriweather, serif',
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
            Partners Management
          </Typography>

          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search partners..."
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
                onClick={handleAddPartner}
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
                Add New Partner
              </Button>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Company</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Website</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Service</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Business Service</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Degree Program</TableCell>
                      </>
                    )}
                    <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPartners.length > 0 ? (
                    filteredPartners
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((partner) => (
                        <TableRow
                          key={partner._id}
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
                              {partner.company?.companyName || 'N/A'}
                            </Typography>
                          </TableCell>
                          {!isMobile && (
                            <>
                              <TableCell>
                                {partner.websiteLink ? (
                                  <Link
                                    href={partner.websiteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                  >
                                    <LinkIcon fontSize="small" />
                                    <Typography variant="body2" noWrap>
                                      {partner.websiteLink}
                                    </Typography>
                                  </Link>
                                ) : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={partner.service?.title || 'N/A'}
                                  size="small"
                                  color="primary"
                                  icon={<BusinessIcon fontSize="small" />}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={partner.business_service?.name || 'N/A'}
                                  size="small"
                                  color="secondary"
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={partner.degree_program?.program_name || 'N/A'}
                                  size="small"
                                  icon={<SchoolIcon fontSize="small" />}
                                />
                              </TableCell>
                            </>
                          )}
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() => handleEdit(partner._id)}
                                  color="primary"
                                  size={isMobile ? 'small' : 'medium'}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => handleDeleteClick(partner._id)}
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
                      <TableCell colSpan={isMobile ? 2 : 6} align="center" sx={{ py: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <BusinessIcon color="disabled" sx={{ fontSize: 60, mb: 1 }} />
                          <Typography variant="h6" color="text.secondary">
                            No partners found
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

            {filteredPartners.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredPartners.length}
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
                Are you sure you want to delete this partner? This action cannot be undone.
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

export default OurPartnersControlPage;