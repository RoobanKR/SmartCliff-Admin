import React, { useEffect, useState } from "react";
import { Typography, TextField, Button, Paper, Container } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getKeyElementsById,
  updateKeyElements,
} from "../../../redux/slices/business/keyElements/keyElements";

const KeyElementsEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState(null);
  const [error, setError] = useState(null);
  const keyElementsById = useSelector(
    (state) => state.keyElements.Key_Element_Id_Based // Accessing correct state variable
  );

  useEffect(() => {
    dispatch(getKeyElementsById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (keyElementsById) {
      setTitle(keyElementsById.title || "");
    }
  }, [keyElementsById]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    if (icon) {
      formData.append("icon", icon);
    }
    try {
      await dispatch(updateKeyElements({ id, formData }));
      navigate(`/key_elements-control`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
              Edit Key Elements
            </Typography>
            <form onSubmit={handleSubmit}>
              <DropzoneArea
                onChange={(fileArray) => setIcon(fileArray[0])}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an icon here or click"
              />
              <Typography
                variant="subtitle1"
                color="textSecondary"
                style={{ marginTop: "16px" }}
              >
                Existing Image:
              </Typography>
              {keyElementsById && keyElementsById.icon && (
                <Typography style={{ marginLeft: "16px" }}>
                  {keyElementsById.icon.split("/").pop()}
                </Typography>
              )}

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
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
            {error && (
              <Typography variant="body1" color="error" align="center">
                {error}
              </Typography>
            )}
          </Paper>
        </Container>
      }
    />
  );
};

export default KeyElementsEditForm;
