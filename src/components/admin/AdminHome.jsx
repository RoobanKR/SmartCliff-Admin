import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Tooltip,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Box,
  Avatar,
} from "@mui/material";
import LeftNavigationBar from "../navbars/LeftNavigationBar";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useAppDispatch, useAppSelector } from "../redux/hooks/index";
import { resetSignIn, userVerify } from "../redux/slices/user/Signin";
import ContactControl from "../pages/common/contactControl";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  CheckBoxOutlineBlank,
  SettingsInputComponent,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getAllUsers } from "../redux/slices/user/admin";
import {
  fetchJobPositions,
  updateSelectedJobPosition,
} from "../redux/slices/joinus/joinus";

const label = { inputProps: { "aria-label": "Switch demo" } };

const AdminHome = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSignIn.user);
  const [checked, setChecked] = useState(true);
  const users = useSelector((state) => state.admin.users) || [];
  useEffect(() => {
    const fetchUsers = async () => {
      await dispatch(getAllUsers({ token: cookies.token }));
    };
    fetchUsers();
  }, [dispatch, cookies.token]);

  const handleSwitchChange = (event) => {
    setChecked(event.target.checked);
  };
  const jobPositions = useSelector((state) => state.joinUs?.jobPositions || []);

  useEffect(() => {
    dispatch(fetchJobPositions());
  }, [dispatch]);

  const handleToggle = async (id, selected) => {
    await dispatch(updateSelectedJobPosition({ id, selected: !selected }));
    dispatch(fetchJobPositions());
  };

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies]);

  return (
    <LeftNavigationBar
      Content={
        <>
          <Card
            className="md:col-span-2 shadow-xl h-[20vh] relative bg-cover bg-center overflow-hidden"
            style={{
              backgroundImage:
                'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJwgZg6RTN_WfJh_T0HOzBTwShU1sug7dLZg&s")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            {/* White transparent overlay with soft inner shadow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                boxShadow: "inset 0 0 60px rgba(0, 0, 0, 0.3)",
                zIndex: 0,
              }}
            />

            <CardContent className="relative z-10 flex justify-between items-center h-full p-6 text-white">
              <div className="p-4 rounded-md">
                <Typography
                  variant="h4"
                  sx={{ color: "#ffff", fontWeight: 600 }}
                >
                  Welcome back,{" "}
                  <span style={{ color: "#ffff", fontWeight: 800 }}>
                    {user?.firstName || "User"}!
                  </span>
                </Typography>
                <Typography style={{ color: "#ffff" }}>
                  <span style={{ color: "#FF5722", fontWeight: 600 }}>
                    SmartCliff
                  </span>{" "}
                  Shapping success through Learning!
                </Typography>
                {/* <Typography style={{ color: "#ffff" }}>
                  Progress is{" "}
                  <span style={{ color: "#FF5722", fontWeight: 600 }}>
                    very good!
                  </span>
                </Typography> */}
              </div>
            </CardContent>
          </Card>
          <br></br>
          <Grid container spacing={2}>
            {/* First row with two grids each taking 6 columns */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={3}
                sx={{
                  backgroundColor: "#F5F5F5", // Light background color
                  padding: 3,
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#2A5D84" }}
                >
                  Admin Panel Instructions
                </Typography>
                <Typography sx={{ marginTop: 2, color: "#555" }}>
                  Welcome to the Admin Panel! Here are some important
                  instructions to follow:
                </Typography>
                <ul>
                  <li>
                    <Typography sx={{ color: "#405D72" }}>
                      <strong>Manage Users:</strong> You can add, update, or
                      remove users from the system.
                    </Typography>
                  </li>
                  <li>
                    <Typography sx={{ color: "#405D72" }}>
                      <strong>Monitor Placements:</strong> Track the status of
                      placement drives and student registrations.
                    </Typography>
                  </li>
                  <li>
                    <Typography sx={{ color: "#405D72" }}>
                      <strong>Update Data:</strong> Ensure all placement and
                      student data is up-to-date for smooth operations.
                    </Typography>
                  </li>
                </ul>
              </Paper>
            </Grid>

            {/* Second Content Block */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Career Job Position
                </Typography>
                <Grid container spacing={2} mt={1}>
                  {jobPositions.map((job) => (
                    <Grid item xs={6} key={job._id}>
                      <Card
                        sx={{
                          bgcolor: job.selected ? "#8B5CF6" : "#BDBDBD",
                          color: "white",
                          p: 2,
                        }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography>{job.job_position}</Typography>
                          <Switch
                            checked={job.selected || false}
                            onChange={() => handleToggle(job._id, job.selected)}
                            color="default"
                          />
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>

              <Card sx={{ mt: 3, p: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Members
                </Typography>
                <Box display="flex" mt={2} gap={2} flexWrap="wrap">
                  {users?.map((user, i) => (
                    <Box textAlign="center" key={user._id}>
                      <Avatar
                        alt={user.firstName}
                        src={user.profile_pic}
                        sx={{ bgcolor: "#8B5CF6" }}
                      >
                        {user.firstName?.[0]}
                      </Avatar>
                      <Typography variant="caption">
                        {user.firstName}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
      }
    />
  );
};

export default AdminHome;
