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
    Chip,
    useTheme,
    useMediaQuery,
    Grid
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Search as SearchIcon,
    CloudUpload as UploadIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { useCookies } from 'react-cookie';
import { resetSignIn, userVerify } from '../../../redux/slices/user/Signin';
import { useNavigate } from 'react-router-dom';
import { deleteCollege, getAllColleges } from '../../../redux/slices/mca/college/college';

const CollegeControl = () => {
    const dispatch = useDispatch();
    const collegeData = useSelector((state) => state.college.colleges) || [];
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
                await dispatch(getAllColleges());
                setLoading(false);
            } catch (error) {
                console.error("Error fetching colleges:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);

    const handleEdit = (id) => {
        navigate(`/college-edit/${id}`);
    };

    const handleView = (id) => {
        navigate(`/college-view/${id}`);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteCollege(deleteId))
            .then(() => {
                dispatch(getAllColleges());
                setConfirmDialogOpen(false);
            })
            .catch((error) => {
                console.error("Error deleting data:", error);
            });
    };

    const handleCloseDialog = () => {
        setDeleteId(null);
        setConfirmDialogOpen(false);
    };

    const handleAddCollege = () => {
        navigate('/college-add');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredColleges = collegeData.filter(college =>
        college && (
            (college.collegeName && college.collegeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (college.slug && college.slug.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (college.description && college.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    // Reset to first page when search term changes
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
                            College Management
                        </Typography>

                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    placeholder="Search colleges..."
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
                                    onClick={handleAddCollege}
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
                                    Add New College
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
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Logo</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>College Name</TableCell>
                                        {!isMobile && (
                                            <>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Slug</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
                                            </>
                                        )}
                                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredColleges.length > 0 ? (
                                        filteredColleges
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((college) => (
                                                college && (
                                                    <TableRow
                                                        key={college._id}
                                                        hover
                                                        sx={{
                                                            '&:nth-of-type(odd)': {
                                                                backgroundColor: theme.palette.action.hover
                                                            },
                                                            '&:last-child td, &:last-child th': { border: 0 }
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Avatar
                                                                src={college.logo}
                                                                alt={college.collegeName || 'College logo'}
                                                                sx={{
                                                                    width: 50,
                                                                    height: 50,
                                                                    backgroundColor: college.logo ? 'transparent' : theme.palette.grey[300]
                                                                }}
                                                            >
                                                                {!college.logo && college.collegeName?.charAt(0)}
                                                            </Avatar>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography fontWeight={500}>
                                                                {college.collegeName || 'N/A'}
                                                            </Typography>
                                                            {college.website && (
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                    sx={{ display: 'block' }}
                                                                >
                                                                    {college.website}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                        {!isMobile && (
                                                            <>
                                                                <TableCell>
                                                                    <Chip
                                                                        label={college.slug || 'N/A'}
                                                                        size="small"
                                                                        color="secondary"
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
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
                                                                        {college.description || 'No description'}
                                                                    </Typography>
                                                                </TableCell>
                                                            </>
                                                        )}
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Tooltip title="Edit">
                                                                    <IconButton
                                                                        onClick={() => handleEdit(college._id)}
                                                                        color="primary"
                                                                        size={isMobile ? 'small' : 'medium'}
                                                                    >
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Delete">
                                                                    <IconButton
                                                                        onClick={() => handleDelete(college._id)}
                                                                        color="error"
                                                                        size={isMobile ? 'small' : 'medium'}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={isMobile ? 3 : 5} align="center" sx={{ py: 4 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <UploadIcon color="disabled" sx={{ fontSize: 60, mb: 1 }} />
                                                    <Typography variant="h6" color="text.secondary">
                                                        No colleges found
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

                        {/* Pagination - Only show if there's data */}
                        {filteredColleges.length > 0 && (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={filteredColleges.length}
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
                                Are you sure you want to delete this college? This action cannot be undone.
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

export default CollegeControl;