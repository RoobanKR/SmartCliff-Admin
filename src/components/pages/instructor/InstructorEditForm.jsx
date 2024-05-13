import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup"; // import Yup for validation
import {
  fetchCategories,
  selectCategories,
} from "../../redux/slices/category/category";
import {
  fetchInstructorById,
  updateInstructor,
} from "../../redux/slices/instructor/instructor";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";
import { useCookies } from "react-cookie";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";

const InstructorEditForm = () => {
  const { instructorId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const [cookies] = useCookies(["token"]);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies, dispatch, navigate]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      experience: "",
      qualification: "",
      specialization: "",
      selectedCategories: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      experience: Yup.number()
        .min(0, "Experience cannot be negative")
        .required("Experience is required"),
      qualification: Yup.string().required("Qualification is required"),
      specialization: Yup.string(),
      selectedCategories: Yup.array()
        .of(Yup.string())
        .required("At least one category must be selected"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      if (profilePic) {
        formData.append("profile_pic", profilePic);
      }
      formData.append("description", values.description);
      formData.append("experience", values.experience);
      formData.append("qualification", values.qualification);
      formData.append("specialization", values.specialization);

      const categoryString = values.selectedCategories.join(",");
      formData.append("category", categoryString);

      try {
        await dispatch(updateInstructor({ token: cookies.token, instructorId, formData }));
        navigate("/Instructor-control");
      } catch (error) {
        console.error("Error updating instructor:", error);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCategories());
        const instructorResponse = await dispatch(fetchInstructorById(instructorId));
        const fetchedInstructor = instructorResponse.payload;

        if (!fetchedInstructor) {
          console.error("Instructor data not available");
          return;
        }

        formik.setFieldValue("name", fetchedInstructor.name || "");
        setProfilePic(fetchedInstructor.profile_pic || null);
        formik.setFieldValue("description", fetchedInstructor.description || "");
        formik.setFieldValue("experience", fetchedInstructor.experience || "");
        formik.setFieldValue("qualification", fetchedInstructor.qualification || "");
        const specialization = Array.isArray(fetchedInstructor.specialization)
        ? fetchedInstructor.specialization.join(", ") // Convert array to string if needed
        : fetchedInstructor.specialization || ""; // Default to an empty string
        formik.setFieldValue("specialization", fetchedInstructor.specialization || "");

        const initialSelectedCategories = categories.filter((cat) =>
          fetchedInstructor.category.includes(cat._id)
        );

        formik.setFieldValue(
          "selectedCategories",
          initialSelectedCategories.map((cat) => cat._id)
        );
      } catch (error) {
        console.error("Error fetching instructor details:", error);
      }
    };

    fetchData();
  }, [instructorId, dispatch]);

  const profilePicUrl =
    profilePic && typeof profilePic === "string" ? profilePic : "";

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
              Instructor Edit Form
            </Typography>

            <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    required
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>

                <Grid item xs={12}>
                  <DropzoneArea
                    acceptedFiles={["image/*"]}
                    filesLimit={1}
                    dropzoneText="Drag and drop profile picture here or click"
                    onChange={(fileArray) => {
                      setProfilePic(fileArray[0]);
                    }}
                  />
                  <Typography variant="subtitle1" color="textSecondary" style={{ marginTop: "16px" }}>
                    Existing Profile Picture:
                  </Typography>
                  {profilePicUrl ? (
                    <Typography style={{ marginLeft: "16px" }}>
                      {profilePicUrl.split("/").pop()}
                    </Typography>
                  ) : (
                    <Typography
                      style={{ marginLeft: "16px", fontStyle: "italic" }}
                    >
                      No profile picture available
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="experience"
                    label="Experience"
                    variant="outlined"
                    type="number"
                    required
                    value={formik.values.experience}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.experience && Boolean(formik.errors.experience)}
                    helperText={formik.touched.experience && formik.errors.experience}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="qualification"
                    label="Qualification"
                    variant="outlined"
                    required
                    value={formik.values.qualification}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.qualification && Boolean(formik.errors.qualification)}
                    helperText={formik.touched.qualification && formik.errors.qualification}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="specialization"
                    label="Specialization"
                    variant="outlined"
                    value={formik.values.specialization}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.specialization && Boolean(formik.errors.specialization)}
                    helperText={formik.touched.specialization && formik.errors.specialization}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Categories</InputLabel>
                    <Select
                      multiple
                      value={formik.values.selectedCategories}
                      onChange={(e) => {
                        formik.setFieldValue("selectedCategories", e.target.value);
                      }}
                      renderValue={(selected) =>
                        selected
                          .map(
                            (id) => categories.find((cat) => cat._id === id)?.category_name
                          )
                          .join(", ")
                      }
                      onBlur={formik.handleBlur}
                      error={formik.touched.selectedCategories && Boolean(formik.errors.selectedCategories)}
                      helperText={
                        formik.touched.selectedCategories && formik.errors.selectedCategories
                      }
                    >
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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

export default InstructorEditForm;
