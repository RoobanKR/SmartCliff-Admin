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
import {
  deleteEngagedGovernance,
  getAlEngagedGovernance,
} from "../../../redux/slices/business/engagedGovernance/engagedGovernance";

const EngagedGovernanceControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const engagedGovernance = useSelector(
    (state) => state.engagedGovernance.engagedGovernance
  );
  console.log("engagedGovernance", engagedGovernance);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getAlEngagedGovernance());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/engaged_Governance-edit/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteEngagedGovernance(deleteId))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAlEngagedGovernance());
      })
      .catch((error) =>
        console.log("Error deleting engaged_Governance:", error)
      );
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
            gutterBottom
            variant="h4"
            align="center"
            component="div"
            style={{ fontFamily: "Serif" }}
          >
            Engaged Governance Control
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {engagedGovernance &&
                  engagedGovernance.map((engagement) => (
                    <TableRow key={engagement._id}>
                      <TableCell>{engagement.title}</TableCell>
                      <TableCell>
                        {engagement.image && (
                          <img
                            src={engagement.image}
                            alt={engagement.title}
                            style={{ width: "50px", height: "50px" }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(engagement._id)}
                          color="primary"
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(engagement._id)}
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
              Are you sure you want to delete this engaged governance?
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

export default EngagedGovernanceControl;
