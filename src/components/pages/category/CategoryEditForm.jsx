import React, { useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCategoryById,
  updateCategory,
} from "../../redux/slices/category/category";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

const validationSchema = Yup.object({
  category_name: Yup.string().required("Category Name is required"),
  description: Yup.string().required("Description is required"),
  // Removing the requirement for the image
});

const CategoryEditForm = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (!cookies.token) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies, dispatch, navigate]);

  useEffect(() => {
    dispatch(fetchCategoryById(categoryId));
  }, [dispatch, categoryId, cookies]);

  const category = useSelector((state) => state.category.category);

  const initialValues = {
    category_name: category?.category_name || "",
    description: category?.description || "",
    image: null,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("category_name", values.category_name);
    formData.append("description", values.description);

    if (values.image) {
      formData.append("image", values.image);
    } else if (category?.image) {
      // If no new image, re-use the existing image
      const response = await fetch(category.image);
      const arrayBuffer = await response.arrayBuffer();
      const fileName = category.image.split("/").pop();
      const file = new File([arrayBuffer], fileName, {
        type: response.headers.get("content-type"),
      });
      formData.append("image", file);
    }

    try {
      await dispatch(
        updateCategory({
          categoryId,
          formData,
          token: cookies.token,
        })
      );
      navigate("/Category-control");
    } catch (error) {
      console.error("Error updating category:", error);
    }

    setSubmitting(false);
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
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: 'Merriweather, serif',
                fontWeight: 700, textAlign: 'center',
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 5,
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
              Category Edit Form
            </Typography>
            <br />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({
                handleSubmit,
                setFieldValue,
                isSubmitting,
                errors,
                touched,
              }) => (
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Category Name"
                        variant="outlined"
                        name="category_name"
                      />
                      {touched.category_name && errors.category_name && (
                        <Typography variant="body2" color="error">
                          {errors.category_name}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        name="description"
                      />
                      {touched.description && errors.description && (
                        <Typography variant="body2" color="error">
                          {errors.description}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <DropzoneArea
                        acceptedFiles={["image/*"]}
                        filesLimit={1}
                        dropzoneText="Drag and drop an image here or click to upload"
                        onChange={(files) => setFieldValue("image", files[0])}
                      />
                      {touched.image && errors.image && (
                        <Typography variant="body2" color="error">
                          {errors.image}
                        </Typography>
                      )}
                    </Grid>

                    {category?.image && (
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          style={{ marginTop: "16px" }}
                        >
                          Existing Image:
                        </Typography>
                        <img
                          src={category.image}
                          alt="Existing category image"
                          style={{ width: "100%" }}
                        />
                      </Grid>
                    )}
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    disabled={isSubmitting}
                  >
                    Update
                  </Button>
                </form>
              )}
            </Formik>
          </Paper>
        </Container>
      }
    />
  );
};

export default CategoryEditForm;
