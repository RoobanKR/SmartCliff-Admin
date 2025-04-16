import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Button,
  IconButton,
  Divider,
  Paper,
  Container,
  Tooltip,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import {
  fetchFAQById,
  updateFAQ
} from "../../redux/slices/faq/faq";
import {
  fetchCourse,
  selectCourses,
  setSelectedCourse,
} from "../../redux/slices/course/course";
import {
  fetchDegreeProgramData,
  setSelectedDegreeProgram,
} from "../../redux/slices/mca/degreeProgram/degreeProgram";
import { fetchServices } from "../../redux/slices/services/services/Services";
import { getAllBussinessServices } from "../../redux/slices/services/bussinessServices/BussinessSerives";

const FAQEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // Selectors
  const courses = useSelector(selectCourses);
  const degreeProgramData = useSelector((state) => state.degreeProgram.degreeProgramData);
  const serviceData = useSelector((state) => state.service.serviceData);
  const businessServiceData = useSelector((state) => state.businessService.businessServiceData);

  // State
  const [faqItems, setFaqItems] = useState([{ question: "", answer: "" }]);
  const [selectedCourse, setSelectedCourseState] = useState(null);
  const [selectedDegreeProgram, setSelectedDegreeProgramState] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBusinessService, setSelectedBusinessService] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);
  const [touchedFields, setTouchedFields] = useState({
    bussiness_service: false,
    service: false
  });
  const [errors, setErrors] = useState({
    bussiness_service: "",
    service: ""
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(fetchCourse()),
          dispatch(fetchDegreeProgramData()),
          dispatch(fetchServices()),
          dispatch(getAllBussinessServices())
        ]);

        const faqResponse = await dispatch(fetchFAQById(id));
        const faqData = faqResponse.payload;

        if (faqData) {
          // Set FAQ items
          if (Array.isArray(faqData.faqItems)) {
            setFaqItems(faqData.faqItems);
          } else {
            setFaqItems([{
              question: faqData.question || "",
              answer: faqData.answer || ""
            }]);
          }

          // Set related data
          setSelectedCourseState(faqData.course || null);
          setSelectedDegreeProgramState(faqData.degreeProgram || null);
          setSelectedService(faqData.service || null);
          setSelectedBusinessService(faqData.businessService || null);

          // Update filtered services if business service exists
          if (faqData.businessService) {
            const filtered = serviceData.filter(
              (service) => service.business_services?._id === faqData.businessService._id
            );
            setFilteredServices(filtered);
          }
        }
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      }
    };

    fetchInitialData();
  }, [dispatch, id, serviceData]);

  // Handlers
  const handleAddItem = () => {
    setFaqItems([...faqItems, { question: "", answer: "" }]);
  };

  const handleRemoveItem = (index) => {
    const newFaqItems = [...faqItems];
    newFaqItems.splice(index, 1);
    setFaqItems(newFaqItems);
  };

  const handleServiceChange = (_, newValue) => {
    setSelectedService(newValue);
    setTouchedFields(prev => ({ ...prev, service: true }));
  };

  const handleBussinessServiceChange = (_, newValue) => {
    setSelectedBusinessService(newValue);
    setTouchedFields(prev => ({ ...prev, bussiness_service: true }));
    setErrors(prev => ({ ...prev, bussiness_service: "" }));

    if (newValue) {
      const filtered = serviceData.filter(
        (service) => service.business_services?._id === newValue._id
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        faqItems,
        course: selectedCourse,
        degreeProgram: selectedDegreeProgram,
        service: selectedService,
        businessService: selectedBusinessService
      };

      await dispatch(updateFAQ({ id, formData }));
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };

  return (
    <LeftNavigationBar
      Content={
        <Container component="main" maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontFamily: 'Merriweather, serif',
                fontWeight: 700, textAlign: 'center',
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mb: 5,
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
              FAQ Edit Form
            </Typography>

            <form onSubmit={handleSubmit}>
              {faqItems.map((item, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label={`Question ${index + 1}`}
                    variant="outlined"
                    required
                    value={item.question}
                    onChange={(e) => {
                      const newFaqItems = [...faqItems];
                      newFaqItems[index].question = e.target.value;
                      setFaqItems(newFaqItems);
                    }}
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
                    onChange={(e) => {
                      const newFaqItems = [...faqItems];
                      newFaqItems[index].answer = e.target.value;
                      setFaqItems(newFaqItems);
                    }}
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

              <Tooltip title="Add FAQ Item">
                <IconButton onClick={handleAddItem} sx={{ mb: 2 }}>
                  <AddIcon color="secondary" />
                </IconButton>
              </Tooltip>

              <Divider sx={{ my: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                  options={courses || []}
                  getOptionLabel={(option) => option?.course_name || ""}
                  value={selectedCourse}
                  onChange={(_, newValue) => setSelectedCourseState(newValue)}
                  isOptionEqualToValue={(option, value) => 
                    (!option && !value) || (option?._id === value?._id)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Course" variant="outlined" />
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                  options={degreeProgramData || []}
                  getOptionLabel={(option) => option?.program_name || ""}
                  value={selectedDegreeProgram}
                  onChange={(_, newValue) => setSelectedDegreeProgramState(newValue)}
                  isOptionEqualToValue={(option, value) => 
                    (!option && !value) || (option?._id === value?._id)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Degree Program" variant="outlined" />
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <Autocomplete
                  options={businessServiceData || []}
                  getOptionLabel={(option) => option?.name || ""}
                  value={selectedBusinessService}
                  onChange={handleBussinessServiceChange}
                  isOptionEqualToValue={(option, value) => 
                    (!option && !value) || (option?._id === value?._id)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Business Services"
                      variant="outlined"
                      error={Boolean(errors.bussiness_service)}
                      helperText={touchedFields.bussiness_service && errors.bussiness_service}
                    />
                  )}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <Autocomplete
                  options={filteredServices || []}
                  getOptionLabel={(option) => option?.title || ""}
                  value={selectedService}
                  onChange={handleServiceChange}
                  isOptionEqualToValue={(option, value) => 
                    (!option && !value) || (option?._id === value?._id)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Service"
                      variant="outlined"
                      required
                      error={touchedFields.service && Boolean(errors.service)}
                      helperText={touchedFields.service && errors.service}
                    />
                  )}
                />
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#45a049"
                  }
                }}
              >
                Update FAQ
              </Button>
            </form>
          </Paper>
        </Container>
      }
    />
  );
};

export default FAQEditForm;