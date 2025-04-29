import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Button,
  IconButton,
  Divider,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Container,
  Tooltip,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import {
  fetchFAQById,
  updateFAQ
} from "../../redux/slices/faq/faq";
import {
  fetchCourse,
  selectCourses,
  selectSelectedCourse,
  setSelectedCourse,
} from "../../redux/slices/course/course";
import {
  fetchDegreeProgramData,
  setSelectedDegreeProgram,
} from "../../redux/slices/mca/degreeProgram/degreeProgram";
import { fetchServices } from "../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../redux/slices/services/bussinessServices/BussinessSerives";
import { getAllColleges } from "../../redux/slices/mca/college/college";
import { HelpOutline } from "@mui/icons-material";

const FAQEditForm = () => {
  const { faqId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const courses = useSelector(selectCourses);
  const degreeProgramData = useSelector((state) => state.degreeProgram.degreeProgramData);
  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector((state) => state.businessService.businessServiceData);
  const collegeData = useSelector((state) => state.college.colleges);

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success'); // 'success' or 'error'


  // State
  const [faqItems, setFaqItems] = useState([{ question: "", answer: "" }]);
  const [selectedCourse, setSelectedCourseLocal] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);
  const [type, setType] = useState(null);
  const [categoryName, setCategoryName] = useState("common");
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [faqData, setFaqData] = useState(null);

  // Fetch all reference data
  useEffect(() => {
    const fetchAllData = async () => {
      setIsFetching(true);
      try {
        await Promise.all([
          dispatch(fetchCourse()),
          dispatch(fetchDegreeProgramData()),
          dispatch(fetchServices()),
          dispatch(getAllBussinessServices()),
          dispatch(getAllColleges())
        ]);
      } catch (error) {
        console.error("Error fetching reference data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAllData();
  }, [dispatch]);

  // Fetch FAQ by ID
  useEffect(() => {
    const fetchFAQ = async () => {
      setIsLoading(true);
      try {
        const response = await dispatch(fetchFAQById(faqId)).unwrap();
        setFaqData(response);
      } catch (error) {
        console.error("Error fetching FAQ:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isFetching && faqId) {
      fetchFAQ();
    }
  }, [dispatch, faqId, isFetching]);

  // Process and set form data after both reference data and FAQ data are loaded
  useEffect(() => {
    if (!isLoading && !isFetching && faqData &&
      courses?.length > 0 &&
      degreeProgramData?.length > 0 &&
      serviceData?.length > 0 &&
      businessServiceData?.length > 0 &&
      collegeData?.length > 0) {

      // Set FAQ items - create a deep copy to make items mutable
      if (Array.isArray(faqData.faqItems) && faqData.faqItems.length > 0) {
        // Create a new array with new objects for each item to ensure they're mutable
        const mutableFaqItems = faqData.faqItems.map(item => ({
          question: item.question || "",
          answer: item.answer || ""
        }));
        setFaqItems(mutableFaqItems);
      }

      // Set type and category
      setType(faqData.type);
      setCategoryName(faqData.category_name || "common");

      // Find and set course object
      if (faqData.course) {
        const course = courses.find(c => c._id === faqData.course._id);
        setSelectedCourseLocal(course || null);
      }

      // Find and set program object
      if (faqData.degree_program) {
        const program = degreeProgramData.find(p => p._id === faqData.degree_program._id);
        setSelectedProgram(program || null);
      }

      // Find and set business service object
      if (faqData.business_service) {
        const businessService = businessServiceData.find(bs => bs._id === faqData.business_service._id);
        setSelectedBusinessService(businessService || null);

        // Filter services based on selected business service
        if (businessService) {
          const filtered = serviceData.filter(
            s => s.business_services?._id === businessService._id
          );
          setFilteredServices(filtered);
        }
      }

      // Find and set service object
      if (faqData.service) {
        const service = serviceData.find(s => s._id === faqData.service._id);
        setSelectedService(service || null);
      }

      // Find and set college object
      if (faqData.college) {
        const college = collegeData.find(c => c._id === faqData.college._id);
        setSelectedCollege(college || null);
      }
    }
  }, [
    isLoading,
    isFetching,
    faqData,
    courses,
    degreeProgramData,
    serviceData,
    businessServiceData,
    collegeData
  ]);

  // Update filtered services when business service changes
  useEffect(() => {
    if (serviceData && selectedBusinessService) {
      const filtered = serviceData.filter(
        (service) => service.business_services?._id === selectedBusinessService._id
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  }, [selectedBusinessService, serviceData]);

  // Handle FAQ item operations
  const handleAddItem = () => {
    setFaqItems([...faqItems, { question: "", answer: "" }]);
  };

  const handleRemoveItem = (index) => {
    const newFaqItems = [...faqItems];
    newFaqItems.splice(index, 1);
    setFaqItems(newFaqItems);
  };

  const handleQuestionChange = (index, value) => {
    const newFaqItems = [...faqItems];
    newFaqItems[index] = { ...newFaqItems[index], question: value };
    setFaqItems(newFaqItems);
  };

  const handleAnswerChange = (index, value) => {
    const newFaqItems = [...faqItems];
    newFaqItems[index] = { ...newFaqItems[index], answer: value };
    setFaqItems(newFaqItems);
  };

  // Handle reference data changes
  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    // Reset selected service when business service changes
    setSelectedService(null);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategoryName(event.target.value);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (faqItems.length === 0 || faqItems.some(item => !item.question || !item.answer)) {
      alert("Please fill in all question and answer fields");
      return;
    }

    try {
      // Prepare update data
      const formData = {
        faqItems: faqItems,
        type: type,
        category_name: categoryName,
        course: selectedCourse?._id || null,
        degree_program: selectedProgram?._id || null,
        service: selectedService?._id || null,
        business_service: selectedBusinessService?._id || null,
        college: selectedCollege?._id || null,
      };

      // Dispatch update action
      const result = await dispatch(updateFAQ({ faqId, formData })).unwrap();

      if (result) {
        setSnackMessage("FAQ updated successfully!");
        setSnackSeverity("success");
        setOpenSnackBar(true);

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate(-1); // Go back to previous page
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      setSnackMessage("Failed to update FAQ. Please try again.");
      setSnackSeverity("error");
      setOpenSnackBar(true);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Show loading indicator while fetching data
  if (isLoading || isFetching) {
    return (
      <LeftNavigationBar
        Content={
          <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
            <Box textAlign="center">
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Loading FAQ data...
              </Typography>
            </Box>
          </Container>
        }
      />
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ maxWidth: 800, margin: "auto", px: 2 }}>
          {/* Header with Back Button */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            mt={3}
            mb={2}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
            >
              Back
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
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
                  fontSize: { xs: "28px", sm: "36px" },
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
                About Us Edit Form
              </Typography>

              <Tooltip
                title="Edit the faq dataset here. Make sure to fill in all required fields."
                arrow
                placement="top"
              >
                <HelpOutline
                  sx={{
                    color: "#747474",
                    fontSize: "24px",
                    cursor: "pointer",
                    ml: 1,
                  }}
                />
              </Tooltip>
            </Box>
          </Box>


            <form onSubmit={handleSubmit}  style={{
                  border: "2px dotted #D3D3D3",
                  padding: "20px",
                  borderRadius: "8px",
                }}>
              {/* FAQ Items Section */}
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                FAQ Questions & Answers
              </Typography>

              {faqItems.map((item, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label={`Question ${index + 1}`}
                    variant="outlined"
                    required
                    value={item.question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label={`Answer ${index + 1}`}
                    variant="outlined"
                    multiline
                    rows={3}
                    required
                    value={item.answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                  {index > 0 && (
                    <IconButton
                      onClick={() => handleRemoveItem(index)}
                      sx={{ mt: 1 }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Box>
              ))}

              <Box sx={{ mb: 2 }}>
                <Tooltip title="Add FAQ Item">
                  <IconButton onClick={handleAddItem}>
                    <AddIcon color="secondary" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Type & Category Section */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="type-label">Business Type</InputLabel>
                    <Select
                      labelId="type-label"
                      name="type"
                      value={type || ""}
                      onChange={handleTypeChange}
                      label="Business Type"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="hirefromus">Hire From Us</MenuItem>
                      <MenuItem value="trainfromus">Train From Us</MenuItem>
                      <MenuItem value="institute">Institute</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Category Name</InputLabel>
                    <Select
                      labelId="category-label"
                      name="categoryName"
                      value={categoryName}
                      onChange={handleCategoryChange}
                      label="Category Name"
                    >
                      <MenuItem value="common">Common</MenuItem>
                      <MenuItem value="non-common">Non-Common</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* References Section */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Associated References
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Autocomplete
                    id="course"
                    options={courses || []}
                    getOptionLabel={(option) => option?.course_name || ""}
                    value={selectedCourse}
                    onChange={(_, newValue) => setSelectedCourseLocal(newValue)}
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Course" variant="outlined" />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Autocomplete
                    id="business-services"
                    options={businessServiceData || []}
                    getOptionLabel={(option) => option?.name || ""}
                    value={selectedBusinessService}
                    onChange={handleBussinessServiceChange}
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Business Services"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Autocomplete
                    id="service"
                    options={filteredServices || []}
                    getOptionLabel={(option) => option?.title || ""}
                    value={selectedService}
                    onChange={(_, newValue) => setSelectedService(newValue)}
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    disabled={!selectedBusinessService}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Service"
                        helperText={!selectedBusinessService ? "Select a Business Service first" : ""}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Autocomplete
                    id="degree_program"
                    options={degreeProgramData || []}
                    getOptionLabel={(option) => option?.program_name || ""}
                    value={selectedProgram}
                    onChange={(_, newValue) => setSelectedProgram(newValue)}
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Program"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Autocomplete
                    id="college"
                    options={collegeData || []}
                    getOptionLabel={(option) => option?.collegeName || ""}
                    value={selectedCollege}
                    onChange={(_, newValue) => setSelectedCollege(newValue)}
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="College"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Snackbar
                open={openSnackBar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackBar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Alert onClose={() => setOpenSnackBar(false)} severity={snackSeverity} variant="filled">
                  {snackMessage}
                </Alert>
              </Snackbar>

              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                 sx={{
                    backgroundColor: "#ff6d00",
                    color: "#fff",
                    padding: "8px 24px",
                    textTransform: "uppercase",
                    borderRadius: "4px",
                    mt: 2,
                    "&:hover": {
                      backgroundColor: "#e65100",
                    },
                  }}
                >
                  Update FAQ
                </Button>
              </Box>
            </form>
        </Box>
      }
    />
  );
};

export default FAQEditForm;