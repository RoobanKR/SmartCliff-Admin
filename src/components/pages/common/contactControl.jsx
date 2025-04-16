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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { getAllClient } from "../../redux/slices/services/client/Client";
import { deleteContact, getAllContact } from "../../redux/slices/contact/contact";
import { format } from "date-fns";

const ContactControl = () => {
  const dispatch = useDispatch();   
  const navigate = useNavigate();

  const contacts = useSelector((state) => state.contact.contacts);
 
  const [openDialog, setOpenDialog] = useState(false);
  const [contactId, setenquiryId] = useState(null);

  useEffect(() => {
    dispatch(getAllContact());
  }, [dispatch]);

//   const handleEdit = (clientId) => {
//     navigate(`/Client-edit/${clientId}`);
//   };

  const handleDelete = (clientId) => {
    setenquiryId(clientId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteContact(contactId))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAllContact());
      })
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setenquiryId(null);
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
            Contact Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>email</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>createdAt</TableCell>

                  <TableCell>Action</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts &&
                  contacts.map((contact) => (
                    <TableRow key={contact._id}>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.message}</TableCell>
                      <TableCell>
                      {format(new Date(contact.createdAt), "EEE/MMM/yyyy hh:mm a")}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleDelete(contact._id)}
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

export default ContactControl;
