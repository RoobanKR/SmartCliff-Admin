import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Autocomplete,
  FormControl,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { DropzoneArea } from "material-ui-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchOurProgramById,
  updateOurProgram,
} from "../../../redux/slices/mca/ourProgram/ourProgram";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useCookies } from "react-cookie";
import { resetSignIn, userVerify } from "../../../redux/slices/user/Signin";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { getAllCompanies } from "../../../redux/slices/mca/company/company";
import { getAllColleges } from "../../../redux/slices/mca/college/college";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { HelpOutline } from "@material-ui/icons";
import ClearIcon from "@mui/icons-material/Clear";

const useStyles = makeStyles((theme) => ({
  imagesContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  imagePreviewContainer: {
    position: "relative",
    display: "inline-block",
    margin: theme.spacing(1),
  },
  imagePreview: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: theme.spacing(1),
    border: "1px solid #ddd",
  },
  removeImageButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
  },
}));

const Our_ProgramEditForm = () => {
  const { programId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { selectedProgram } = useSelector((state) => state.ourProgram);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(null);
  const [error, setError] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");
  const [showExistingIcon, setShowExistingIcon] = useState(true); // To track if we should show existing icon
  const [degreeProgram, setDegreeProgram] = useState(null);
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
  const [cookies, removeCookie] = useCookies(["token"]);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector(
    (state) => state.businessService.businessServiceData
  );
  const companyData = useSelector((state) => state.companies.companies);
  const collegeData = useSelector((state) => state.college.colleges) || [];
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredDegreePrograms, setFilteredDegreePrograms] = useState([]);

  useEffect(() => {
    if (!cookies.token || cookies.token === undefined) {
      dispatch(resetSignIn());
      navigate("/");
    } else {
      dispatch(userVerify({ token: cookies.token }));
    }
  }, [cookies]);

  useEffect(() => {
    dispatch(fetchOurProgramById(programId));
    dispatch(fetchDegreeProgramData());
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
    dispatch(getAllCompanies());
    dispatch(getAllColleges());
  }, [dispatch, programId]);

  useEffect(() => {
    if (selectedProgram) {
      setTitle(selectedProgram.title || "");
      setDescription(selectedProgram.description || "");
      setExistingIcon(selectedProgram.icon || "");

      // For degree_program, find the matching object from degreeProgramData
      if (selectedProgram.degree_program) {
        const matchingDegreeProgram = degreeProgramData.find(
          (dp) => dp._id === selectedProgram.degree_program._id
        );
        setDegreeProgram(matchingDegreeProgram || null);
      }
      // For business_service, find the matching object from businessServiceData
      if (selectedProgram.business_service) {
        const matchingBS = businessServiceData.find(
          (bs) =>
            bs._id === selectedProgram.business_service._id ||
            bs._id === selectedProgram.business_service
        );
        setSelectedBusinessService(matchingBS || null);
      }

      // For service, find the matching object from serviceData
      if (selectedProgram.service) {
        const matchingService = serviceData.find(
          (srv) =>
            srv._id === selectedProgram.service._id ||
            srv._id === selectedProgram.service
        );
        setSelectedService(matchingService || null);
      }

      // For company, find the matching object from companyData
      if (selectedProgram.company) {
        const matchingCompany = companyData.find(
          (comp) =>
            comp._id === selectedProgram.company._id ||
            comp._id === selectedProgram.company
        );
        setSelectedCompany(matchingCompany || null);
      }

      // For college, find the matching object from collegeData
      if (selectedProgram.college) {
        const matchingCollege = collegeData.find(
          (col) =>
            col._id === selectedProgram.college._id ||
            col._id === selectedProgram.college
        );
        setSelectedCollege(matchingCollege || null);
      }
    }
  }, [
    selectedProgram,
    degreeProgramData,
    businessServiceData,
    serviceData,
    companyData,
    collegeData,
  ]);

  useEffect(() => {
    if (selectedBusinessService) {
      const filtered = serviceData.filter(
        (service) =>
          service.business_services?._id === selectedBusinessService._id
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  }, [selectedBusinessService, serviceData]);

  useEffect(() => {
    if (selectedService) {
      const filteredPrograms = degreeProgramData.filter(
        (program) => program.service?._id === selectedService._id
      );
      setFilteredDegreePrograms(filteredPrograms);
    } else {
      setFilteredDegreePrograms(degreeProgramData);
    }
  }, [selectedService, degreeProgramData]);

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
  };

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
  };

  const handleProgramChange = (_, newValue) => {
    setDegreeProgram(newValue);
  };

  const handleRemoveIcon = () => {
    setShowExistingIcon(false); // Hide the existing icon
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // Only append the ID values, not the entire objects
    if (degreeProgram && degreeProgram._id) {
      formData.append("degree_program", degreeProgram._id);
    }

    // Handle the icon
    if (icon) {
      formData.append("icon", icon);
    } else if (showExistingIcon && existingIcon) {
      // If there's an existing icon and we didn't remove it, keep it
      // We need to fetch the existing icon and append it to the form data
      try {
        const response = await fetch(existingIcon);
        const arrayBuffer = await response.arrayBuffer();
        const fileNameWithTimestamp = existingIcon.split("/").pop();
        const fileNameWithoutTimestamp = fileNameWithTimestamp.replace(
          /^\d+_/,
          ""
        );
        const file = new File([arrayBuffer], fileNameWithoutTimestamp, {
          type: response.headers.get("content-type"),
        });
        formData.append("icon", file);
      } catch (err) {
        console.error("Error handling existing icon:", err);
      }
    }
    // If both icon and showExistingIcon are false, we don't append any icon - it will be removed

    // Handle business service
    if (selectedBusinessService && selectedBusinessService._id) {
      formData.append("business_service", selectedBusinessService._id);
    }

    // Handle service
    if (selectedService && selectedService._id) {
      formData.append("service", selectedService._id);
    }

    // Handle company - only if it exists
    if (selectedCompany && selectedCompany._id) {
      formData.append("company", selectedCompany._id);
    }

    // Handle college - only if it exists
    if (selectedCollege && selectedCollege._id) {
      formData.append("college", selectedCollege._id);
    }

    try {
      await dispatch(
        updateOurProgram({ token: cookies.token, programId, formData })
      );
      navigate(`/Our_Program-control`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIconChange = (files) => {
    if (files && files.length > 0) {
      setIcon(files[0]);
      setShowExistingIcon(false); // Hide existing icon when a new one is uploaded
    } else {
      setIcon(null);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={0}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1}
              mt={2}
              mb={2}
            >
              <Button variant="outlined" color="primary" onClick={handleBack}>
                Back
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  flex: 1,
                }}
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
                  Our Program Edit Form
                </Typography>

                <Tooltip
                  title="This is where you can edit program details and icon."
                  arrow
                >
                  <HelpOutline
                    sx={{
                      color: "#747474",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Box>
            </Box>
            <form
              style={{
                border: "2px dotted #D3D3D3",
                padding: "20px",
                borderRadius: "8px",
              }}
              onSubmit={handleSubmit}
            >
              <FormControl fullWidth>
                <Autocomplete
                  id="company"
                  options={companyData || []}
                  getOptionLabel={(option) => option?.companyName || ""}
                  value={selectedCompany}
                  style={{ marginBottom: "20px" }}
                  onChange={(_, newValue) => setSelectedCompany(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Company"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <Autocomplete
                  id="college"
                  options={collegeData || []}
                  getOptionLabel={(option) => option?.collegeName || ""}
                  value={selectedCollege}
                  style={{ marginBottom: "20px" }}
                  onChange={(_, newValue) => setSelectedCollege(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="College"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth>
                <Autocomplete
                  id="Business Services"
                  options={businessServiceData || []}
                  getOptionLabel={(option) => option?.name || ""}
                  value={selectedBusinessService}
                  onChange={handleBussinessServiceChange}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Business Services"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              <br /> <br />
              <FormControl fullWidth>
                <Autocomplete
                  id="service"
                  options={filteredServices || []}
                  getOptionLabel={(option) => option?.title || ""}
                  value={selectedService}
                  onChange={handleServiceChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Service"
                      fullWidth
                      required
                    />
                  )}
                />
              </FormControl>
              <br />
              <br />
              <FormControl fullWidth>
                <Autocomplete
                  id="degree_program"
                  options={filteredDegreePrograms || []}
                  getOptionLabel={(option) => option?.program_name || ""}
                  style={{ marginBottom: "20px" }}
                  value={degreeProgram}
                  onChange={handleProgramChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Program"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
              {/* Existing Icon Preview Section */}
              {existingIcon && showExistingIcon && (
                <div className={classes.imagesContainer}>
                  <Typography variant="subtitle1" gutterBottom>
                    Current Icon:
                  </Typography>
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="flex-start"
                  >
                    <div className={classes.imagePreviewContainer}>
                      <img
                        src={existingIcon}
                        alt="Program Icon"
                        className={classes.imagePreview}
                      />
                      <IconButton
                        className={classes.removeImageButton}
                        onClick={handleRemoveIcon}
                        size="small"
                        color="secondary"
                      >
                        <ClearIcon />
                      </IconButton>
                    </div>
                  </Box>
                </div>
              )}
              <Typography variant="subtitle1" gutterBottom>
                Upload New Icon:
              </Typography>
              <DropzoneArea
                onChange={handleIconChange}
                acceptedFiles={[
                  "image/png",
                  "image/jpeg",
                  "image/jpg",
                  "image/svg+xml",
                  "image/*",
                ]}
                filesLimit={1}
                showPreviews={true}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an icon here or click"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                style={{
                  display: "block",
                  margin: "24px auto 0", // centers the button horizontally
                  backgroundColor: "#ff6d00", // orange
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Update Our Program"}
              </Button>
              {error && (
                <Typography variant="body2" color="error" align="center">
                  {error}
                </Typography>
              )}
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default Our_ProgramEditForm;
