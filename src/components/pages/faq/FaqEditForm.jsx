import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Autocomplete,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useParams } from "react-router-dom";
import axios from "axios";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import {
  fetchCategories,
  selectCategories,
} from "../../redux/slices/category/category";
import { useDispatch, useSelector } from "react-redux";
import { fetchFAQById, updateFAQ } from "../../redux/slices/faq/faq"; // Import the new async thunk

const FAQEditForm = () => {
  const { faqId } = useParams();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const faq = useSelector((state) => state.faq.faq);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchFAQDetails = async () => {
      try {
        const [faqResponse, categoriesResponse] = await Promise.all([
          dispatch(fetchFAQById(faqId)),
          dispatch(fetchCategories()),
        ]);

        const fetchedFAQ = faqResponse.payload;

        if (!fetchedFAQ) {
          console.error("FAQ data not available");
          return;
        }

        const { question, answer, category } = fetchedFAQ;

        setQuestion(question || "");
        setAnswer(answer || "");

        // Wait for the categories to be fetched before setting the initial selected category
        const initialCategories = categoriesResponse.payload;
        const initialSelectedCategory = initialCategories.find(
          (cat) => cat._id === category
        );

        setSelectedCategory(initialSelectedCategory);

        console.log("State after setting values:", {
          question,
          answer,
          category,
        });
      } catch (error) {
        console.error("Error fetching FAQ details:", error);
      }
    };

    fetchFAQDetails();
  }, [faqId, dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("question", question);
    formData.append("answer", answer);
    formData.append("category", selectedCategory?._id);

    try {
      await dispatch(updateFAQ({ faqId, formData }));

      const updatedFAQDetails = await dispatch(fetchFAQById(faqId));
      // Handle the updated data as needed

      console.log("FAQ updated successfully");
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={3}
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              gutterBottom
              variant="h4"
              textAlign={"center"}
              component="div"
              fontFamily={"Serif"}
            >
              FAQ Edit Form
            </Typography>
            <br></br>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Question"
                    variant="outlined"
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Answer"
                    variant="outlined"
                    multiline
                    rows={4}
                    required
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={selectedCategory?._id || ""}
                      onChange={(e) => {
                        const categoryId = e.target.value;
                        const selectedCat = categories.find(
                          (cat) => cat._id === categoryId
                        );
                        setSelectedCategory(selectedCat);
                      }}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                Update
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default FAQEditForm;
