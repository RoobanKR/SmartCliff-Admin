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
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import {
  addCategory,
  resetCategory,
} from "../../redux/slices/category/category";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../redux/slices/user/Signin";

const validationSchema = Yup.object({
  category_name: Yup.string().required("Category Name is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed()
    .required("An image is required")
    .test("fileSize", "Image is too large", (value) => {
      // Optional test for file size (e.g., 2MB)
      return value ? value.size <= 2000000 : false;
    })
    .test("fileFormat", "Unsupported format", (value) => {
      // Optional test for file format
      return value ? ["image/jpeg", "image/png"].includes(value.type) : false;
    }),
});

const CategoryAddForm = () => {
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

  const isSuccess = useSelector((state) => state.category.isSuccess);

  useEffect(() => {
    if (isSuccess) {
      navigate("/Category-control");
      dispatch(resetCategory());
    }
  }, [isSuccess, navigate, dispatch]);

  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("category_name", values.category_name);
    formData.append("description", values.description);
    formData.append("image", values.image);

    dispatch(addCategory({ formData, token: cookies.token }));

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
              gutterBottom
              variant="h4"
              textAlign={"center"}
              component="div"
              fontFamily={"Serif"}
            >
              Category Add Form
            </Typography>
            <br />
            <Formik
              initialValues={{
                category_name: "",
                description: "",
                image: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleSubmit,
                setFieldValue,
                isSubmitting,
                values,
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
                        value={values.category_name}
                        onChange={(e) => setFieldValue("category_name", e.target.value)}
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
                        value={values.description}
                        onChange={(e) => setFieldValue("description", e.target.value)}
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
                        dropzoneText="Drag and drop an image here or click"
                        onChange={(files) => setFieldValue("image", files[0])}
                        name="image"
                      />
                      {touched.image && errors.image && (
                        <Typography variant="body2" color="error">
                          {errors.image}
                        </Typography>
                      )}
                    </Grid>

                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="success"
                    sx={{ mt: 3 }}
                    disabled={isSubmitting}
                  >
                    Submit
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

export default CategoryAddForm;
