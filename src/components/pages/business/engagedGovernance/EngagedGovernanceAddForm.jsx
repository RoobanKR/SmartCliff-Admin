import React, { useEffect, useState } from "react";
import { Typography, TextField, Button, Paper, Container } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { createTestimonial } from "../../../redux/slices/business/placementTestimonial/placementTestimonial";
import { createEngagedGovernance } from "../../../redux/slices/business/engagedGovernance/engagedGovernance";

const EngagedGovernanceAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    designation: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    title: false,
  });

  const validateName = () => {
    if (!title.trim()) {
      setErrors((prev) => ({ ...prev, title: "title is required" }));
    } else {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleTitleChange = (event) => {
    const { value } = event.target;
    const onlyLettersWithSpaceRegex = /^[A-Za-z]+( [A-Za-z]+)?$/;
    if (onlyLettersWithSpaceRegex.test(value) || value === "") {
      setTitle(value);
      setErrors((prev) => ({ ...prev, title: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        title: "Title must contain only letters with one optional space",
      }));
    }
  };

  const handleImageChange = (files) => {
    setImage(files[0]);
    setImageUploaded(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (image && Object.values(errors).every((error) => !error)) {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);

      dispatch(createEngagedGovernance(formData));
      navigate("/engaged_Governance-control");
    } else {
      setErrors((prev) => ({
        ...prev,
        image: "Please upload at least one image",
      }));
    }
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
            <Typography
              gutterBottom
              variant="h4"
              align="center"
              component="div"
              style={{ fontFamily: "Serif" }}
            >
              Add Engaged Governance
            </Typography>
            <form onSubmit={handleSubmit}>
              <DropzoneArea
                onChange={handleImageChange}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an image here or click"
                required
              />
              {errors.image && (
                <span style={{ color: "red" }}>{errors.image}</span>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                value={title}
                onChange={handleTitleChange}
                error={touchedFields.title && Boolean(errors.title)}
                helperText={touchedFields.title && errors.title}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, title: true }))
                }
              />

              <br></br>
              <br></br>

              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#4CAF50", color: "white" }}
                fullWidth
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default EngagedGovernanceAddForm;
