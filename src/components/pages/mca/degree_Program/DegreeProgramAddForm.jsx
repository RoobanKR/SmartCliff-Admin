import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { Typography } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createDegreeProgram } from "../../../redux/slices/mca/degreeProgram/degreeProgram";

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
}));

const DegreeProgramAddForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.degreeProgram.loading);
  const error = useSelector((state) => state.degreeProgram.error);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [programName, setProgramName] = useState("");
  const [slogan, setSlogan] = useState("");
  const handleImageChange = (files) => {
    setSelectedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("program_name", programName);
    formData.append("slogan", slogan);

    // Append each selected image to the FormData
    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await dispatch(createDegreeProgram({formData,formData}));
      // If successful, navigate to the next page
      // navigate("/Degree_Program-control");
    } catch (error) {
      console.error("Error submitting form:", error);
      // If failed, show the error
      // You can set up state to store and display the error in your UI
    }
  };

  return (
    <LeftNavigationBar
      Content={
        <Paper className={classes.paper} elevation={3}>
          <Typography
            gutterBottom
            variant="h4"
            align="center"
            component="div"
            style={{ fontFamily: "Serif" }}
          >
            Degree Program Add Form
          </Typography>
          <br />
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="programName"
              label="Program Name"
              name="programName"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="slogan"
              label="Slogan"
              name="slogan"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
            />
            <DropzoneArea
              onChange={handleImageChange}
              acceptedFiles={["image/*"]}
              filesLimit={3}
              showPreviews={false}
              showPreviewsInDropzone={true}
              dropzoneText="Drag and drop an image here or click"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="slug"
              label="Slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
      }
    />
  );
};

export default DegreeProgramAddForm;
