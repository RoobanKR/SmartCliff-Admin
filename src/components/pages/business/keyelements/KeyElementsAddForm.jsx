import React, { useState } from "react";
import { Typography, TextField, Button, Paper, Container } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createKeyElements } from "../../../redux/slices/business/keyElements/keyElements";

const KeyElementsAddForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [icon, setIcon] = useState(null);
  const [title, setTitle] = useState("");

  const handleIconChange = (files) => {
    setIcon(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("icon", icon);
    formData.append("title", title);

    dispatch(createKeyElements(formData));
    navigate("/key_elements-control");
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
              Add Key Elements
            </Typography>
            <form onSubmit={handleSubmit}>
              <DropzoneArea
                onChange={handleIconChange}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an icon here or click"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
        </Container>
      }
    />
  );
};

export default KeyElementsAddForm;
