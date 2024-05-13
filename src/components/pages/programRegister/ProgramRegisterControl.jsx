import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";
import {
  fetchAllProgramApplications,
  deleteProgramApplicationById,
  updateProgramApplication,
} from "../../redux/slices/registerProgram/RegisterProgram";
import { Close } from "@material-ui/icons";

const ProgramRegisterControl = () => {
  const dispatch = useDispatch();
  const programApplications = useSelector(
    (state) => state.programApplications.programApplications
  );
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [actionType, setActionType] = useState(""); // 'delete' or 'confirm'
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    dispatch(fetchAllProgramApplications());
  }, [dispatch]);
  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies]);

  const handleDelete = (id) => {
    setActionType("delete");
    setActionId(id);
    setModalOpen(true);
  };

  const handleConfirm = (id) => {
    setActionType("confirm");
    setActionId(id);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setActionId(null);
    setActionType("");
  };

  const handleModalConfirm = () => {
    if (actionType === "delete") {
      dispatch(deleteProgramApplicationById(actionId));
    } else if (actionType === "confirm") {
      dispatch(updateProgramApplication({ id: actionId, status: "confirmed" }));
    }
    handleModalClose();
  };

  const confirmedRegistrations = programApplications.filter(
    (program) => program.status === "confirmed"
  );

  const pendingRegistrations = programApplications.filter(
    (program) => program.status !== "confirmed"
  );

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageDialogOpen(true);
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
            Degree Program Register Control
          </Typography>
          <br />
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Student Name
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Proof Screenshot
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Transaction ID
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Phone Number
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRegistrations.map((program) => (
                  <TableRow key={program._id}>
                    <TableCell>{program.name}</TableCell>
                    <TableCell>
                      <img
                        src={program.image}
                        alt={program.name}
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleImageClick(program.image)}
                      />
                    </TableCell>
                    <TableCell>{program.Tid}</TableCell>
                    <TableCell>{program.phone}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDelete(program._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleConfirm(program._id)}
                        style={{ marginLeft: "20px" }}
                      >
                        Confirm
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {confirmedRegistrations.length > 0 && (
            <>
              <br />
              <Typography
                gutterBottom
                variant="h4"
                textAlign={"center"}
                component="div"
                fontFamily={"Serif"}
              >
                Confirmed Registrations
              </Typography>
              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{ backgroundColor: "#0C2233", color: "white" }}
                      >
                        Student Name
                      </TableCell>
                      <TableCell
                        style={{ backgroundColor: "#0C2233", color: "white" }}
                      >
                        Proof Screenshot
                      </TableCell>
                      <TableCell
                        style={{ backgroundColor: "#0C2233", color: "white" }}
                      >
                        Transaction ID
                      </TableCell>
                      <TableCell
                        style={{ backgroundColor: "#0C2233", color: "white" }}
                      >
                        Phone Number
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {confirmedRegistrations.map((program) => (
                      <TableRow key={program._id}>
                        <TableCell>{program.name}</TableCell>
                        <TableCell>
                          <img
                            src={program.image}
                            alt={program.name}
                            style={{
                              maxWidth: "100px",
                              maxHeight: "100px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleImageClick(program.image)}
                          />
                        </TableCell>
                        <TableCell>{program.Tid}</TableCell>
                        <TableCell>{program.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* Image Dialog */}
          <Dialog
            open={imageDialogOpen}
            onClose={() => setImageDialogOpen(false)}
            aria-labelledby="image-dialog-title"
            maxWidth="lg"
          >
            <DialogActions>
              <IconButton
                onClick={() => setImageDialogOpen(false)}
                color="primary"
              >
                <Close />
              </IconButton>
            </DialogActions>
            <DialogTitle id="image-dialog-title">View Screenshot</DialogTitle>
            <DialogContent>
              <img
                src={selectedImage}
                alt="View"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </DialogContent>
          </Dialog>

          {/* Confirmation Dialog */}
          <Dialog
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {actionType === "delete"
                ? "Delete Program Application"
                : "Confirm Program Application"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {actionType === "delete"
                  ? "Are you sure you want to delete this program application?"
                  : "Are you sure you want to confirm this program application?"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModalClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleModalConfirm} color="primary" autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default ProgramRegisterControl;
