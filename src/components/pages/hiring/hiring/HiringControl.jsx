import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import {
  deleteHiring,
  getAllHiring,
} from "../../../redux/slices/hiring/hiring/Hiring";

const HiringControll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedHiringId, setSelectedHiringId] = useState(null);
  const [cookies, removeCookie] = useCookies(["token"]);

  const allHiring = useSelector((state) => state.hiring.hiring);

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
      dispatch(getAllHiring());
    }
  }, [cookies]);

  const handleEdit = (id) => {
    navigate(`/hiring-edit/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedHiringId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await dispatch(deleteHiring(selectedHiringId, cookies.token));
    setConfirmDialogOpen(false);
    dispatch(getAllHiring());
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
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
            Hiring Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Hiring ID
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Start Date
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    End Date
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allHiring &&
                  allHiring.map((hiring) => (
                    <TableRow key={hiring._id}>
                      <TableCell>{hiring.hiring_id}</TableCell>
                      <TableCell>{hiring.status}</TableCell>
                      <TableCell>{hiring.start_date}</TableCell>
                      <TableCell>{hiring.end_date}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(hiring._id)}
                          color="primary"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(hiring._id)}
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
          <Dialog
            open={confirmDialogOpen}
            onClose={handleCancelDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this hiring entry?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      }
    />
  );
};

export default HiringControll;
