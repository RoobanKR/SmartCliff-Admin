import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { deleteDegreeProgram, fetchDegreeProgramData } from '../../../redux/slices/mca/degreeProgram/degreeProgram';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import { useCookies } from 'react-cookie';
import { resetSignIn, userVerify } from '../../../redux/slices/user/Signin';

const DegreeProgramControl = () => {
  const dispatch = useDispatch();
  const degreeProgramData = useSelector((state) => state.degreeProgram.degreeProgramData);
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
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
    dispatch(fetchDegreeProgramData());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/Degree_Program-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteDegreeProgram({ token: cookies.token,degreeProgramId:deleteId}))
      .then(() => {
        // Data deleted successfully, refresh the table
        dispatch(fetchDegreeProgramData());
        setConfirmDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  const handleCloseDialog = () => {
    setDeleteId(null);
    setConfirmDialogOpen(false);
  };

  return (
    <LeftNavigationBar
      Content={
        <>
          <Typography
            gutterBottom
            variant="h4"
            align="center"
            component="div"
            style={{ fontFamily: 'Serif' }}
          >
            Degree Program Control
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: '#0C2233', color: 'white' }}>Title</TableCell>
                  <TableCell style={{ backgroundColor: '#0C2233', color: 'white' }}>Description</TableCell>
                  <TableCell style={{ backgroundColor: '#0C2233', color: 'white' }}>Images</TableCell>
                  <TableCell style={{ backgroundColor: '#0C2233', color: 'white' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {degreeProgramData.map((degree) => (
                  <TableRow key={degree._id}>
                    <TableCell>{degree.title}</TableCell>
                    <TableCell>{degree.description}</TableCell>
                    <TableCell>
                      {degree.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${image.name}`}
                          style={{ width: 50, height: 50, marginRight: 5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(degree._id)}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(degree._id)}
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
          <Dialog open={confirmDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Are you sure you want to delete this entry?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      }
    />
  );
};

export default DegreeProgramControl;
