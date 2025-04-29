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
  TextField,
  Grid,
  TablePagination,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import {
  fetchSoftwareTools,
  selectSoftwareTools,
  deleteToolSoftware,
} from "../../redux/slices/softwareTools/softwareTools";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

const SoftwareToolsControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const softwareTools = useSelector(selectSoftwareTools);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedToolIndex, setSelectedToolIndex] = useState(null);
  const [cookies] = useCookies(["token"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState(null);

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
      await dispatch(fetchSoftwareTools());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Software_Tools-edit/${id}`);
  };
  const handleDeleteClick = (tool) => {
    setSelectedTool(tool);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTool) {
      await dispatch(deleteToolSoftware({
        token: cookies.token,
        toolsId: selectedTool._id
      }));
      setDeleteDialogOpen(false);
      setSelectedTool(null);
    }
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedToolIndex(null);
  };

  const filteredSoftwareTools = (softwareTools || []).filter(tool =>
    tool.software_name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Typography
            variant="h4"
            sx={{
              position: "relative",
              padding: 0,
              margin: 0,
              fontWeight: 700,
              textAlign: "center",
              fontSize: { xs: "32px", sm: "40px" },
              color: "#747474",
              textTransform: "uppercase",
              paddingBottom: "5px",
              mb: 3,
              mt: -1,
              "&::before": {
                content: '""',
                width: "28px",
                height: "5px",
                display: "block",
                position: "absolute",
                bottom: "3px",
                left: "50%",
                transform: "translate X(-50%)",
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
            Software Tools Control
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search Software Tools..."
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: "left", md: "right" } }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/Software_Tools-add")}
                startIcon={<AddIcon />}
              >
                Add Software Tool
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell  style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}>Tools Name</TableCell>
                  <TableCell  style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}>Image</TableCell>
                  <TableCell  style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}>Description</TableCell>
                  <TableCell  style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        textAlign: "center",
                      }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSoftwareTools.length > 0 ? (
                  filteredSoftwareTools
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((tool, index) => (
                      <TableRow key={index}>
                        <TableCell>{tool.software_name}</TableCell>
                        <TableCell>
                          <img
                            src={tool.image}
                            alt={tool.software_name}
                            style={{ maxWidth: "100px" }}
                          />
                        </TableCell>
                        <TableCell>{tool.description}</TableCell>
                        <TableCell >
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit">
                              <Button
                                onClick={() => handleEdit(tool._id)} 
                                color="primary"
                                variant="outlined"
                              >
                                <EditIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Delete">
                            <Button
  onClick={() => handleDeleteClick(tool)}
  color="error"
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
                    <TableCell colSpan={4} align="center">
                      <Typography>No software tools found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredSoftwareTools.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this software tool?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Confirm Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default SoftwareToolsControl;