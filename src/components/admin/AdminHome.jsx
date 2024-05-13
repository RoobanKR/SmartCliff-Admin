import React, { useEffect } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import LeftNavigationBar from "../navbars/LeftNavigationBar";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useAppDispatch, useAppSelector } from "../redux/hooks/index";
import { resetSignIn, userVerify } from "../redux/slices/user/Signin";

const Component1 = () => (
  
  <Paper style={{ padding: "20px", textAlign: "center" }}>
    <Typography variant="h5">Userlogin details</Typography>
    {/* Add the content of your first component here */}
  </Paper>
);

const Component2 = () => (
  <Paper style={{ padding: "20px", textAlign: "center" }}>
    <Typography variant="h5">Manual</Typography>
    {/* Add the content of your second component here */}
  </Paper>
);

const Component3 = () => (
  <Paper style={{ padding: "20px", textAlign: "center" }}>
    <Typography variant="h5">individual logs</Typography>
    {/* Add the content of your third component here */}
  </Paper>
);

const AdminHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSignIn.user);

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
      console.log("user verify called");
    }
  }, [cookies]);
  return (
    <LeftNavigationBar
      Content={
        <Grid container spacing={2}>
          {/* First row with two grids each taking 6 columns */}
          <Grid item xs={12} sm={6}>
            <Component1 />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Component2 />
          </Grid>

          {/* Second row with one grid taking 12 columns */}
          <Grid item xs={12}>
            <Component3 />
          </Grid>
        </Grid>
      }
    />
  );
};

export default AdminHome;
