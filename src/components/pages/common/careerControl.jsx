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
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { deleteCareerForm, getAllCareerForm } from "../../redux/slices/career/careerForm";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

const CareerControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const careeries = useSelector((state) => state.career.careeries);

  const [openDialog, setOpenDialog] = useState(false);
  const [careerId, setCareerId] = useState(null);

  useEffect(() => {
    dispatch(getAllCareerForm());
  }, [dispatch]);

  const handleDelete = (clientId) => {
    setCareerId(clientId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteCareerForm(careerId))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAllCareerForm());
      })
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCareerId(null);
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
            Career Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Qualification</TableCell>
                  <TableCell>Job Position</TableCell>
                  <TableCell>Resume</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {careeries &&
                  careeries.map((career) => (
                    <TableRow key={career._id}>
                      <TableCell>{career.name}</TableCell>
                      <TableCell>{career.email}</TableCell>
                      <TableCell>{career.phone}</TableCell>
                      <TableCell>{career.qualification}</TableCell>
                      <TableCell>{career.job_position}</TableCell>
                      <TableCell>
                        <a
                          href={career.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <MuiButton variant="contained" color="primary" size="small">
                            Download
                          </MuiButton>
                        </a>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleDelete(career._id)}
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
              Are you sure you want to delete this application?
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

export default CareerControl;
