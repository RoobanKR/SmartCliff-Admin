import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Link,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks/index";
import { useFormik } from "formik";
import * as yup from "yup";
import backgroundImage from "../images/background.jpg";
import axios from "axios";
import { postSignIn } from "../redux/slices/user/Signin";
import { useCookies } from "react-cookie";

const LoginForm = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userSignIn.user);
  const token = useAppSelector((state) => state.userSignIn.token);
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(["token"]);

  useEffect(() => {
    if (token !== "") {
      setCookie("token", token);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      navigate("/adminHome");
    }
  }, [navigate, user]);

  const validationSchema = yup.object({
    email: yup.string("Enter your email").required("Email is required"),
    password: yup
      .string("Enter your password")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(postSignIn(values));
    },
  });

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "95vh" }}
        >
          <Card
            sx={{
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <CardContent>
              <Typography
                gutterBottom
                variant="h4"
                textAlign={"center"}
                component="div"
                fontFamily={"Serif"}
              >
                Log in to your account
              </Typography>
              <form
                onSubmit={formik.handleSubmit}
                style={{ width: "100%", marginTop: 2 }}
              >
                <TextField
                  fullWidth
                  id="signin-email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  margin="normal"
                  data-test="email-input"
                />
                <TextField
                  fullWidth
                  id="signin-password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  margin="normal"
                  data-test="Password-input"
                />
                <Link href="forgotpassword" variant="body2" mt={2} mb={3}>
                  Forgot Password?
                </Link>
                <Button
                  id="signin-submit"
                  variant="contained"
                  type="submit"
                  fullWidth
                  color="success"
                  data-test="submit-button"
                  sx={{ marginTop: "12px" }}
                >
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </div>
  );
};

export default LoginForm;
