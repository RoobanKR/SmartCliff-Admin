import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Logout,
  DesignServices,
  Business,
  AbcOutlined,
  WifiProtectedSetupSharp,
  Man3Outlined,
  FormatOverline,
  SupervisedUserCircle,
  DesignServicesRounded,
  HighlightAlt,
  HighQualityOutlined,
  WorkOff,
  School,
  Terminal,
  Highlight,
  SystemSecurityUpdateRounded,
  VerticalAlignBottom,
  VerticalAlignCenter,
  Person3TwoTone,
  SportsOutlined,
  VerifiedUserOutlined,
  GolfCourse,
  PanToolSharp,
  Category,
  GolfCourseTwoTone,
  StayCurrentPortrait,
  BusinessCenter,
  AddBusinessTwoTone,
  BusinessRounded,
  LeakRemoveTwoTone,
  AdbOutlined,
  VisibilityOutlined,
  ShieldMoon,
  CommentOutlined,
  Reviews,
  Numbers,
  HighQualityRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { Collapse, Menu, MenuItem, Tooltip } from "@mui/material";
import logo from "../images/smartcliff-logo.png";
import "../navbars/Navbar.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useCookies } from "react-cookie";
import { Add as AddIcon, Storage as ControlIcon } from "@mui/icons-material";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EventIcon from "@mui/icons-material/Event";
import BookIcon from "@mui/icons-material/Book";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CodeIcon from "@mui/icons-material/Code";
import {
  BusinessCenterSharp,
  CheckCircle,
  LocalPostOfficeOutlined,
  PriorityHighTwoTone,
} from "@material-ui/icons";
import StepsIcon from "@material-ui/icons/ViewList";
import { resetSignIn, userVerify } from "../redux/slices/user/Signin";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 
import {
  faBusinessTime,
  faGraduationCap,
  faMessage,
  faComment,
  faQuestion,
  faAddressCard,
  faHome,
  faHistory,
} from "@fortawesome/free-solid-svg-icons"; // Import your desired icons
 
const drawerWidth = 300;
 
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});
 
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
 
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
 
const orangeIconStyle = {
  color: "#1976d2",
};
 
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
 
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
 
