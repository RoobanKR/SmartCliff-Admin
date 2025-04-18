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
} from "@mui/material";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { deleteHighlight, fetchAllHighlights } from "../../../redux/slices/mca/highlights/highlight";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";

const HighlightsControl = () => {
  const dispatch = useDispatch();
  const { highlights } = useSelector((state) => state.highlight);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [cookies, removeCookie] = useCookies(["token"]);

  useEffect(() => {
     if (!cookies.token || cookies.token === undefined) {
       dispatch(resetSignIn());
       navigate("/");
     } else {
       dispatch(userVerify({ token: cookies.token }));
       console.log("user verify called");
     }
   }, [cookies]);
 
  useEffect(() => {
    dispatch(fetchAllHighlights());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Highlight-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteHighlight({token: cookies.token,highlightId:deleteId}))
      .then(() => {
        setOpenDialog(false);
        dispatch(fetchAllHighlights());
      })
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
            Our Program Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Highlight</TableCell>
                  <TableCell>Program</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {highlights.map((highlight) => (
                  <TableRow key={highlight._id}>
                    <TableCell>{highlight.title}</TableCell>
                    <TableCell>{highlight.description}</TableCell>
                    <TableCell>{highlight.highlight}</TableCell>
                    <TableCell>{highlight.degree_program.program_name}</TableCell>

                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(highlight._id)}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(highlight._id)}
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
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this Highlights?
            </DialogContent>
            <DialogActions>
              <MuiButton onClick={handleCloseDialog}>Cancel</MuiButton>
              <MuiButton onClick={handleConfirmDelete} variant="contained" color="error">
                Delete
              </MuiButton>
            </DialogActions>
          </Dialog>
        </>
      }
    />
  );
};

export default HighlightsControl;
