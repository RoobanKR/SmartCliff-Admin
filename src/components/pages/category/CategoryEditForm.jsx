import React, { useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Box,
  Tooltip,
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
import { HelpOutline } from "@mui/icons-material";

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
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <LeftNavigationBar
      Content={
        <Container  sx={{ maxWidth: 800, margin: "auto", px: 2 }}>
             <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap={1}
                        mt={3}
                        mb={2}
                      >
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleBack}
                        >
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
              Category Edit Form
              </Typography>
            
                          <Tooltip
                            title="Edit the about us content and image here"
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
                <form onSubmit={handleSubmit}   style={{
                  border: "2px dotted #D3D3D3",
                  padding: "20px",
                  borderRadius: "8px",
                }}>
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
                          style={{ width: "10%" }}
                        />
                      </Grid>
                    )}
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
                    disabled={isSubmitting}
                  >
                    Update
                  </Button>
                </form>
              )}
            </Formik>
          {/* </Paper> */}
        </Container>
      }
    />
  );
};

export default CategoryEditForm;
