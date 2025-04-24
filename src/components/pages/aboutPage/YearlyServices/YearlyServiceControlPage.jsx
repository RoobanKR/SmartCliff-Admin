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
  TextField,
  TablePagination,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  deleteYearlyService,
  getAllYearlyServices,
} from "../../../redux/slices/aboutpage/yearlyServices/yearlyServices";
import { useTheme } from "@mui/material/styles";
import { Delete, Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

const YearlyServiceControlPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { services, loading } = useSelector((state) => state.yearlyService);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const theme = useTheme();
  const [localServices, setLocalServices] = useState([]);

  // Enhanced data transformation to prevent rendering objects
  useEffect(() => {
    if (Array.isArray(services)) {
      try {
        // Transform the services to ensure we only have primitive values
        const transformedServices = services.map(service => {
          // Handle the service year
          const year = service.year ? service.year.toString() : "";

          // Handle the services array
          const transformedServiceList = Array.isArray(service.services) ?
            service.services.map(s => ({
              businessService: typeof s.businessService === 'string' ? s.businessService : "",
              service: Array.isArray(s.service) ?
                s.service.map(subService => typeof subService === 'string' ? subService : '')
                : []
            }))
            : [];

          return {
            _id: service._id || "",
            year,
            services: transformedServiceList,
            __v: service.__v !== undefined ? service.__v : 0
          };
        });

        setLocalServices(transformedServices);
      } catch (error) {
        console.error("Error transforming services data:", error);
        setLocalServices([]);
      }
    } else {
      setLocalServices([]);
    }
  }, [services]);

  useEffect(() => {
    dispatch(getAllYearlyServices());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/about/yearly-service-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(deleteYearlyService(deleteId));
        // Fetch updated services
        dispatch(getAllYearlyServices());
      } catch (error) {
        console.error("Failed to delete yearly service", error);
      } finally {
        setConfirmDialogOpen(false);
        setDeleteId(null);
      }
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
    setDeleteId(null);
  };

  // Filter services based on search term
  const filteredServices = localServices.filter(
    (service) =>
      service.year.includes(searchTerm) ||
      service.services.some((s) =>
        s.businessService.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Updated helper function to safely render services as text content
  const renderServiceList = (serviceArray) => {
    if (!Array.isArray(serviceArray) || serviceArray.length === 0) {
      return "No services available";
    }

    return (
      <>
        {serviceArray.map((s, index) => (
          <div key={index}>
            <strong>{typeof s.businessService === 'string' ? s.businessService : "Unknown Service"}</strong>:{" "}
            {Array.isArray(s.service)
              ? s.service.filter(item => typeof item === 'string').join(", ")
              : "No sub-services available"}
          </div>
        ))}
      </>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <>
          <Box sx={{ mb: 4, mt: 2 }}>
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
                mb: 1,
                mt: 2,
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
              About History Panel
            </Typography>
          </Box>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search by Year or Business Service..."
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
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/about/yearly-service-add")}
                >
                  Add New Yearly Service
                </Button>
              </Grid>
            </Grid>
            <Paper elevation={3}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Year
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Business Services
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredServices
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((service) => (
                        <TableRow key={service._id}>
                          <TableCell style={{ textAlign: "center" }}>
                            {typeof service.year === 'string' ? service.year : ""}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            {renderServiceList(service.services)}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            <Button variant="outlined" onClick={() => handleEdit(service._id)}>
                              <Edit />
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(service._id)}
                              sx={{ ml: 1 }}
                            >
                              <Delete />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredServices.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>

          <Dialog
            open={confirmDialogOpen}
            onClose={handleCloseDialog}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: 400,
              },
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
                Are you sure you want to delete this yearly service? This action cannot be undone.
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
        </>
      }
    />
  );
};

export default YearlyServiceControlPage;