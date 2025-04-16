"use client";
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
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  TablePagination,
  Chip,
  Avatar,
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
  Visibility as ViewIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Apartment as CollegeIcon
} from '@mui/icons-material';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { deleteSkillVertical, getAllSkillVerticals } from '../../../redux/slices/mca/skillVertical/skillVertical';

const SkillVerticalControlPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { skillVerticals, loading, error } = useSelector((state) => state.skillVertical);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [skillVerticalIdToDelete, setSkillVerticalIdToDelete] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(getAllSkillVerticals());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/degreeprogram/skill-vertical-edit/${id}`);
  };

  const handleDelete = (id) => {
    setSkillVerticalIdToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (skillVerticalIdToDelete) {
      try {
        const resultAction = await dispatch(deleteSkillVertical(skillVerticalIdToDelete));
        if (deleteSkillVertical.fulfilled.match(resultAction)) {
          setSnackbar({
            open: true,
            message: resultAction.payload.message,
            severity: 'success',
          });
          dispatch(getAllSkillVerticals());
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to delete skill vertical',
          severity: 'error',
        });
      } finally {
        setConfirmDialogOpen(false);
        setSkillVerticalIdToDelete(null);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
    setSkillVerticalIdToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredVerticals = skillVerticals.filter(vertical =>
    vertical && (
      (vertical.programName && vertical.programName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vertical.service?.title && vertical.service.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vertical.business_service?.name && vertical.business_service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vertical.college?.collegeName && vertical.college.collegeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vertical.degree_program?.program_name && vertical.degree_program.program_name.toLowerCase().includes(searchTerm.toLowerCase()))
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
            Skill Vertical Management
          </Typography>

          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search skill verticals..."
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
                onClick={() => navigate('/degreeprogram/skill-vertical-add')}
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
                Add New Skill Vertical
              </Button>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Program</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Service</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Business Service</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>College</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Degree Program</TableCell>
                      </>
                    )}
                    <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVerticals.length > 0 ? (
                    filteredVerticals
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((vertical) => (
                        <TableRow
                          key={vertical._id}
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
                              {vertical.programName}
                            </Typography>
                          </TableCell>
                          {!isMobile && (
                            <>
                              <TableCell>
                                <Chip
                                  label={vertical.service?.title || 'N/A'}
                                  size="small"
                                  color="primary"
                                  icon={<BusinessIcon fontSize="small" />}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={vertical.business_service?.name || 'N/A'}
                                  size="small"
                                  color="secondary"
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CollegeIcon color="action" fontSize="small" />
                                  <Typography variant="body2">
                                    {vertical.college?.collegeName || 'N/A'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <SchoolIcon color="action" fontSize="small" />
                                  <Typography variant="body2">
                                    {vertical.degree_program?.program_name || 'N/A'}
                                  </Typography>
                                </Box>
                              </TableCell>
                            </>
                          )}
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() => handleEdit(vertical._id)}
                                  color="primary"
                                  size={isMobile ? 'small' : 'medium'}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() => handleDelete(vertical._id)}
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
                          <SchoolIcon color="disabled" sx={{ fontSize: 60, mb: 1 }} />
                          <Typography variant="h6" color="text.secondary">
                            No skill verticals found
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

            {filteredVerticals.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredVerticals.length}
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
                Are you sure you want to delete this skill vertical? This action cannot be undone.
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

export default SkillVerticalControlPage;