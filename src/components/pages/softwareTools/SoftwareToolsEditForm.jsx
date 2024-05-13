import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

import {
  fetchCategories,
  selectCategories,
} from "../../redux/slices/category/category";
import {
  fetchToolSoftwareById,
  updateToolSoftware,
} from "../../redux/slices/softwareTools/softwareTools";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

const SoftwareToolsEditForm = () => {
  const { toolsId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const toolSoftware = useSelector(
    (state) => state?.toolSoftware?.toolSoftware
  );

  const [softwareName, setSoftwareName] = useState("");
  const [description, setDescription] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
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
    const fetchData = async () => {
      try {
        const [softwareResponse, categoriesResponse] = await Promise.all([
          dispatch(fetchToolSoftwareById(toolsId)),
          dispatch(fetchCategories()),
        ]);

        const toolSoftware = softwareResponse.payload;

        setSoftwareName(toolSoftware.software_name || "");
        setDescription(toolSoftware.description || "");
        setExistingImages([toolSoftware.image] || []);
        console.log("tool_software", toolSoftware);
        const initialCategories = categoriesResponse.payload;
        const initialSelectedCategories = Array.isArray(initialCategories)
          ? initialCategories.filter((cat) =>
              toolSoftware.category.some(
                (selectedCat) => selectedCat._id === cat._id
              )
            )
          : [];
        setSelectedCategories(initialSelectedCategories);
        console.log("Fetched Categories:", initialCategories);
      } catch (error) {
        console.error("Error fetching software details:", error);
      }
    };

    fetchData();
  }, [toolsId, dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("software_name", softwareName);
    formData.append("description", description);
    formData.append(
      "category",
      selectedCategories.map((cat) => cat._id)
    );

    if (newImages.length > 0) {
      for (const image of newImages) {
        formData.append("image", image);
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

        formData.append("image", file);
      }
    }

    try {
      await dispatch(updateToolSoftware({token: cookies.token, toolsId, formData }));
      navigate(`/Software_Tools-control`);

      const updatedSoftwareDetails = await dispatch(
        fetchToolSoftwareById(toolsId)
      );

      setExistingImages([updatedSoftwareDetails.payload.image] || []);
    } catch (error) {
      console.error("Error updating tool software:", error);
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
              Software Tools Edit Form
            </Typography>
            <br></br>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              {" "}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Software Tools Name"
                    variant="outlined"
                    required
                    value={softwareName}
                    onChange={(e) => setSoftwareName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  {categories.length > 0 && ( // Render Autocomplete only when categories are available
                    <FormControl fullWidth>
                      <InputLabel>Categories</InputLabel>
                      <Select
                        multiple
                        value={selectedCategories.map((cat) => cat._id)}
                        onChange={(e) => {
                          const selectedIds = e.target.value;
                          const selectedCats = categories.filter((cat) =>
                            selectedIds.includes(cat._id)
                          );
                          setSelectedCategories(selectedCats);
                        }}
                        renderValue={(selected) =>
                          selected
                            .map(
                              (value) =>
                                categories.find(
                                  (category) => category._id === value
                                )?.category_name
                            )
                            .join(", ")
                        }
                      >
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.category_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    filesLimit={5}
                    dropzoneText="Drag and drop image here or click"
                    onChange={(fileArray) => setNewImages(fileArray)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    style={{ marginTop: "16px" }}
                  >
                    Existing Images:
                  </Typography>
                  {Array.isArray(existingImages) &&
                    existingImages.map((imageUrl, index) => {
                      const fileName = imageUrl.split("/").pop();
                      return (
                        <Typography key={index} style={{ marginLeft: "16px" }}>
                          {fileName}
                        </Typography>
                      );
                    })}
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

export default SoftwareToolsEditForm;
