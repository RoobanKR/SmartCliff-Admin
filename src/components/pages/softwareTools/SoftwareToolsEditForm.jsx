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
  Box,
  IconButton,
  Tooltip,
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
import { ClearIcon } from "@mui/x-date-pickers";
import { HelpOutline } from "@mui/icons-material";

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
  const [keepExistingImage, setKeepExistingImage] = useState(true);
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
        const initialCategories = categoriesResponse.payload;
        const initialSelectedCategories = Array.isArray(initialCategories)
          ? initialCategories.filter((cat) =>
              toolSoftware.category.some(
                (selectedCat) => selectedCat._id === cat._id
              )
            )
          : [];
        setSelectedCategories(initialSelectedCategories);
      } catch (error) {
        console.error("Error fetching software details:", error);
      }
    };

    fetchData();
  }, [toolsId, dispatch]);
  const handleRemoveImage = () => {
    setKeepExistingImage(false);
    setExistingImages([]);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("software_name", softwareName);
    formData.append("description", description);
    formData.append(
      "category",
      selectedCategories.map((cat) => cat._id)
    );

    // Add images to formData
    if (newImages.length > 0) {
      for (const image of newImages) {
        formData.append("image", image);
      }
    } else if (keepExistingImage && existingImages.length > 0) {
      // Only append existing images if we want to keep them
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
    // If neither newImages nor existingImages, no image will be submitted

    try {
      await dispatch(
        updateToolSoftware({ token: cookies.token, toolsId, formData })
      );
      navigate(`/Software_Tools-control`);
    } catch (error) {
      console.error("Error updating tool software:", error);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <LeftNavigationBar
      Content={
        <Container>
          <Box sx={{ maxWidth: 800, margin: "auto", px: 2 }}>
            <Button variant="outlined" color="primary" onClick={handleBack}>
              Back
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  position: "relative",
                  padding: 0,
                  margin: 0,
                  fontWeight: 300,
                  fontSize: { xs: "28px", sm: "36px" },
                  color: "#747474",
                  textAlign: "center",
                  textTransform: "uppercase",
                  paddingBottom: "5px",
                  "&::before": {
                    content: '""',
                    width: "28px",
                    height: "5px",
                    display: "block",
                    position: "absolute",
                    bottom: "3px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#747474",
                  },
                  "&::after": {
                    content: '""',
                    width: "100px",
                    height: "1px",
                    display: "block",
                    position: "relative",
                    marginTop: "5px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#747474",
                  },
                }}
              >
                Software Tools Edit Form
              </Typography>

              <Tooltip
                title="Edit the Software Tool us content and image here"
                arrow
                placement="top"
              >
                <HelpOutline
                  sx={{
                    color: "#747474",
                    fontSize: "24px",
                    cursor: "pointer",
                    ml: 1,
                  }}
                />
              </Tooltip>
            </Box>
          </Box>

          <form
            onSubmit={handleSubmit}
            style={{
              border: "2px dotted #D3D3D3",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
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
                {keepExistingImage && existingImages.length > 0 && (
                  <Box sx={{ position: "relative", mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Current Image:
                    </Typography>
                    <img
                      src={existingImages[0]}
                      alt="Software Tool Preview"
                      style={{
                        width: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                        borderRadius: "8px",
                      }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                      }}
                      onClick={handleRemoveImage}
                      color="secondary"
                    >
                      <ClearIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#ff6d00",
                color: "#fff",
                padding: "8px 24px",
                textTransform: "uppercase",
                borderRadius: "4px",
                mt: 2,
                "&:hover": {
                  backgroundColor: "#e65100",
                },
              }}
            >
              Update
            </Button>
          </form>
        </Container>
      }
    />
  );
};

export default SoftwareToolsEditForm;
