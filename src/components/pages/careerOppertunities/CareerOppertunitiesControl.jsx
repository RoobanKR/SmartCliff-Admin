import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCareerOpportunities,
  deleteCareerOpportunity,
} from "../../redux/slices/careerOppertunities/careerOppertunities";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

const CareerOpportunitiesControl = () => {
  const dispatch = useDispatch();
  const opportunitiesData = useSelector(
    (state) => state.careerOpportunities.opportunitiesData
  );
  const error = useSelector((state) => state.careerOpportunities.error);
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  useEffect(() => {
    dispatch(fetchCareerOpportunities());
  }, [dispatch]);
  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
      console.log("user verify called");
    }
  }, [cookies]);
 

  const handleEdit = (id) => {
    navigate(`/Career_Opportunities-edit/${id}`);
  };

  const handleConfirmDeleteOpen = (index) => {
    setConfirmDeleteOpen(true);
    setDeleteIndex(index);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
    setDeleteIndex(null);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const opportunityId = opportunitiesData[deleteIndex]._id;
      dispatch(deleteCareerOpportunity({ opportunityId, token: cookies.token }))
        .then(() => {
          handleConfirmDeleteClose();
          dispatch(fetchCareerOpportunities());
        })
        .catch((error) => {
          console.error("Error deleting career opportunity: ", error);
        });
    }
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
            Career Opportunities Control
          </Typography>
          <br />
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#0C2233", color: "white" }}
                  >
                    Company Name
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
                {opportunitiesData.map((opportunity, index) => (
                  <TableRow key={index}>
                    <TableCell>{opportunity.company_name}</TableCell>
                    <TableCell>
                      <img
                        src={opportunity.image}
                        alt={opportunity.company_name}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </TableCell>
                    <TableCell>{opportunity.description}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(opportunity._id)}
                        color="primary"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleConfirmDeleteOpen(index)}
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
          <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this career opportunity?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmDeleteClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default CareerOpportunitiesControl;
