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
import { HelpOutline } from "@mui/icons-material";

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
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={0}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mt={2} mb={2}>
              <Button variant="outlined" color="primary" onClick={handleBack}>
                Back
              </Button>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', flex: 1 }}>
                <Typography variant="h4" sx={{ position: "relative", padding: 0, margin: 0, fontWeight: 300, fontSize: { xs: "32px", sm: "40px" }, color: "#747474", textAlign: "center", textTransform: "uppercase", paddingBottom: "5px", "&::before": { content: '""', width: "28px", height: "5px", display: "block", position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, "&::after ": { content: '""', width: "100px", height: "1px", display: "block", position: "relative", marginTop: "5px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#747474", }, }}>
                Category Add Form
                </Typography>
                <Tooltip title="This is where you can add the execution count for the service." arrow>
                  <HelpOutline sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            </Box>
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
                <form onSubmit={handleSubmit} style={{ border: "2px dotted #D3D3D3", padding: "20px", borderRadius: "8px" }}>
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
                                 variant="contained"
                                 sx={{
                                   display: "block",
                                   marginLeft: "auto",
                                   marginRight: "auto",
                                   mt: 3,
                                   backgroundColor: "#1976d2",
                                   color: "#fff",
                                   "&:hover": {
                                     backgroundColor: "#115293",
                                   },
                                 }}
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
