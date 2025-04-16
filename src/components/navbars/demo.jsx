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
  AddBusiness,
  ViewModule,
  Webhook,
  ContactEmergency,
  PersonAddAlt,
  MenuBook,
  HowToReg,
  DesignServices,
  RememberMe,
  StarBorderPurple500,
  Reviews,
  Business,
  AbcOutlined,
  WifiProtectedSetupSharp,
  Man3Outlined,
  CurrencyExchange,
  FormatOverline,
  Highlight,
  SupervisedUserCircleOutlined,
  JoinFull,
  AdbOutlined,
  TurnSharpRightOutlined,
  Person3,
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
import { CheckCircle, PriorityHighTwoTone } from "@material-ui/icons";
import StepsIcon from "@material-ui/icons/ViewList";
import { resetSignIn, userVerify } from "../redux/slices/user/Signin";
import { useDispatch } from "react-redux";

const drawerWidth = 240;

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
  color: "orange",
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

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [carrieroppDropdownOpen, setCarrieroppDropdownOpen] =
    React.useState(false);
  const [courseModDropdownOpen, setCourseModDropdownOpen] =
    React.useState(false);
  const [softwareToolsDropdownOpen, setSoftwareToolsDropdownOpen] =
    React.useState(false);
  const [instructorDropdownOpen, setInstructorDropdownOpen] =
    React.useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = React.useState(false);
  const [faqDropdownOpen, setFaqDropdownOpen] = React.useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = React.useState(false);
  const [reviewDropdownOpen, setReviewDropdownOpen] = React.useState(false);

  const [batchesDropdownOpen, setBatchesDropdownOpen] = React.useState(false);

  const [adduserDropdownOpen, setAdduserDropdownOpen] = React.useState(false);
  const [degreeprogramDropdownOpen, setdegreeprogramDropdownOpen] =
    React.useState(false);
  const [ourProgramDropdownOpen, setOurProgramDropdownOpen] =
    React.useState(false);
  const [highlightDropdownOpen, setHighlightDropdownOpen] =
    React.useState(false);
  const [semesterDropdownOpen, setSemesterDropdownOpen] = React.useState(false);
  const [eligibilityCriteriaDropdownOpen, setEligibilityCriteriaDropdownOpen] =
    React.useState(false);
  const [programMentorDropdownOpen, setProgramMentorDropdownOpen] =
    React.useState(false);
  const [programFeesDropdownOpen, setProgramFeesDropdownOpen] =
    React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(false);
  const [admissionDropdownOpen, setAdmissionDropdownOpen] =
    React.useState(false);
  const [outcomesDropdownOpen, setOutcomesDropdownOpen] = React.useState(false);
  const [bussinessServicesDropdownOpen, setBussinessServicesDropdownOpen] = React.useState(false);

  const [servicesDropdownOpen, setServicesDropdownOpen] = React.useState(false);
  const [servicesAboutDropdownOpen, setServicesAboutDropdownOpen] = React.useState(false);
  const [servicesProcessDropdownOpen, setServicesProcessDropdownOpen] = React.useState(false);
  const [servicesOppertunityDropdownOpen, setServicesOppertunityDropdownOpen] = React.useState(false);

  const [clientDropdownOpen, setClientDropdownOpen] = React.useState(false);
  const [executionHighligtsDropdownOpen, setExecutionHighlightsDropdownOpen] =
    React.useState(false);
  const [executionOverviewDropdownOpen, setExecutionOverviewDropdownOpen] =
    React.useState(false);
  const [servicesTestimonialDropdownOpen, setServicesTestimonialDropdownOpen] =
    React.useState(false);
  const [galleryDropdownOpen, setGalleryDropdownOpen] = React.useState(false);
  const [joinUsDropdownOpen, setJoinUsDropdownOpen] = React.useState(false);
  const [visionMissionDropdownOpen, setVisionMissionDropdownOpen] = React.useState(false);
  const [aboutUsDropdownOpen, setAboutUsDropdownOpen] = React.useState(false);

  const [managedCampusDropdownOpen, setManagedCampusDropdownOpen] =
    React.useState(false);
  const [hiringDropdownOpen, setHiringDropdownOpen] = React.useState(false);
  const [keyelementsDropdownOpen, setKeyelementsDropdownOpen] =
    React.useState(false);
  const [
    placementTestimonialDropdownOpen,
    setPlacementTestimonialDropdownOpen,
  ] = React.useState(false);
  const [engagedGovernanceDropdownOpen, setEngagedGovernanceDropdownOpen] =
    React.useState(false);

  const opens = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
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
    switch (dropdown) {
      case "Career_Opportunities":
        setCarrieroppDropdownOpen(!carrieroppDropdownOpen);
        break;
      case "Course_Modules":
        setCourseModDropdownOpen(!courseModDropdownOpen);
        break;
      case "Software_Tools":
        setSoftwareToolsDropdownOpen(!softwareToolsDropdownOpen);
        break;
      case "Instructor":
        setInstructorDropdownOpen(!instructorDropdownOpen);
        break;
      case "Category":
        setCategoryDropdownOpen(!categoryDropdownOpen);
        break;
      case "FAQ":
        setFaqDropdownOpen(!faqDropdownOpen);
        break;
      case "Course":
        setCourseDropdownOpen(!courseDropdownOpen);
        break;
      case "Batch":
        setBatchesDropdownOpen(!batchesDropdownOpen);
        break;
      case "Add_User":
        setAdduserDropdownOpen(!adduserDropdownOpen);
        break;
      case "Degree_Program":
        setdegreeprogramDropdownOpen(!degreeprogramDropdownOpen);
        break;
      case "Our_Program":
        setOurProgramDropdownOpen(!ourProgramDropdownOpen);
        break;
      case "Semester":
        setSemesterDropdownOpen(!semesterDropdownOpen);
        break;
      case "EligibilityCriteria":
        setEligibilityCriteriaDropdownOpen(!eligibilityCriteriaDropdownOpen);
        break;
      case "degreeprogram/target-student":
        setProgramMentorDropdownOpen(!programMentorDropdownOpen);
        break;
      case "ProgramFees":
        setProgramFeesDropdownOpen(!programFeesDropdownOpen);
        break;
      case "AdmissionProcess":
        setAdmissionDropdownOpen(!admissionDropdownOpen);
        break;
      case "Highlight":
        setHighlightDropdownOpen(!highlightDropdownOpen);
        break;
        case "Business-Services":
          setBussinessServicesDropdownOpen(!bussinessServicesDropdownOpen);
          break;

      case "Services":
        setServicesDropdownOpen(!servicesDropdownOpen);
        break;

        case "Services-About":
          setServicesAboutDropdownOpen(!servicesAboutDropdownOpen);
          break;

          case "Services-Process":
            setServicesProcessDropdownOpen(!servicesProcessDropdownOpen);
            break;
            case "Services-Opportunity":
              setServicesOppertunityDropdownOpen(!servicesOppertunityDropdownOpen);
              break;
      case "Client":
        setClientDropdownOpen(!clientDropdownOpen);
        break;
      case "Execution_Highlights":
        setExecutionHighlightsDropdownOpen(!executionHighligtsDropdownOpen);
        break;
      case "Execution_Overview":
        setExecutionOverviewDropdownOpen(!executionOverviewDropdownOpen);
        break;
      case "Service_Testimonial":
        setServicesTestimonialDropdownOpen(!servicesTestimonialDropdownOpen);
        break;
      case "Gallery":
        setGalleryDropdownOpen(!galleryDropdownOpen);
        break;
        case "joinus":
          setJoinUsDropdownOpen(!joinUsDropdownOpen);
          break;

          case "about/aboutus":
            setAboutUsDropdownOpen(!aboutUsDropdownOpen);
            break;

          case "about/vision-mission":
            setVisionMissionDropdownOpen(!visionMissionDropdownOpen);
            break;
      case "managed_Campus":
        setManagedCampusDropdownOpen(!managedCampusDropdownOpen);
        break;
      case "hiring":
        setHiringDropdownOpen(!hiringDropdownOpen);
        break;
      case "key_elements":
        setKeyelementsDropdownOpen(!keyelementsDropdownOpen);
        break;
      case "placement_testimonial":
        setPlacementTestimonialDropdownOpen(!placementTestimonialDropdownOpen);
        break;
      case "engaged_Governance":
        setEngagedGovernanceDropdownOpen(!engagedGovernanceDropdownOpen);
        break;
        case "Review":
          setReviewDropdownOpen(!reviewDropdownOpen);
          break;
      case "Outcomes":
        setOutcomesDropdownOpen(!outcomesDropdownOpen);
      default:
        break;
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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
    // Define routes based on dropdown and action
    const routes = {
      add: `/${dropdown}-add`,
      control: `/${dropdown}-control`,
    };

    // Navigate to the specified route
    navigate(routes[action]);
  };

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
            <MenuItem
              onClick={() => {
                /* Handle Edit Profile Click */
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              Edit Profile
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
    sx={{ width: "100%", height: "30px", cursor: "pointer" }}
    onClick={() => navigate("/adminhome")}
  />
  
  <IconButton onClick={handleDrawerClose}>
    {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
  </IconButton>
</DrawerHeader>
        <Divider />

        <List>
          {[
             {
              text: "Business-Services",
              icon: <Business style={orangeIconStyle} />,
              dropdown: "Business-Services",
            },
            {
              text: "Services",
              icon: <DesignServices style={orangeIconStyle} />,
              dropdown: "Services",
            },
            {
              text: "Services-About",
              icon: <AbcOutlined style={orangeIconStyle} />,
              dropdown: "Services-About",
            },
            {
              text: "Services-Process",
              icon: <WifiProtectedSetupSharp style={orangeIconStyle} />,
              dropdown: "Services-Process",
            },
            {
              text: "Client",
              icon: <Man3Outlined style={orangeIconStyle} />,
              dropdown: "Client",
            },
           
            {
              text: "Execution_Overview",
              icon: <FormatOverline style={orangeIconStyle} />,
              dropdown: "Execution_Overview",
            },
            {
              text: "Execution_Highlights",
              icon: <PriorityHighTwoTone style={orangeIconStyle} />,
              dropdown: "Execution_Highlights",
            },
            {
              text: "Services-Opportunity",
              icon: <SupervisedUserCircleOutlined style={orangeIconStyle} />,
              dropdown: "Services-Opportunity",
            },
            {
              text: "Category",
              icon: <CategoryOutlinedIcon />,
              dropdown: "Category",
            },
            {
              text: "Course",
              icon: <SchoolOutlinedIcon />,
              dropdown: "Course",
            },

            {
              text: "Degree_Program",
              icon: <AccountBalanceIcon />,
              dropdown: "Degree_Program",
            },
            {
              text: "Highlight",
              icon: <HowToReg style={orangeIconStyle} />,
              dropdown: "Highlight",
            },
            {
              text: "Outcomes",
              icon: <CheckCircle style={orangeIconStyle} />,
              dropdown: "Outcomes",
            },
           
            {
              text: "Our_Program",
              icon: <EventIcon />,
              dropdown: "Our_Program",
            },
            {
              text: "Semester",
              icon: <BookIcon />,
              dropdown: "Semester",
            },
            {
              text: "EligibilityCriteria",
              icon: <MenuBook />,
              dropdown: "EligibilityCriteria",
            },
            {
              text: "AdmissionProcess",
              icon: <StepsIcon style={orangeIconStyle} />,
              dropdown: "AdmissionProcess",
            },

            {
              text: "Review",
              icon: <Reviews />,
              dropdown: "Review",
            },

            {
              text: "Career_Opportunities",
              icon: <AddBusiness />,
              dropdown: "Career_Opportunities",
            },
            {
              text: "Course_Modules",
              icon: <ViewModule />,
              dropdown: "Course_Modules",
            },
            {
              text: "Software_Tools",
              icon: <Webhook />,
              dropdown: "Software_Tools",
            },
            {
              text: "Instructor",
              icon: <ContactEmergency />,
              dropdown: "Instructor",
            },
           
            {
              text: "Batch",
              icon: <SchoolOutlinedIcon />,
              dropdown: "Batch",
            },
            {
              text: "FAQ",
              icon: <QuestionAnswerOutlinedIcon />,
              dropdown: "FAQ",
            },
          
            {
              text: "Add_User",
              icon: <PersonAddAlt />,
              dropdown: "Add_User",
            },
           
            {
              text: "Target Student",
              icon: <Person3 />,
              dropdown: "degreeprogram/target-student",
            },
            {
              text: "ProgramFees",
              icon: <HowToReg />,
              dropdown: "ProgramFees",
            },
           
           
            {
              text: "Service_Testimonial",
              icon: <StarBorderPurple500 style={orangeIconStyle} />,
              dropdown: "Service_Testimonial",
            },
            {
              text: "Gallery",
              icon: <StarBorderPurple500 style={orangeIconStyle} />,
              dropdown: "Gallery",
            },
            {
              text: "joinus",
              icon: <JoinFull style={orangeIconStyle} />,
              dropdown: "joinus",
            },
            {
              text: "AboutUs",
              icon: <AdbOutlined style={orangeIconStyle} />,
              dropdown: "about/aboutus",
            },
            {
              text: "vision-mission",
              icon: <AdbOutlined style={orangeIconStyle} />,
              dropdown: "about/vision-mission",
            },
            {

              text: "managed_Campus",
              icon: <RememberMe style={orangeIconStyle} />,
              dropdown: "managed_Campus",
            },
            {
              text: "hiring",
              icon: <RememberMe style={orangeIconStyle} />,
              dropdown: "hiring",
            },
            {
              text: "key_elements",
              icon: <RememberMe style={orangeIconStyle} />,
              dropdown: "key_elements",
            },
            {
              text: "placement_testimonial",
              icon: <RememberMe style={orangeIconStyle} />,
              dropdown: "placement_testimonial",
            },
            {
              text: "engaged_Governance",
              icon: <RememberMe style={orangeIconStyle} />,
              dropdown: "engaged_Governance",
            },
        
          ].map(({ text, icon, dropdown }) => (
            <React.Fragment key={text}>
              <ListItem
                key={text}
                disablePadding
                sx={{ display: "block", paddingTop: 2 }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => {
                    handleDropdownToggle(dropdown);
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {React.cloneElement(icon, { sx: { color: "#F28C28" } })}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                  {dropdown === "Career_Opportunities" &&
                  carrieroppDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Course_Modules" && courseModDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Software_Tools" &&
                  softwareToolsDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Instructor" && instructorDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Category" && categoryDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "FAQ" && faqDropdownOpen ? <></> : null}
                  {dropdown === "Review" && reviewDropdownOpen ? <></> : null}
                  {dropdown === "joinus" && joinUsDropdownOpen ? <></> : null}
                  {dropdown === "about/vision-mission" && visionMissionDropdownOpen ? <></> : null}
                  {dropdown === "about/aboutus" && aboutUsDropdownOpen ? <></> : null}


                  {dropdown === "Course" && courseDropdownOpen ? <></> : null}
                  {dropdown === "Batch" && batchesDropdownOpen ? <></> : null}

                  {dropdown === "Add_User" && adduserDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Degree_Program" &&
                  degreeprogramDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Our_Program" && ourProgramDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Semester" && semesterDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "EligibilityCriteria" &&
                  eligibilityCriteriaDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "degreeprogram/target-student" && programMentorDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "ProgramFees" && programFeesDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "AdmissionProcess" && admissionDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Highlight" && highlightDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Outcomes" && outcomesDropdownOpen ? (
                    <></>
                  ) : null}
                   {dropdown === "Business-Services" && bussinessServicesDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Services" && servicesDropdownOpen ? (
                    <></>

                  ) : null}
                      {dropdown === "Services-About" && servicesAboutDropdownOpen ? (
                    <></>
                    
                  ) : null}
                  {dropdown === "Services-process" && servicesProcessDropdownOpen ? (
                <></>

              ) : null}
              {dropdown === "Services-Opportunity" && servicesOppertunityDropdownOpen ? (
            <></>

                  ) : null}
                  {dropdown === "Client" && clientDropdownOpen ? <></> : null}
                  {dropdown === "Execution_Highlights" &&
                  executionHighligtsDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Execution_Overview" &&
                  executionOverviewDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Service_Testimonial" &&
                  servicesTestimonialDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "Gallery" && galleryDropdownOpen ? <></> : null}
                  {dropdown === "managed_Campus" &&
                  managedCampusDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "hiring" && hiringDropdownOpen ? <></> : null}
                  {dropdown === "key_elements" && keyelementsDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "placement_testimonial" &&
                  placementTestimonialDropdownOpen ? (
                    <></>
                  ) : null}
                  {dropdown === "engaged_Governance" &&
                  engagedGovernanceDropdownOpen ? (
                    <></>
                  ) : null}
                </ListItemButton>

                {/* Dropdown Menus */}
                <Collapse
                  in={
                    (dropdown === "Career_Opportunities" &&
                      carrieroppDropdownOpen) ||
                    (dropdown === "Course_Modules" && courseModDropdownOpen) ||
                    (dropdown === "Software_Tools" &&
                      softwareToolsDropdownOpen) ||
                    (dropdown === "Instructor" && instructorDropdownOpen) ||
                    (dropdown === "Category" && categoryDropdownOpen) ||
                    (dropdown === "FAQ" && faqDropdownOpen) ||
                    (dropdown === "Review" && reviewDropdownOpen) ||
                    (dropdown === "joinus" && joinUsDropdownOpen) ||

                    (dropdown === "Course" && courseDropdownOpen) ||
                    (dropdown === "Batch" && batchesDropdownOpen) ||
                    (dropdown === "Add_User" && adduserDropdownOpen) ||
                    (dropdown === "Degree_Program" &&
                      degreeprogramDropdownOpen) ||
                    (dropdown === "Our_Program" && ourProgramDropdownOpen) ||
                    (dropdown === "Semester" && semesterDropdownOpen) ||
                    (dropdown === "EligibilityCriteria" &&
                      eligibilityCriteriaDropdownOpen) ||
                    (dropdown === "degreeprogram/target-student" &&
                      programMentorDropdownOpen) ||
                    (dropdown === "ProgramFees" && programFeesDropdownOpen) ||
                    (dropdown === "AdmissionProcess" &&
                      admissionDropdownOpen) ||
                    (dropdown === "Highlight" && highlightDropdownOpen) ||
                    (dropdown === "Outcomes" && outcomesDropdownOpen) ||
                    (dropdown === "Business-Services" && bussinessServicesDropdownOpen) ||
                    (dropdown === "Services" && servicesDropdownOpen) ||
                    (dropdown === "Services-About" && servicesAboutDropdownOpen) ||
                    (dropdown === "Services-Process" && servicesProcessDropdownOpen) ||
                    (dropdown === "Services-Opportunity" && servicesOppertunityDropdownOpen) ||


                    (dropdown === "Client" && clientDropdownOpen) ||
                    (dropdown === "Execution_Highlights" &&
                      executionHighligtsDropdownOpen) ||
                    (dropdown === "Execution_Overview" &&
                      executionOverviewDropdownOpen) ||
                    (dropdown === "Service_Testimonial" &&
                      servicesTestimonialDropdownOpen) ||
                    (dropdown === "Gallery" && galleryDropdownOpen) ||
                    (dropdown === "about/vision-mission" && visionMissionDropdownOpen) ||
                    (dropdown === "about/aboutus" && aboutUsDropdownOpen) ||

                    (dropdown === "managed_Campus" &&
                      managedCampusDropdownOpen) ||
                    (dropdown === "hiring" && hiringDropdownOpen) ||
                    (dropdown === "key_elements" && keyelementsDropdownOpen) ||
                    (dropdown === "placement_testimonial" &&
                      placementTestimonialDropdownOpen) ||
                    (dropdown === "engaged_Governance" &&
                      engagedGovernanceDropdownOpen)
                  }
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItemButton
                      onClick={() => {
                        handleNavigation(dropdown, "add");
                      }}
                      sx={{ paddingLeft: 2 }}
                    >
                      <ListItemIcon>
                        <AddIcon />
                      </ListItemIcon>
                      <ListItemText primary="Add" />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() => {
                        handleNavigation(dropdown, "control");
                      }}
                      sx={{ paddingLeft: 2 }}
                    >
                      <ListItemIcon>
                        <ControlIcon />
                      </ListItemIcon>
                      <ListItemText primary="Control" />
                    </ListItemButton>
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
