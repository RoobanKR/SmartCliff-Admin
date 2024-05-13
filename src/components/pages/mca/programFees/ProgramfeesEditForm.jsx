import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { createProgramFees, getProgramFeesById, updateProgramFees } from "../../../redux/slices/mca/programFees/programfees";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate, useParams } from "react-router-dom";

const ProgramfeesEditForm = () => {
    const { feesId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const programFeesById = useSelector((state) => state.programFees.programFeesById);

  const [icon, setIcon] = useState(null);
  const [error, setError] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");
  const [degreeProgram, setDegreeProgram] = useState(null);
console.log("programFeesById",programFeesById);
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
  
  useEffect(() => {
    dispatch(getProgramFeesById(feesId));
    dispatch(fetchDegreeProgramData()); 
  }, [dispatch, feesId]);

  useEffect(() => {
    if (programFeesById) {
      setTitle(programFeesById.title || "");
      setDescription(programFeesById.description || "");
      setDegreeProgram(programFeesById.degree_program || null);
      setExistingIcon(programFeesById.icon || "");
    }
  }, [programFeesById]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("degree_program", degreeProgram?._id || "");
    if (icon) {
        formData.append("icon", icon);
      }
    try {
      await dispatch(updateProgramFees({ feesId, formData }));
      navigate(`/ProgramFees-control`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Stop loading
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
              Add Program Fees
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
              <TextField
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
                <FormControl fullWidth>
                <Autocomplete
            id="degree_program"
            options={degreeProgramData}
            getOptionLabel={(option) => option.program_name || ""}
            value={degreeProgram}
            onChange={(_, newValue) => setDegreeProgram(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Degree Program"
                fullWidth
              />
            )}
          />
              </FormControl>
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

export default ProgramfeesEditForm;
