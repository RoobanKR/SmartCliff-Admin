import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Autocomplete,
  FormControl,
  Tooltip,
  Box,
  useTheme,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import {
  addService,
  resetService,
  selectAddServiceError,
} from "../../../redux/slices/services/services/Services";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { HelpOutline } from "@mui/icons-material";

const ServicesAddForm = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSuccess = useSelector((state) => state.service.isSuccess);
  const error = useSelector(selectAddServiceError);
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );

  const initialValues = {
    title: "",
    slug: "",
    business_services: "",
    description: "",
    icons: [],
  };
  const [touchedFields, setTouchedFields] = useState({
    bussiness_service: false,
  });
  const [errors, setErrors] = useState({
    bussiness_service: "",
  });

  useEffect(() => {
    dispatch(getAllBussinessServices());
  }, [dispatch]);
  useEffect(() => {
    if (businessServiceData.length > 0 && selectedBusinessService) {
      const matchedService = businessServiceData.find(
        (service) => service._id === selectedBusinessService._id
      );
      setSelectedBusinessService(matchedService || null);
    }
  }, [businessServiceData]);

  const handleServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    setTouchedFields((prev) => ({ ...prev, service: true }));
    setErrors((prev) => ({ ...prev, service: "" }));
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .matches(/^[a-zA-Z0-9\s]+$/, "Title can only contain letters and numbers")
      .required("Title is required"),
    slug: Yup.string()
      .matches(
        /^[a-zA-Z0-9-/]+$/,
        "Slug can only contain letters, numbers, hyphens, and slashes"
      )
      .required("Slug is required"),
    description: Yup.string().required("Description is required"),
    icons: Yup.array()
      .min(1, "At least one icon is required")
      .required("Image is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("business_services", values.business_services);
    formData.append("title", values.title);
    formData.append("slug", values.slug);
    formData.append("description", values.description);
    formData.append("business_services", selectedBusinessService._id);

    values.icons.forEach((icon) => {
      formData.append("icon", icon);
    });
    dispatch(addService({ formData, token: cookies.token }));
    setSubmitting(false);
  };

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/Services-control");
      dispatch(resetService());
    }
  }, [isSuccess]);

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={2}
            mb={1}
          >
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: "Merriweather, serif",
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
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
              Service
              <br /> Add Form
            </Typography>

            <Tooltip
              title="This is where you can add the execution count for the service."
              arrow
            >
              <HelpOutline
                sx={{ color: "#747474", fontSize: "24px", cursor: "pointer" }}
              />
            </Tooltip>
          </Box>
          <Paper
            elevation={0}
            sx={{
              padding: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    border: "2px dotted #D3D3D3",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="text"
                        label="Slug"
                        variant="outlined"
                        name="slug"
                        value={values.slug}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        error={Boolean(touched.slug && errors.slug)}
                        helperText={touched.slug && errors.slug}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(
                          touched.description && errors.description
                        )}
                        helperText={touched.description && errors.description}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DropzoneArea
                        acceptedFiles={[
                          "image/*", // This will accept all image types
                          ".jpg",
                          ".jpeg",
                          ".png",
                          ".gif",
                          ".bmp",
                          ".webp",
                          ".svg",
                        ]}
                        filesLimit={5}
                        dropzoneText="Drag and drop images here or click"
                        onChange={(fileArray) =>
                          handleChange({
                            target: { name: "icons", value: fileArray },
                          })
                        }
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="icons"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="Business Services"
                          options={businessServiceData || []}
                          getOptionLabel={(option) => option?.name || ""}
                          value={selectedBusinessService}
                          onChange={handleServiceChange}
                          isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                          } // ✅ Fix: Proper comparison
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Business Services"
                              fullWidth
                              error={Boolean(errors.service)}
                              helperText={
                                touchedFields.service && errors.service
                              }
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      display: "block",
                      marginLeft: "auto",
                      marginRight: "auto",
                      mt: 3, // optional: top margin
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Submit Service Data
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

export default ServicesAddForm;
