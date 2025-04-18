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
    TextField,
    TablePagination,
    Avatar,
    useTheme,
    useMediaQuery,
    Grid
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Search as SearchIcon,
    Upload as UploadIcon
} from '@mui/icons-material';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { useCookies } from 'react-cookie';
import { resetSignIn, userVerify } from '../../../redux/slices/user/Signin';
import { useNavigate } from 'react-router-dom';
import { deleteWCU, getAllWCU } from '../../../redux/slices/home/wcu/WhyCU';

const WCUControl = () => {
    const dispatch = useDispatch();
    const wcuData = useSelector((state) => state.wcu.wcuList) || [];
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
                await dispatch(getAllWCU());
                setLoading(false);
            } catch (error) {
                console.error("Error fetching WCU data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);

    const handleEdit = (id) => {
        navigate(`/home/wcu-edit/${id}`);
    };


    const handleDelete = (id) => {
        setDeleteId(id);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteWCU(deleteId))
            .then(() => {
                dispatch(getAllWCU());
                setConfirmDialogOpen(false);
            })
            .catch((error) => {
                console.error("Error deleting WCU:", error);
            });
    };

    const handleCloseDialog = () => {
        setDeleteId(null);
        setConfirmDialogOpen(false);
    };

    const handleAddWCU = () => {
        navigate('/home/wcu-add');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredWCU = wcuData.filter(wcu =>
        wcu && (
            (wcu.title && wcu.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (wcu.description && wcu.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
                                fontFamily: 'Merriweather, serif',
                                fontWeight: 700,
                                textAlign: 'center',
                                fontSize: { xs: "32px", sm: "40px" },
                                color: "#747474",
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
                            Why Choose Us Management
                        </Typography>

                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    placeholder="Search WCU entries..."
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
                                    onClick={handleAddWCU}
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
                                    Add New WCU
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Table Section */}
                    <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Title</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Icon</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredWCU.length > 0 ? (
                                        filteredWCU
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((wcu) => (
                                                <TableRow
                                                    key={wcu._id}
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
                                                            {wcu.title || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {wcu.description || 'No description'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Avatar
                                                            src={`${wcu.icon}`}
                                                            alt={wcu.title || 'WCU icon'}
                                                           
                                                        >
                                                            {!wcu.icon && wcu.title?.charAt(0)}
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Tooltip title="Edit">
                                                                <IconButton
                                                                    onClick={() => handleEdit(wcu._id)}
                                                                    color="primary"
                                                                    size={isMobile ? 'small' : 'medium'}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete">
                                                                < IconButton
                                                                    onClick={() => handleDelete(wcu._id)}
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
                                            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <UploadIcon color="disabled" sx={{ fontSize: 60, mb: 1 }} />
                                                    <Typography variant="h6" color="text.secondary">
                                                        No WCU entries found
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

                        {filteredWCU.length > 0 && (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={filteredWCU.length}
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
                                Are you sure you want to delete this WCU entry? This action cannot be undone.
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

export default WCUControl;