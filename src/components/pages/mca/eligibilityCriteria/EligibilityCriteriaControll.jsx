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
import {
  getAllEligibilityCriteria,
  deleteEligibilityCriteria,
} from "../../../redux/slices/mca/eligibilityCriteria/eligibilityCriteria";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";

const EligibilityCriteriaControll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { eligibilityCriteria } = useSelector(
    (state) => state.eligibilityCriteria
  );

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCriteriaId, setSelectedCriteriaId] = useState(null);
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
    dispatch(getAllEligibilityCriteria());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/EligibilityCriteria-edit/${id}`);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    setSelectedCriteriaId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await dispatch(deleteEligibilityCriteria({token: cookies.token,selectedCriteriaId}));
    setConfirmDialogOpen(false);
    dispatch(getAllEligibilityCriteria()); // Fetch all eligibility criteria again after successful deletion
  };

  const handleCancelDelete = () => {
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
            style={{ fontFamily: "Serif" }}
          >
            Eligibility Criteria Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Subtitle</TableCell>
                  <TableCell>Icon</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eligibilityCriteria &&
                  eligibilityCriteria.map((criteria) => (
                    <TableRow key={criteria._id}>
                      <TableCell>{criteria.description}</TableCell>
                      <TableCell>
                        {criteria.eligibility.map((assessment) =>
                          assessment.assesment.map((item) => (
                            <Typography key={item._id}>
                              {item.subtitle}
                            </Typography>
                          ))
                        )}
                      </TableCell>
                      <TableCell>
                        {criteria.eligibility.map((assessment) =>
                          assessment.assesment.map((item) => (
                            <img
                              key={item._id}
                              src={item.icon}
                              alt="Icon"
                              style={{
                                width: "50px",
                                height: "50px",
                                marginRight: "5px",
                              }}
                            />
                          ))
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(criteria._id)}
                          color="primary"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(criteria._id)}
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
                Are you sure you want to delete this eligibility criteria?
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

export default EligibilityCriteriaControll;
