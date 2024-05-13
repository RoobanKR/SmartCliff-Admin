import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { addOurProgram } from "../../../redux/slices/mca/ourProgram/ourProgram";
import { useNavigate } from "react-router-dom";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";

const AddOurProgramForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const degreeProgramData = useSelector((state) => state.degreeProgram.degreeProgramData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.ourProgram);
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
    dispatch(fetchDegreeProgramData());
  }, [dispatch]);

  const handleProgramChange = (_, newValue) => {
    setSelectedProgram(newValue);
  };

  const handleIconChange = (files) => {
    setIcon(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(addOurProgram({ icon, title, description,selectedProgram,token: cookies.token }));
    navigate('/Our_Program-control');
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
              Add Our Program
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
                options={degreeProgramData || []}
                getOptionLabel={(option) => (option ? option.program_name : "")}
                value={selectedProgram}
                onChange={handleProgramChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Program"
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
      }
    />
  );
};

export default AddOurProgramForm;
