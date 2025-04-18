import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Button,
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
  Tooltip,
  TextField,
  TablePagination,
  CircularProgress,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  deleteVisionMission,
  getAllVisionMissions,
} from "../../../redux/slices/aboutpage/visionMission/visionMission";
import { HelpOutline } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

const VisionMissionControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visionMissions, loading } = useSelector(
    (state) => state.visionMission
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(getAllVisionMissions());
  }, [dispatch]);

  const handleEdit = (id) => navigate(`/about/vision-mission-edit/${id}`);

  const handleConfirmDeleteOpen = (id) => {
    setConfirmDeleteOpen(true);
    setDeleteId(id);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const handleDelete = () => {
    dispatch(deleteVisionMission(deleteId)).then(() =>
      handleConfirmDeleteClose()
    );
  };

  const filteredVisionMissions = (visionMissions || []).filter(
    (item) =>
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading)
    return (
      <LeftNavigationBar
        Content={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        }
      />
    );

  return (
    <LeftNavigationBar
      Content={
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={2}
            mb={1}
          >
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: "Merriweather, serif",
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
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
              Mission & Vision
              <br /> Control Panel
            </Typography>

            <Tooltip
              title="This is where you can add the execution count for the service."
              arrow
            >
              <HelpOutline
                sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }}
              />
            </Tooltip>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ p: isMobile ? 1 : 3 }}
          >
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search by Type or Description..."
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
                  color="primary"
                  onClick={() => navigate("/about/vision-mission-add")}
                  startIcon={<AddIcon />}
                >
                  Add Vision / Mission
                </Button>
              </Grid>
            </Grid>

            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: theme.palette.primary.main }}
                  >
                    <TableCell style={{ color: "white", textAlign: "center" }}>
                      Type
                    </TableCell>
                    <TableCell style={{ color: "white", textAlign: "center" }}>
                      Description
                    </TableCell>
                    <TableCell style={{ color: "white", textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVisionMissions.length > 0 ? (
                    filteredVisionMissions
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item) => (
                        <TableRow key={item._id}>
                          <TableCell
                            sx={{
                              textAlign: "center",
                              color: "green",
                              fontSize: "25px",
                            }}
                          >
                            <b>{item.type}</b>
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.description}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Button
                              variant="outlined"
                              onClick={() => handleEdit(item._id)}
                              color="primary"
                            >
                              <EditIcon />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => handleConfirmDeleteOpen(item._id)}
                              color="error"
                              style={{ marginTop: "5%" }}
                            >
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography>No entries found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredVisionMissions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this entry?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleConfirmDeleteClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleDelete} color="error">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>
      }
    />
  );
};

export default VisionMissionControl;
