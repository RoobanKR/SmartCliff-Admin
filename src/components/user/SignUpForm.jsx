import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  Typography,
  InputLabel,
  Grid,
  FormControl,
  Paper,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  postSignUp,
  resetSignUp,
  selectSignUpState,
} from "../redux/slices/user/Signup";
import LeftNavigationBar from "../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSuccess = useAppSelector((state) => state.userSignUp.isSuccess)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    maxFiles: 1, // Limit to one file

    onDrop: (acceptedFiles) => {
      formik.setFieldValue("profile_pic", acceptedFiles[0]);
    },
  });
  useEffect(() => {
    if (isSuccess) navigate('/signin')
    dispatch(resetSignUp())
}, [navigate, isSuccess])
 

  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    userId: yup.string("Enter your user ID").required("User ID is required"),
    firstName: yup
      .string("Enter your first name")
      .required("First Name is required"),
    lastName: yup
      .string("Enter your last name")
      .required("Last Name is required"),
    phone: yup.string().required("Phone Number is required"),
    city: yup.string("Enter your city name").required("City is required"),
    state: yup.string("Enter your state name").required("State is required"),
    country: yup
      .string("Enter your country name")
      .required("Country is required"),
    password: yup
      .string("Enter your password")
      .min(8, "Password should be of minimum 8 characters length")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("State is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      country: "",
      password: "",
      confirmPassword: "",
      userId: "",
      profile_pic: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(postSignUp(values));
    },
  });

  return (
    <LeftNavigationBar
      Content={
        <div
          style={{
            padding: "16px",
            boxSizing: "border-box",
          }}
        >
          <Paper
            style={{
              width: "100%",
              // maxWidth: "600px",
              margin: "auto",
            }}
          >
            <div style={{ padding: "16px" }}>
              <Typography
                gutterBottom
                variant="h4"
                textAlign={"center"}
                component="div"
                fontFamily={"Serif"}
              >
                Add Admin Form
              </Typography>{" "}
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="signup-userId"
                      name="userId"
                      label="User ID"
                      value={formik.values.userId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.userId && Boolean(formik.errors.userId)
                      }
                      helperText={formik.touched.userId && formik.errors.userId}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="signup-firstName"
                      name="firstName"
                      label="FIrst Name"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.firstName &&
                        Boolean(formik.errors.firstName)
                      }
                      helperText={
                        formik.touched.firstName && formik.errors.firstName
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="signup-lastName"
                      name="lastName"
                      label="Last Name"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.lastName &&
                        Boolean(formik.errors.lastName)
                      }
                      helperText={
                        formik.touched.lastName && formik.errors.lastName
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="signup-phone"
                      name="phone"
                      label="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.phone && Boolean(formik.errors.phone)
                      }
                      helperText={formik.touched.phone && formik.errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="signup-city"
                      name="city"
                      label="City"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.city && Boolean(formik.errors.city)}
                      helperText={formik.touched.city && formik.errors.city}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="signup-state"
                      name="state"
                      label="State"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.state && Boolean(formik.errors.state)
                      }
                      helperText={formik.touched.state && formik.errors.state}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="signup-country"
                      name="country"
                      label="Country"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.country && Boolean(formik.errors.country)
                      }
                      helperText={
                        formik.touched.country && formik.errors.country
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="signup-password"
                      name="password"
                      label="Password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                      helperText={
                        formik.touched.password && formik.errors.password
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="signup-confirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.confirmPassword &&
                        Boolean(formik.errors.confirmPassword)
                      }
                      helperText={
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <div {...getRootProps()} style={dropzoneStyle}>
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <Typography>Drop profile picture here</Typography>
                        ) : (
                          <Typography>
                            Drag 'n' drop or click to select profile picture
                          </Typography>
                        )}
                      </div>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      id="signup-submit"
                      variant="contained"
                      type="Submit"
                      color="success"
                      style={{ alignContent: "center" }}
                    >
                      Sign Up
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Paper>
        </div>
      }
    />
  );
};

export default SignUpForm;

const dropzoneStyle = {
  border: "2px dashed #0087F7",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  height: "100px",
  marginTop: "16px",
};
