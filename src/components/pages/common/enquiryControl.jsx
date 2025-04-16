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
import { deleteEnquiry, getAllEnquiry } from "../../redux/slices/enquiry/enquiry";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

const EnquiryControl = () => {
  const dispatch = useDispatch();   
  const navigate = useNavigate();

  const enquiries = useSelector((state) => state.enquiry.enquires);
 
  const [openDialog, setOpenDialog] = useState(false);
  const [enquiryId, setenquiryId] = useState(null);

  useEffect(() => {
    dispatch(getAllEnquiry());
  }, [dispatch]);

//   const handleEdit = (clientId) => {
//     navigate(`/Client-edit/${clientId}`);
//   };

  const handleDelete = (clientId) => {
    setenquiryId(clientId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteEnquiry(enquiryId))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAllEnquiry());
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
            Enquiry Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>email</TableCell>
                  <TableCell>phone</TableCell>
                  <TableCell>Business</TableCell>
                  <TableCell>Service</TableCell>

                  <TableCell>Action</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {enquiries &&
                  enquiries.map((enquiry) => (
                    <TableRow key={enquiry._id}>
                      <TableCell>{enquiry.name}</TableCell>
                      <TableCell>{enquiry.email}</TableCell>
                      <TableCell>{enquiry.phone}</TableCell>
                      <TableCell>{enquiry?.business_service?.name}</TableCell>

                      <TableCell>{enquiry?.service?.title}</TableCell>

                      <TableCell>
                        <IconButton
                          onClick={() => handleDelete(enquiry._id)}
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

export default EnquiryControl;
