import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  Autocomplete,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { DropzoneArea } from "material-ui-dropzone";
import LeftNavigationBar from "../../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import {
  createProgramFees,
  getProgramFeesById,
  updateProgramFees,
} from "../../../redux/slices/mca/programFees/programfees";
import { fetchDegreeProgramData } from "../../../redux/slices/mca/degreeProgram/degreeProgram";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOutcomeById,
  updateOutcome,
} from "../../../redux/slices/mca/outcome/outcome";
import { fetchServices } from "../../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../../redux/slices/services/bussinessServices/BussinessSerives";
import { getAllCompanies } from "../../../redux/slices/mca/company/company";
import { getAllColleges } from "../../../redux/slices/mca/college/college";
import { HelpOutline } from "@material-ui/icons";

const OutcomesEditForm = () => {
  const { outcomeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const outcomeById = useSelector((state) => state.outcomes.outcomeById);
  const [icon, setIcon] = useState(null);
  const [existingIcon, setExistingIcon] = useState("");
  const [degreeProgram, setDegreeProgram] = useState(null);
  const degreeProgramData = useSelector(
    (state) => state.degreeProgram.degreeProgramData
  );
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    dispatch(getOutcomeById(outcomeId));
    dispatch(fetchDegreeProgramData());
    dispatch(fetchServices());
    dispatch(getAllBussinessServices());
    dispatch(getAllCompanies());
    dispatch(getAllColleges());
  }, [dispatch, outcomeId]);

  useEffect(() => {
    if (outcomeById) {
      setTitle(outcomeById.title || "");
      setExistingIcon(outcomeById.icon || "");
      if (outcomeById.degree_program) {
        const matchingProgram = degreeProgramData.find(
          (prog) =>
            prog._id === outcomeById.degree_program._id ||
            prog._id === outcomeById.degree_program
        );
        setDegreeProgram(matchingProgram || null);
      }
      if (outcomeById.business_service) {
        const matchingBS = businessServiceData.find(
          (bs) =>
            bs._id === outcomeById.business_service._id ||
            bs._id === outcomeById.business_service
        );
        setSelectedBusinessService(matchingBS || null);
      }
      if (outcomeById.service) {
        const matchingService = serviceData.find(
          (srv) =>
            srv._id === outcomeById.service._id ||
            srv._id === outcomeById.service
        );
        setSelectedService(matchingService || null);
      }
      if (outcomeById.company) {
        const matchingCompany = companyData.find(
          (comp) =>
            comp._id === outcomeById.company._id ||
            comp._id === outcomeById.company
        );
        setSelectedCompany(matchingCompany || null);
      }
      if (outcomeById.college) {
        const matchingCollege = collegeData.find(
          (col) =>
            col._id === outcomeById.college._id ||
            col._id === outcomeById.college
        );
        setSelectedCollege(matchingCollege || null);
      }
    }
  }, [
    outcomeById,
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    if (icon) {
      formData.append("icon", icon);
    }
    if (degreeProgram && degreeProgram._id) {
      formData.append("degree_program", degreeProgram._id);
    }
    if (selectedBusinessService && selectedBusinessService._id) {
      formData.append("business_service", selectedBusinessService._id);
    }
    if (selectedService && selectedService._id) {
      formData.append("service", selectedService._id);
    }
    if (selectedCompany && selectedCompany._id) {
      formData.append("company", selectedCompany._id);
    }
    if (selectedCollege && selectedCollege._id) {
      formData.append("college", selectedCollege._id);
    } else if (!existingIcon) {
      formData.append("removeIcon", "true");
    }

    try {
      await dispatch(updateOutcome({ outcomeId, formData }));
      setSnackbarMessage("Outcome updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/Outcomes-control");
      }, 1500);
    } catch (error) {
      setSnackbarMessage("Failed to update outcome. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
                  Out Come Edit Form
                </Typography>

                <Tooltip
                  title="This is where you can edit degree program details and images."
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
              <FormControl fullWidth sx={{ mb: 2 }}>
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
              <FormControl fullWidth sx={{ mb: 2 }}>
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
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                  id="degree_program"
                  options={filteredDegreePrograms || []}
                  getOptionLabel={(option) => option?.program_name || ""}
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
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                  id="company"
                  options={companyData || []}
                  getOptionLabel={(option) => option?.companyName || ""}
                  value={selectedCompany}
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
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                  id="college"
                  options={collegeData || []}
                  getOptionLabel={(option) => option?.collegeName || ""}
                  value={selectedCollege}
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

              <DropzoneArea
                onChange={(fileArray) => setIcon(fileArray[0])}
                acceptedFiles={["image/*"]}
                filesLimit={1}
                showPreviews={false}
                showPreviewsInDropzone={true}
                dropzoneText="Drag and drop an icon here or click"
                sx={{ mb: 2 }}
              />

              {/* Add this code after the DropzoneArea component */}
              {existingIcon && (
                <Box
                  sx={{
                    mt: 2,
                    mb: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Existing Icon:
                  </Typography>
                  <img
                    src={existingIcon}
                    alt="Existing Icon"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginBottom: "10px",
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setExistingIcon("")}
                    sx={{ mt: 1 }}
                  >
                    Remove Existing Icon
                  </Button>
                </Box>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
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
                {loading ? "Submitting..." : "Update Out Come"}
              </Button>
            </form>
          </Paper>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              variant="filled"
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      }
    />
  );
};

export default OutcomesEditForm;
