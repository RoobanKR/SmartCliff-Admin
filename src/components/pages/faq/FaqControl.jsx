import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFAQById,
  fetchAllFAQs,
  selectFAQs,
  selectStatus,
} from "../../redux/slices/faq/faq";

const FaqControl = () => {
  const dispatch = useDispatch();
  const faqData = useSelector(selectFAQs);
  const status = useSelector(selectStatus);
  console.log("FAQ State:", faqData);

  useEffect(() => {
    dispatch(fetchAllFAQs());
  }, [dispatch]);

  const [selectedCategory, setSelectedCategory] = useState("common");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const handleEdit = (index) => {
    console.log(`Edit button clicked for entry at index ${index}`);
  };

  const handleDelete = (faqId) => {
    setDeleteItemId(faqId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = () => {
    if (deleteItemId) {
      dispatch(deleteFAQById(deleteItemId));
    }
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteItemId(null);
    setDeleteConfirmationOpen(false);
  };

  const filteredFAQs = Array.isArray(faqData?.FAQ)
    ? faqData.FAQ.filter(
        (faqItem) => faqItem.category_name === selectedCategory
      )
    : [];

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
            FAQ Control
          </Typography>
          <br />
          {/* Display category links */}
          <div>
            <button onClick={() => setSelectedCategory("common")}>
              Common
            </button>
            <button
              onClick={() => setSelectedCategory("non-common")}
              style={{ marginLeft: "15px" }}
            >
              Non-Common
            </button>
          </div>
          <br />
          {status === "loading" && <p>Loading...</p>}
          {status === "failed" && <p>Error fetching FAQs</p>}
          {status === "idle" && (
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              {filteredFAQs.map((faqItem, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  style={{ height: "100%" }} // Set a fixed height
                >
                  <CardContent>
                    {faqItem.faqItems.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <Typography variant="h6" component="div">
                          Question: {item.question}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Answer: {item.answer}
                        </Typography>
                      </div>
                    ))}
                    <br />
                    <Typography variant="body2" color="text.secondary">
                      Course Name:{" "}
                      {faqItem.course && faqItem.course.course_name}
                    </Typography>
                    <IconButton
                      onClick={() => handleEdit(index)}
                      color="primary"
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(faqItem._id)}
                      color="error"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteConfirmationOpen}
            onClose={handleDeleteCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Confirmation"}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Are you sure you want to delete this item?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirmation}
                color="primary"
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      }
    />
  );
};

export default FaqControl;
