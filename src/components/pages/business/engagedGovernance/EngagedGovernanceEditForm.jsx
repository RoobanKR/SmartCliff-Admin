import React, { useEffect, useState } from "react";
import { Typography, TextField, Button, Paper, Container } from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getByEngagedGovernanceId,
  updateEngagedGovernance,
} from "../../../redux/slices/business/engagedGovernance/engagedGovernance";

const EngagedGovernanceEditForm = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const selectedEngagedGovernanceById = useSelector(
    (state) => state.engagedGovernance.selectedEngagedGovernanceById
  );

  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");

  useEffect(() => {
    dispatch(getByEngagedGovernanceId(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedEngagedGovernanceById) {
      setTitle(selectedEngagedGovernanceById.title || "");
      setExistingIcon(selectedEngagedGovernanceById.image || "");
    }
  }, [selectedEngagedGovernanceById]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    if (image) {
      formData.append("image", image);
    }
    try {
      await dispatch(updateEngagedGovernance({ id, formData }));
      navigate(`/engaged_Governance-control`);
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
              Edit Engaged Governance
            </Typography>
            <form onSubmit={handleSubmit}>
              <DropzoneArea
                onChange={(fileArray) => setImage(fileArray[0])}
                acceptedFiles={["image/jpeg", "image/jpg"]}
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an image here or click"
              />
              <Typography
                variant="subtitle1"
                color="textSecondary"
                style={{ marginTop: "16px" }}
              >
                Existing Image:
              </Typography>
              {existingIcon && (
                <Typography style={{ marginLeft: "16px" }}>
                  {existingIcon.split("/").pop()}
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

export default EngagedGovernanceEditForm;
