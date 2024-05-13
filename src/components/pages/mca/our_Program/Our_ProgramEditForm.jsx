import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Autocomplete,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchOurProgramById,
  updateOurProgram,
} from "../../../redux/slices/mca/ourProgram/ourProgram";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";

const Our_ProgramEditForm = () => {
  const { programId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { selectedProgram } = useSelector((state) => state.ourProgram);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [error, setError] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");
  const [degreeProgram, setDegreeProgram] = useState(null);
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
  const [cookies, removeCookie] = useCookies(["token"]);

  useEffect(() => {
     if (!cookies.token || cookies.token === undefined) {
       dispatch(resetSignIn());
       navigate("/");
     } else {
       dispatch(userVerify({ token: cookies.token }));
       console.log("user verify called");
     }
   }, [cookies]);
 
 
  useEffect(() => {
    dispatch(fetchOurProgramById(programId));
    dispatch(fetchDegreeProgramData()); // Fetch degree program data if needed
  }, [dispatch, programId]);

  useEffect(() => {
    if (selectedProgram) {
      setTitle(selectedProgram.title || "");
      setDescription(selectedProgram.description || "");
      setDegreeProgram(selectedProgram.degree_program || null);
      setExistingIcon(selectedProgram.icon || "");
    }
  }, [selectedProgram]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("degree_program", degreeProgram?._id || "");
    formData.append("icon", icon || existingIcon); // Use the existing icon if no new icon is selected

    try {
      await dispatch(updateOurProgram({ token: cookies.token,programId, formData }));
      navigate(`/Our_Program-control`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleIconChange = (icon) => {
    setIcon(icon[0]); // Set the first icon in the array as the selected icon
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography
          gutterBottom
          variant="h4"
          align="center"
          component="div"
          style={{ fontFamily: "Serif" }}
        >
          Edit Our Program
        </Typography>
        <form onSubmit={handleSubmit}>
          <DropzoneArea
                    onChange={(fileArray) => setIcon(fileArray[0])}
                    acceptedFiles={["image/jpeg", "image/jpg"]}
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

          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#4CAF50", color: "white" }}
            fullWidth
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
          {error && (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default Our_ProgramEditForm;
