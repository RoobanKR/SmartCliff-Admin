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
  Grid,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import {
  deleteServiceAbout,
  getAllServiceAbout,
} from "../../../redux/slices/services/about/about";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const ServiceAboutControl = () => {
  const dispatch = useDispatch();
  const serviceAboutData =
    useSelector((state) => state.serviceAbout.serviceAbouts) || [];
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        await dispatch(getAllServiceAbout());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service about data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Services-About-edit/${id}`);
  };

  const handleAddServiceAbout = () => {
    navigate("/Services-About-add");
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteServiceAbout(deleteId))
        .then(() => {
          dispatch(getAllServiceAbout());
          setConfirmDialogOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting service about:", error);
        });
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

  const filteredServices = serviceAboutData.filter(
    (service) =>
      service &&
      ((service.heading &&
        service.heading.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (service.subHeading &&
          service.subHeading
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (service.description &&
          service.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

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
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
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
              Service About Management
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search services about..."
                  InputProps={{
                    startAdornment: (
                      <SearchIcon color="action" sx={{ mr: 1 }} />
                    ),
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
                  onClick={handleAddServiceAbout}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Add New Service About
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
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Heading
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Subheading
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Images
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Features
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredServices.length > 0 ? (
                    filteredServices
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((service) => (
                        <TableRow key={service._id} hover>
                          <TableCell>{service.heading}</TableCell>
                          <TableCell>{service.subHeading}</TableCell>
                          <TableCell>
                            {service.images.map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt="Service"
                                width={50}
                                height={50}
                                style={{ marginRight: 5 }}
                              />
                            ))}
                          </TableCell>
                          <TableCell>
                            {service.feature.map((feature, index) => (
                              <div key={index}>
                                {feature.icon && (
                                  <img
                                    src={feature.icon}
                                    alt="Icon"
                                    width={20}
                                    height={20}
                                    style={{ marginRight: 5 }}
                                  />
                                )}
                                {feature.title}
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Tooltip title="Edit">
                                <Button
                                  variant="outlined"
                                  onClick={() => handleEdit(service._id)}
                                  color="primary"
                                >
                                  <EditIcon />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <Button
                                  variant="outlined"
                                  onClick={() => handleDelete(service._id)}
                                  color="error"
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
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                          No services about found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
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

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={confirmDialogOpen}
            onClose={handleCloseDialog}
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
                Are you sure you want to delete this service about? This action
                cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary,
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

export default ServiceAboutControl;
