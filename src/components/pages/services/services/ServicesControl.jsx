import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  deleteService,
  fetchServices,
} from "../../../redux/slices/services/services/Services";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

const ServicesControl = () => {
  const dispatch = useDispatch();
  const serviceData = useSelector((state) => state.service.serviceData);
  const status = useSelector((state) => state.service.status);
  const error = useSelector((state) => state.service.error);
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [serviceId, setServiceIdToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies]);

  const handleEdit = (id) => {
    navigate(`/Services-edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setServiceIdToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (serviceId) {
      setLoading(true);
      await dispatch(deleteService({ serviceId, token: cookies.token }));
      setLoading(false);
      setDeleteConfirmationOpen(false);
      dispatch(fetchServices());
    }
  };

  const handleDeleteCancel = () => {
    setServiceIdToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <LeftNavigationBar
      Content={
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Typography
            gutterBottom
            variant="h4"
            textAlign={"center"}
            component="div"
            fontFamily={"Serif"}
          >
            Services Control
          </Typography>
          <br />
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    service Name
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
                    Videos
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceData.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>{service.title}</TableCell>

                    <TableCell>{service.description}</TableCell>
                    <TableCell>
                      <img
                        src={service.image}
                        alt={service.title}
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </TableCell>
                    <TableCell>
                      {service.videos &&
                        service.videos.map((video, index) => (
                          <div key={index}>
                            <video width="200" height="200" controls>
                              <source src={video} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ))}
                    </TableCell>

                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(service._id)}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(service._id)}
                        color="error"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Confirmation Dialog */}
          <Dialog open={deleteConfirmationOpen} onClose={handleDeleteCancel}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this service?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} color="error">
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default ServicesControl;
