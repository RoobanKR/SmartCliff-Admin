import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import {
  deleteServiceOpportunity,
  getAllServiceOpportunities,
} from "../../../redux/slices/services/serviceOpportunity/serviceOpportunity";

const ServiceOpportunitiesControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    serviceOpportunities = [],
    loading,
    error,
  } = useSelector((state) => state.serviceOpportunities);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    dispatch(getAllServiceOpportunities());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Services-Opportunity-edit/${id}`);
  };

  const handleConfirmDeleteOpen = (index) => {
    setConfirmDeleteOpen(true);
    setDeleteIndex(index);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteIndex(null);
  };

  const handleDelete = () => {
    if (deleteIndex !== null && serviceOpportunities[deleteIndex]) {
      const id = serviceOpportunities[deleteIndex]._id;
      dispatch(deleteServiceOpportunity(id))
        .then(() => {
          dispatch(getAllServiceOpportunities());
          handleConfirmDeleteClose();
        })
        .catch((error) => {
          console.error("Error deleting service opportunity:", error);
          handleConfirmDeleteClose();
        });
    }
  };

  // Helper function to safely render text content
  const renderText = (text) => {
    if (text === null || text === undefined) return "";
    if (typeof text === "string" || typeof text === "number") return text;
    return JSON.stringify(text);
  };

  return (
    <LeftNavigationBar
      Content={
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
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
            Execution Highlights Control
          </Typography>
          <br />
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ backgroundColor: "#0C2233", color: "white" }}
                    >
                      Company Name
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#0C2233", color: "white" }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#0C2233", color: "white" }}
                    >
                      Image
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#0C2233", color: "white" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(serviceOpportunities) &&
                  serviceOpportunities.length > 0 ? (
                    serviceOpportunities.map((item, index) => (
                      <TableRow key={item?._id || index}>
                        <TableCell>{renderText(item?.company_name)}</TableCell>
                        <TableCell>{renderText(item?.description)}</TableCell>
                        <TableCell>
                          {item?.image && typeof item.image === "string" ? (
                            <img
                              src={item.image}
                              alt={
                                renderText(item?.company_name) ||
                                "Service opportunity image"
                              }
                              style={{ maxWidth: "100px", maxHeight: "100px" }}
                            />
                          ) : (
                            <Typography color="text.secondary">
                              No image
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEdit(item?._id)}
                            color="primary"
                            aria-label="edit"
                            disabled={!item?._id}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleConfirmDeleteOpen(index)}
                            color="error"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography>No service opportunities found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this service opportunity?
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
      }
    />
  );
};

export default ServiceOpportunitiesControl;