export default function LeftNavigationBar({ Content }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const [anchorEl, setAnchorEl] = React.useState(false);
 
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [dropdownStates, setDropdownStates] = React.useState({});
 
  const opens = Boolean(anchorEl);
 
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleDrawerOpen = () => {
    setOpen(true);
  };
 
  const handleDrawerClose = () => {
    setOpen(false);
  };
 
  React.useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
      console.log("user verify called");
    }
  }, [cookies]);
 
  const handleDropdownToggle = (dropdown) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };
 
  const handleLogout = () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
 
    dispatch(resetSignIn());
    navigate(0);
  };
 
  const handleNavigation = (dropdown, action) => {
    const routes = {
      control: `/${dropdown}-control`,
      control: `/${dropdown}-control`,
    };
 
    navigate(routes[action]);
  };
 
  const modules = [
    {
      text: "Services",
      icon: <FontAwesomeIcon icon={faBusinessTime} style={orangeIconStyle} />,
      dropdown: "Services",
      submodules: [
        {
          text: "Business Services",
          link: "Business-Services",
          icon: <Business style={orangeIconStyle} />,
        },
        {
          text: "Services",
          link: "Services",
          icon: <DesignServicesRounded style={orangeIconStyle} />,
        },
        {
          text: "Services About",
          link: "Services-About",
          icon: <AbcOutlined style={orangeIconStyle} />,
        },
        {
          text: "Services Process",
          link: "Services-Process",
 
          icon: <WifiProtectedSetupSharp style={orangeIconStyle} />,
        },
        {
          text: "Execution Highlights",
          link: "Execution_Highlights",
          icon: <HighlightAlt style={orangeIconStyle} />,
        },
        {
          text: "Execution Overview",
          link: "Execution_Overview",
          icon: <HighQualityOutlined style={orangeIconStyle} />,
        },
        {
          text: "Placement Training Track",
          link: "Placement-Training-Track",
          icon: <WorkOff style={orangeIconStyle} />,
        },
        {
          text: "Services Opportunity",
          link: "Services-Opportunity",
          icon: <SupervisedUserCircle CircleOutlined style={orangeIconStyle} />,
        },
      ],
    },
    {
      text: "Degree Program",
      icon: <AccountBalanceIcon style={orangeIconStyle} />,
      dropdown: "Degree Program",
      submodules: [
        {
          text: "College",
          link: "College",
          icon: (
            <FontAwesomeIcon icon={faGraduationCap} style={orangeIconStyle} />
          ),
        },
        {
          text: "Company",
          link: "degreeprogram/company",
          icon: <LocalPostOfficeOutlined style={orangeIconStyle} />,
        },
        {
          text: "Degree Program",
          link: "Degree_Program",
          icon: <Terminal style={orangeIconStyle} />,
        },
 
        {
          text: "Our Program",
          link: "Our_Program",
          icon: <Highlight style={orangeIconStyle} />,
        },
        {
          text: "Semester(Learning Path)",
          link: "Semester",
          icon: <SystemSecurityUpdateRounded style={orangeIconStyle} />,
        },
        {
          text: "Skill Vertical",
          link: "degreeprogram/skill-vertical",
          icon: <VerticalAlignCenter style={orangeIconStyle} />,
        },
        {
          text: "Outcomes",
          link: "Outcomes",
          icon: <CheckCircle style={orangeIconStyle} />,
        },
        {
          text: "Our Partners",
          link: "degreeprogram/our-partners",
          icon: <Person3TwoTone style={orangeIconStyle} />,
        },
        {
          text: "Our Sponosrs",
          link: "degreeprogram/our-sponosrs",
          icon: <SportsOutlined style={orangeIconStyle} />,
        },
        {
          text: "Target Student",
          link: "degreeprogram/target-student",
          icon: <VerifiedUserOutlined style={orangeIconStyle} />,
        },
      ],
    },
    {
      text: "Program",
      icon: <GolfCourse style={orangeIconStyle} />,
      dropdown: "Program",
      submodules: [
        {
          text: "Category",
          link: "Category",
          icon: <Category style={orangeIconStyle} />,
        },
        {
          text: "Software Tools",
          link: "Software_Tools",
          icon: <PanToolSharp style={orangeIconStyle} />,
        },
        {
          text: "Course",
          link: "Course",
          icon: <GolfCourseTwoTone style={orangeIconStyle} />,
        },
      ],
    },
    {
      text: "Bussiness",
      icon: <BusinessCenterSharp style={orangeIconStyle} />,
      dropdown: "Bussiness",
      submodules: [
        {
          text: "Current Availability",
          link: "business/current-availability",
          icon: <StayCurrentPortrait style={orangeIconStyle} />,
        },
        {
          text: "Why Can you",
          link: "business/wcy-hire",
          icon: <BusinessCenter style={orangeIconStyle} />,
        },
        {
          text: "How It Work",
          // link: "business/wcy-hire",
          icon: <BusinessRounded style={orangeIconStyle} />,
        },
        {
          text: "Client",
          link: "business/Client",
          icon: <AddBusinessTwoTone style={orangeIconStyle} />,
        },
        {
          text: "Learning Journey",
          link: "business/learningjourney",
          icon: <LeakRemoveTwoTone style={orangeIconStyle} />,
        },
      ],
    },
 
    {
      text: "About",
      icon: <FontAwesomeIcon icon={faAddressCard} style={orangeIconStyle} />,
      dropdown: "About",
      submodules: [
        {
          text: "About Us",
          link: "about/aboutus",
          icon: <StayCurrentPortrait style={orangeIconStyle} />,
        },
        {
          text: "Vsion & Mission",
          link: "about/vision-mission",
          icon: <VisibilityOutlined style={orangeIconStyle} />,
        },
        {
          text: "Shine",
          link: "about/shine",
          icon: <ShieldMoon style={orangeIconStyle} />,
        },
        {
          text: "Yaerly Service",
          link: "about/yearly-service",
          icon: <FontAwesomeIcon icon={faHistory} style={orangeIconStyle} />,
        },
      ],
    },
    {
      text: "Home",
      icon: <FontAwesomeIcon icon={faHome} style={orangeIconStyle} />,
      dropdown: "Home",
      submodules: [
        {
          text: "Service Count",
          link: "home/service-count",
          icon: <Numbers style={orangeIconStyle} />,
        },
        {
          text: "Execution Highlights",
          link: "home/execution-highlights",
          icon: <HighQualityRounded style={orangeIconStyle} />,
        },
      ],
    },
    {
      text: "Common",
      icon: <FontAwesomeIcon icon={faComment} style={orangeIconStyle} />,
      dropdown: "Common",
      submodules: [
        {
          text: "FAQ",
          link: "FAQ",
          icon: <FontAwesomeIcon icon={faQuestion} style={orangeIconStyle} />,
        },
        {
          text: "Review",
          link: "Review",
          icon: <Reviews style={orangeIconStyle} />,
        },
      ],
    },
    // Add more modules as needed
  ];
 
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar id="appbar" position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
 
          <div style={{ flexGrow: 1 }} />
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2, backgroundColor: "white" }}
              aria-controls={opens ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={opens ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}></Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={opens}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={() => navigate("/admin/control")}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Users
            </MenuItem>
 
            <MenuItem
              onClick={() => {
                dispatch(resetSignIn());
                handleLogout();
                handleClose();
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} id="drawer">
        <DrawerHeader>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ width: "100%", height: "50px", cursor: "pointer" }}
            onClick={() => navigate("/adminhome")}
          />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
 
        <List>
          {modules.map(({ text, icon, dropdown, submodules }) => (
            <React.Fragment key={text}>
              <ListItem disablePadding sx={{ display: "block", paddingTop: 2 }}>
                {/* Module */}
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: { xs: 1, sm: 2.5 }, // Responsive padding
                    borderLeft: "5px solid #1976d2",
                  }}
                  onClick={() => handleDropdownToggle(dropdown)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                      fontSize: { xs: 18, sm: 22 },
                    }}
                  >
                    {React.cloneElement(icon, {
                      sx: { color: "#405D72", fontSize: { xs: 20, sm: 24 } },
                    })}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                      color: "#405D72",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
 
                {/* Submodules */}
                <Collapse
                  in={dropdownStates[dropdown]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {submodules.map((submodule) => (
                      <ListItemButton
                        key={submodule.text}
                        onClick={() =>
                          handleNavigation(submodule.link, "control")
                        }
                        sx={{
                          pl: open ? { xs: 4, sm: 6 } : 2,
                          mt: 1,
                          borderLeft: "5px solid #F3CA52",
                          borderRadius: "0 8px 8px 0",
                          justifyContent: open ? "flex-start" : "center",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            justifyContent: "center",
                            mr: open ? 2 : "auto",
                          }}
                        >
                          {React.cloneElement(submodule.icon, {
                            sx: {
                              color: "#405D72",
                              border: "1px solid #1976d2",
                              borderRadius: "50%",
                              padding: "4px",
                              fontSize: { xs: 18, sm: 22 },
                            },
                          })}
                        </ListItemIcon>
                        {open && (
                          <ListItemText
                            primary={submodule.text}
                            primaryTypographyProps={{
                              fontSize: { xs: "0.8rem", sm: "0.9rem" },
                              fontStyle: "italic",
                              color: "black",
                            }}
                          />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
 
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {Content}
      </Box>
    </Box>
  );
}
 
 