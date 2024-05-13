import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchDegreeProgramById,
  updateDegreeProgram,
} from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";

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

const DegreeProgramEditForm = () => {
  const { degreeProgramId } = useParams();

  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const degreeProgram = useSelector(
    (state) => state.degreeProgram.selectedDegreeProgram
  );

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [programName, setProgramName] = useState("");
  const [slogan, setSlogan] = useState("");
  useEffect(() => {
    dispatch(fetchDegreeProgramById(degreeProgramId));
  }, [dispatch, degreeProgramId]);

  useEffect(() => {
    if (!degreeProgram) {
      dispatch(fetchDegreeProgramById(degreeProgramId));
    } else {
      setProgramName(degreeProgram.program_name || "");
      setSlogan(degreeProgram.slogan || "");

      setTitle(degreeProgram.title || "");
      setSlug(degreeProgram.slug || "");
      setDescription(degreeProgram.description || "");
      setExistingImages(degreeProgram.images || []);
    }
  }, [dispatch, degreeProgramId, degreeProgram]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("program_name", programName);
    formData.append("slogan", slogan);
    if (newImages.length > 0) {
      for (const image of newImages) {
        formData.append("images", image);
      }
    } else {
      for (const imageUrl of existingImages) {
        const fileNameWithTimestamp = imageUrl.split("/").pop();
        const fileNameWithoutTimestamp = fileNameWithTimestamp.replace(
          /^\d+_/,
          ""
        );
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const file = new File([arrayBuffer], fileNameWithoutTimestamp, {
          type: response.headers.get("content-type"),
        });

        formData.append("images", file);
      }
    }
    try {
      await dispatch(updateDegreeProgram({ degreeProgramId, formData }));
      navigate(`/Degree_Program-control`);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImageChange = (images) => {
    setNewImages(images);
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
            Degree Program Edit Form
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
              acceptedFiles={["image/*"]}
              filesLimit={5}
              dropzoneText="Drag and drop images here or click"
              onChange={(fileArray) => setNewImages(fileArray)}
            />
            <Typography
              variant="subtitle1"
              color="textSecondary"
              style={{ marginTop: "16px" }}
            >
              Existing Images:
            </Typography>
            {existingImages.map((imageUrl, index) => {
              const fileName = imageUrl.split("/").pop();
              return (
                <Typography key={index} style={{ marginLeft: "16px" }}>
                  {fileName}
                </Typography>
              );
            })}
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
              className={classes.submit}
            >
              Submit
            </Button>
            {error && (
              <Typography variant="body1" color="error">
                Failed to submit: {error}
              </Typography>
            )}
          </form>
        </Paper>
      }
    />
  );
};

export default DegreeProgramEditForm;
