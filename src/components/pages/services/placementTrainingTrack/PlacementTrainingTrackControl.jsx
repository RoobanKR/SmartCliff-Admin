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
  Collapse,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  TablePagination,
  useTheme,
  useMediaQuery,
  Grid,
  DialogContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePlacementTrainingTrack,
  fetchPlacementTrainingTracks,
} from "../../../redux/slices/services/placementTrainingTrack/placementTrainingTrack";
import { useNavigate } from "react-router-dom";

const PlacementTrainingTrackControl = () => {
  const dispatch = useDispatch();
  const { tracks, loading } = useSelector(
    (state) => state.placementTrainingTrack
  );
  const [openRow, setOpenRow] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trackToDelete, setTrackToDelete] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchPlacementTrainingTracks());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setTrackToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (trackToDelete) {
      dispatch(deletePlacementTrainingTrack(trackToDelete));
    }
    setDeleteDialogOpen(false);
  };

  const filteredTracks = tracks.filter(
    (track) =>
      track.trackName &&
      track.trackName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
              Training Track <br></br> Control Panel
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search placement training tracks..."
                  InputProps={{
                    startAdornment: (
                      <SearchIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 1,
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
                  onClick={() => navigate("/Placement-Training-Track-add")}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    whiteSpace: "nowrap",
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  Add Placement Training Track
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
                    <TableCell sx={{ color: "white", fontWeight: 600 }} />
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Track Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Proposed Hours
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      No of Days
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Target Semester
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTracks.length > 0 ? (
                    filteredTracks
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((track, index) => (
                        <React.Fragment key={track._id}>
                          <TableRow>
                            <TableCell>
                              <IconButton
                                onClick={() =>
                                  setOpenRow(openRow === index ? null : index)
                                }
                              >
                                {openRow === index ? (
                                  <KeyboardArrowUp />
                                ) : (
                                  <KeyboardArrowDown />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell>{track.trackName}</TableCell>
                            <TableCell sx={{ color: "#A62C2C" }}>
                              {" "}
                              <b> {track.proposedHour}</b>
                            </TableCell>
                            <TableCell sx={{ color: "#CB6040" }}>
                              <b>{track.noOfDays}</b>
                            </TableCell>
                            <TableCell>
                              {track.targetSemester &&
                              Array.isArray(track.targetSemester)
                                ? track.targetSemester.join(", ")
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() =>
                                  navigate(
                                    `/Placement-Training-Track-edit/${track._id}`
                                  )
                                }
                                variant="outlined"
                                color="primary"
                              >
                                <EditIcon />
                              </Button>
                              <Button
                                sx={{ mt: 1 }}
                                onClick={() => handleDeleteClick(track._id)}
                                color="error"
                                variant="outlined"
                              >
                                <DeleteIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                            >
                              <Collapse
                                in={openRow === index}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box margin={2}>
                                  <Typography
                                    variant="h6"
                                    color="primary"
                                    gutterBottom
                                  >
                                    Training Modules
                                  </Typography>
                                  {track.trainingModuleLevels &&
                                    track.trainingModuleLevels.map(
                                      (level, levelIndex) => (
                                        <Box key={levelIndex} sx={{ mb: 2 }}>
                                          <Typography variant="subtitle1">
                                            Level {levelIndex + 1}
                                          </Typography>
                                          <Table size="small">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>
                                                  Module Name
                                                </TableCell>
                                                <TableCell>Hours</TableCell>
                                                <TableCell>Days</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {level.modules &&
                                                level.modules.map(
                                                  (module, moduleIndex) => (
                                                    <TableRow key={moduleIndex}>
                                                      <TableCell>
                                                        {module.modulename}
                                                      </TableCell>
                                                      <TableCell>
                                                        {
                                                          module.TrainingComponentInHours
                                                        }
                                                      </TableCell>
                                                      <TableCell>
                                                        {
                                                          module.TrainingComponentInDays
                                                        }
                                                      </TableCell>
                                                    </TableRow>
                                                  )
                                                )}
                                            </TableBody>
                                          </Table>
                                        </Box>
                                      )
                                    )}
                                  <Typography
                                    variant="h6"
                                    color="primary"
                                    gutterBottom
                                  >
                                    Training Module Summary
                                  </Typography>
                                  {track.trainingModuleSummary &&
                                    track.trainingModuleSummary.map(
                                      (summary, summaryIndex) => (
                                        <Box key={summaryIndex} sx={{ mb: 2 }}>
                                          <Typography variant="subtitle1">
                                            {summary.moduleLevel}
                                          </Typography>
                                          <Table size="small">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>
                                                  Training Hours
                                                </TableCell>
                                                <TableCell>
                                                  Training Days
                                                </TableCell>
                                                <TableCell>Remarks</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              <TableRow>
                                                <TableCell>
                                                  {summary.TrainingInHours}
                                                </TableCell>
                                                <TableCell>
                                                  {summary.TrainingInDays}
                                                </TableCell>
                                                <TableCell>
                                                  {summary.remarks}
                                                </TableCell>
                                              </TableRow>
                                            </TableBody>
                                          </Table>
                                        </Box>
                                      )
                                    )}
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                          No placement training tracks found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredTracks.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredTracks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                  "& .MuiTablePagination-toolbar": {
                    paddingLeft: 2,
                    paddingRight: 1,
                  },
                }}
              />
            )}
          </Paper>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
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
                Are you sure you want to delete this placement training track?
                This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary,
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

export default PlacementTrainingTrackControl;
