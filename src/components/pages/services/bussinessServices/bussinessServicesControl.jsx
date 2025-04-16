import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Box,
    Tooltip,
    TablePagination,
    Avatar,
    Chip,
    useTheme,
    useMediaQuery,
    Grid,
    TextField
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { useCookies } from 'react-cookie';
import { resetSignIn, userVerify } from '../../../redux/slices/user/Signin';
import { deleteBussinessService, getAllBussinessServices } from '../../../redux/slices/services/bussinessServices/BussinessSerives';
import { useNavigate } from 'react-router-dom';

const BussinessServicesControl = () => {
    const dispatch = useDispatch();
    const businessServiceData = useSelector((state) => state.businessService.businessServiceData) || [];
    const navigate = useNavigate();
    const [deleteId, setDeleteId] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [cookies] = useCookies(["token"]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (!cookies.token) {
            dispatch(resetSignIn());
            navigate("/");
        } else {
            dispatch(userVerify({ token: cookies.token }));
        }
    }, [cookies, dispatch, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getAllBussinessServices());
                setLoading(false);
            } catch (error) {
                console.error("Error fetching business services:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);

    const handleEdit = (id) => {
        navigate(`/Business-Services-edit/${id}`);
    };

    const handleAdd = () => {
        navigate("/Business-Services-add");
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = () => {
      if (deleteId) {
          dispatch(deleteBussinessService({ 
              businessServiceId: deleteId, 
              token: cookies.token 
          }))
          .then(() => {
              dispatch(getAllBussinessServices());
              setConfirmDialogOpen(false);
          })
          .catch((error) => {
              console.error("Error deleting business service:", error);
          });
      } else {
          console.error("Delete ID is undefined");
      }
  };
    const handleCloseDialog = () => {
        setDeleteId(null);
        setConfirmDialogOpen(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredServices = businessServiceData.filter(service =>
        service && (
            (service.name && service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (service.slug && service.slug.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (service.description && service.description.toLowerCase().includes(searchTerm .toLowerCase()))
        )
    );

    useEffect(() => {
        setPage(0);
    }, [searchTerm]);

    if (loading) {
        return (
            <LeftNavigationBar
                Content={
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                        <CircularProgress />
                    </Box>
                }
            />
        );
    }

    return (
        <LeftNavigationBar
            Content={
                <Box sx={{ p: isMobile ? 1 : 3 }}>
                    <Box sx={{ mb: 4 }}>
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
                            Business Services Management
                        </Typography>

                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    placeholder="Search services..."
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    value={searchTerm}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleAdd}
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark
                                        },
                                    }}
                                >
                                    Add New Service
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Service Name</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Image</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Slug</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredServices.length > 0 ? (
                                        filteredServices
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((service) => (
                                                <TableRow key={service._id} hover>
                                                    <TableCell>{service.name}</TableCell>
                                                    <TableCell>{service.description}</TableCell>
                                                    <TableCell>
                                                        <img
                                                            src={service.image}
                                                            alt={service.name}
                                                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{service.slug}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Tooltip title="Edit">
                                                                <IconButton
                                                                    onClick={() => handleEdit(service._id)}
                                                                    color="primary"
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete">
                                                                <IconButton
                                                                    onClick={() => handleDelete(service._id)}
                                                                    color="error"
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
                                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                <Typography variant="h6" color="text.secondary">
                                                    No services found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {filteredServices.length > 0 && (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={filteredServices.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        )}
                    </Paper>

                    <Dialog
                        open={confirmDialogOpen}
                        onClose={handleCloseDialog}
                    >
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to delete this service? This action cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmDelete} color="error">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            }
        />
    );
};

export default BussinessServicesControl;