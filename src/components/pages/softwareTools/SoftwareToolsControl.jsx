import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Axios from "axios";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import {
  fetchSoftwareTools,
  selectSoftwareTools,
  deleteToolSoftware,
} from "../../redux/slices/softwareTools/softwareTools";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

const SoftwareToolsControl = () => {
  const dispatch = useDispatch();
  const softwareTools = useSelector(selectSoftwareTools);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedToolIndex, setSelectedToolIndex] = useState(null);
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
    dispatch(fetchSoftwareTools());
  }, [dispatch, deleteDialogOpen]); // Update the dependency to refetch on delete

  const handleEdit = (id) => {
    navigate(`/Software_Tools-edit/${id}`);
  };

  const handleDeleteClick = (index) => {
    setSelectedToolIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedToolIndex !== null) {
      await dispatch(deleteToolSoftware({
        token: cookies.token,
        toolsId: softwareTools[selectedToolIndex]._id
      }));
            setDeleteDialogOpen(false);
      setSelectedToolIndex(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedToolIndex(null);
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
            Software Tools Control
          </Typography>
          <br />
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Tools Name
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Image
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {softwareTools.map((tool, index) => (
                  <TableRow key={index}>
                    <TableCell>{tool.software_name}</TableCell>
                    <TableCell>
                      <img
                        src={tool.image}
                        alt={tool.software_name}
                        style={{ maxWidth: "100px" }}
                      />
                    </TableCell>
                    <TableCell>{tool.description}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(tool._id)}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(index)}
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

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this software tool?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Confirm Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default SoftwareToolsControl;
