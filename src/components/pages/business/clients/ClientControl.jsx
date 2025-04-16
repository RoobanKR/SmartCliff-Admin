import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DialogActions,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button as MuiButton,
  Snackbar,
  Alert,
} from "@mui/material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  deleteClient,
  getAllClient,
} from "../../../redux/slices/services/client/Client";
import { Button } from "@material-ui/core";

const ClientControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clients = useSelector((state) => state.clients.clients);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  useEffect(() => {
    dispatch(getAllClient());
  }, [dispatch]);

  const handleEdit = (clientId) => {
    navigate(`/business/Client-edit/${clientId}`);
  };

  const handleDelete = (clientId) => {
    setDeleteId(clientId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteClient(deleteId))
      .then((resultAction) => {
        if (deleteClient.fulfilled.match(resultAction)) {
          setSnackbar({
            open: true,
            message: "Client deleted successfully!",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Failed to delete client!",
            severity: "error",
          });
        }
        setOpenDialog(false);
        setDeleteId(null);
        dispatch(getAllClient());
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Something went wrong!",
          severity: "error",
        });
        setOpenDialog(false);
        setDeleteId(null);
      });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  return (
    <LeftNavigationBar
      Content={
        <>
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
                mb: 5,
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
            Client Control
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/business/Client-add")}
            sx={{ mb: 2 }}
          >
            Add New Client
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Action</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {clients &&
                  clients.map((client) => (
                    <TableRow key={client._id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>
                        {" "}
                        {client.image && (
                          <img
                            src={client.image}
                            alt={client.name}
                            style={{ width: "50px", height: "50px" }}
                          />
                        )}{" "}
                      </TableCell>
                      <TableCell>{client?.type}</TableCell>

                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(client._id)}
                          color="primary"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(client._id)}
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
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: "100%", fontWeight: 500 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this program?
            </DialogContent>
            <DialogActions>
              <MuiButton onClick={handleCloseDialog}>Cancel</MuiButton>
              <MuiButton
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
              >
                Delete
              </MuiButton>
            </DialogActions>
          </Dialog>
        </>
      }
    />
  );
};

export default ClientControl;
