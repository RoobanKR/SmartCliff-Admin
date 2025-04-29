import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TablePagination,
  CircularProgress,
  Box,
  Tooltip,
  TextField,
  useTheme,
  useMediaQuery,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Checkbox,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  FileDownload as FileDownloadIcon,
  Clear as ClearIcon,
  Tune as FilterListIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import {
  deleteEnquiry,
  getAllEnquiry,
  sendEmailToEnquiryApplicants,
} from "../../redux/slices/enquiry/enquiry";

const EnquiryControl = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // State variables
  const enquiries = useSelector((state) => state.enquiry.enquires) || [];
  const [loading, setLoading] = useState(true);
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [phoneSearchTerm, setPhoneSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [emailNameSearchTerm, setEmailNameSearchTerm] = useState("");
  const [emailAddressSearchTerm, setEmailAddressSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [emailPage, setEmailPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailRowsPerPage, setEmailRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllEmails, setSelectAllEmails] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [appDateRangeFrom, setAppDateRangeFrom] = useState("");
  const [appDateRangeTo, setAppDateRangeTo] = useState("");
  const [emailDateRangeFrom, setEmailDateRangeFrom] = useState("");
  const [emailDateRangeTo, setEmailDateRangeTo] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  // Fetch enquiries data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllEnquiry());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  // Reset selections when tab changes
  useEffect(() => {
    setSelectedEnquiries([]);
    setSelectedEmails([]);
    setSelectAll(false);
    setSelectAllEmails(false);
  }, [tabValue]);

  // Extract unique categories for dropdown filter
  const uniqueCategories = [
    ...new Set(
      enquiries
        .map((enquiry) => enquiry?.category?.category_name)
        .filter(Boolean)
    ),
  ];

  // Function handlers
  const toggleFilters = () => {
    setFiltersVisible((prev) => !prev);
  };

  const handleDeleteClick = (id) => {
    setSelectedEnquiryId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteEnquiry(selectedEnquiryId))
      .then(() => {
        dispatch(getAllEnquiry());
        setDeleteDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting enquiry:", error);
      });
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedEnquiryId(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
    setEmailPage(0);
  };

  const handleSendEmailClick = () => {
    if (tabValue === 0 && selectedEnquiries.length > 0) {
      setEmailDialogOpen(true);
    } else if (tabValue === 1 && selectedEmails.length > 0) {
      setEmailDialogOpen(true);
    } else {
      console.log("No items selected");
    }
  };

  const handleCloseEmailDialog = () => {
    setEmailDialogOpen(false);
    setEmailSubject("");
    setEmailMessage("");
  };

  const handleSendEmailConfirm = async () => {
    if (!emailSubject || !emailMessage) {
      setSnackbar({
        open: true,
        message: "Subject and message are required",
        severity: "error",
      });
      return;
    }
    setLoadingEmail(true);

    try {
      const response = await dispatch(
        sendEmailToEnquiryApplicants({
          subject: emailSubject,
          message: emailMessage,
          enquiryIds: selectedEnquiries,
        })
      ).unwrap();

      setSnackbar({
        open: true,
        message: `Email sent successfully to ${response.results.success.length} enquiries`,
        severity: "success",
      });
      handleCloseEmailDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message?.[0]?.value || "Failed to send emails",
        severity: "error",
      });
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedEnquiries((prev) => {
      if (prev.includes(id)) {
        return prev.filter((enquiryId) => enquiryId !== id);
      } else {
        return [...prev, id];
      }
    });
    if (selectAll) {
      setSelectAll(false);
    }
  };

  const handleEmailCheckboxChange = (id) => {
    setSelectedEmails((prev) => {
      if (prev.includes(id)) {
        return prev.filter((emailId) => emailId !== id);
      } else {
        return [...prev, id];
      }
    });
    if (selectAllEmails) {
      setSelectAllEmails(false);
    }
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedEnquiries([]);
    } else {
      setSelectedEnquiries(filteredEnquiries.map((enquiry) => enquiry._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectAllEmailsChange = () => {
    if (selectAllEmails) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredEmailHistory.map((email) => email._id));
    }
    setSelectAllEmails(!selectAllEmails);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeEmailPage = (event, newPage) => {
    setEmailPage(newPage);
  };

  const handleChangeEmailRowsPerPage = (event) => {
    setEmailRowsPerPage(parseInt(event.target.value, 10));
    setEmailPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const resetFilters = () => {
    if (tabValue === 0) {
      setNameSearchTerm("");
      setEmailSearchTerm("");
      setPhoneSearchTerm("");
      setSelectedCategory("");
      setAppDateRangeFrom("");
      setAppDateRangeTo("");
    } else {
      setEmailNameSearchTerm("");
      setEmailAddressSearchTerm("");
      setEmailDateRangeFrom("");
      setEmailDateRangeTo("");
    }
  };

  // Export data to Excel
  const exportToExcel = (type) => {
    let dataToExport = [];
    let fileName = "";

    if (type === "enquiries") {
      const selectedData =
        selectedEnquiries.length > 0
          ? enquiries.filter((enquiry) =>
            selectedEnquiries.includes(enquiry._id)
          )
          : filteredEnquiries;

      dataToExport = selectedData.map((enquiry) => ({
        Name: enquiry.name || "N/A",
        Email: enquiry.email || "N/A",
        Phone: enquiry.phone || "N/A",
        Category: enquiry?.category?.category_name || "N/A",
        Course: enquiry?.courses?.course_name || "N/A",
      }));

      fileName =
        "Enquiries_Export_" + new Date().toISOString().split("T")[0] + ".xlsx";
    } else if (type === "emails") {
      const selectedEmailData =
        selectedEmails.length > 0
          ? hasSentEmails
            ? sentEmails.filter((email) => selectedEmails.includes(email._id))
            : filteredEmailHistory
          : filteredEmailHistory;

      dataToExport = selectedEmailData.map((email) => ({
        Name: email.name,
        From: email.from,
        To: email.to,
        Date: email.date,
        Time: email.time,
        Status: email.status,
      }));

      fileName =
        "Email_History_Export_" +
        new Date().toISOString().split("T")[0] +
        ".xlsx";
    }

    if (dataToExport.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, fileName);
    }
  };

  // Filter enquiries
  const filteredEnquiries = enquiries.filter((enquiry) => {
    if (!enquiry) return false;

    const nameMatch = enquiry.name
      ? enquiry.name.toLowerCase().includes(nameSearchTerm.toLowerCase())
      : nameSearchTerm === "";

    const emailMatch = enquiry.email
      ? enquiry.email.toLowerCase().includes(emailSearchTerm.toLowerCase())
      : emailSearchTerm === "";

    const phoneMatch = enquiry.phone
      ? enquiry.phone.toLowerCase().includes(phoneSearchTerm.toLowerCase())
      : phoneSearchTerm === "";

    const categoryMatch =
      selectedCategory === "" ||
      (enquiry.category && enquiry.category.category_name === selectedCategory);

    let dateMatch = true;
    if (appDateRangeFrom || appDateRangeTo) {
      const enquiryDate = new Date(enquiry.createdAt);

      if (appDateRangeFrom) {
        const fromDate = new Date(appDateRangeFrom);
        dateMatch = dateMatch && enquiryDate >= fromDate;
      }

      if (appDateRangeTo) {
        const toDate = new Date(appDateRangeTo);
        toDate.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && enquiryDate <= toDate;
      }
    }

    return nameMatch && emailMatch && phoneMatch && categoryMatch && dateMatch;
  });

  // Get email history
  const getAllSentEmails = () => {
    const sentEmails = [];

    enquiries.forEach((enquiry) => {
      if (enquiry.responseEmails && enquiry.responseEmails.length > 0) {
        enquiry.responseEmails.forEach((email) => {
          sentEmails.push({
            enquiryId: enquiry._id,
            name: enquiry.name,
            to: enquiry.email,
            ...email,
          });
        });
      }
    });

    return sentEmails.sort((a, b) => new Date(b.sentOn) - new Date(a.sentOn));
  };

  const sentEmails = getAllSentEmails();
  const hasSentEmails = Array.isArray(sentEmails) && sentEmails.length > 0;

  const filteredEmailHistory = hasSentEmails
    ? sentEmails.filter((email) => {
      if (!email) return false;

      const nameMatch = email.name
        ? email.name.toLowerCase().includes(emailNameSearchTerm.toLowerCase())
        : emailNameSearchTerm === "";

      const emailAddressMatch = email.to
        ? email.to
          .toLowerCase()
          .includes(emailAddressSearchTerm.toLowerCase())
        : emailAddressSearchTerm === "";

      let dateMatch = true;
      if (emailDateRangeFrom || emailDateRangeTo) {
        const emailDate = new Date(email.sentOn);

        if (emailDateRangeFrom) {
          const fromDate = new Date(emailDateRangeFrom);
          dateMatch = dateMatch && emailDate >= fromDate;
        }

        if (emailDateRangeTo) {
          const toDate = new Date(emailDateRangeTo);
          toDate.setHours(23, 59, 59, 999);
          dateMatch = dateMatch && emailDate <= toDate;
        }
      }

      return nameMatch && emailAddressMatch && dateMatch;
    })
    : [];

  // Get recipient names for display
  const getRecipientNamesForDisplay = () => {
    if (tabValue === 0) {
      // For enquiries tab
      const selectedNames = enquiries
        .filter((enquiry) => selectedEnquiries.includes(enquiry._id))
        .map((enquiry) => enquiry.name || "Unnamed");

      if (selectedNames.length <= 3) {
        return selectedNames.join(", ");
      } else {
        return `${selectedNames.slice(0, 3).join(", ")} + ${selectedNames.length - 3
          } more`;
      }
    } else {
      // For email history tab
      const selectedNames = hasSentEmails
        ? sentEmails
          .filter((email) => selectedEmails.includes(email._id))
          .map((email) => email.name)
        : [];

      if (selectedNames.length <= 3) {
        return selectedNames.join(", ");
      } else {
        return `${selectedNames.slice(0, 3).join(", ")} + ${selectedNames.length - 3
          } more`;
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <LeftNavigationBar
        Content={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        }
      />
    );
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ p: 3 }}>
          {/* Header Section */}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBack}
            sx={{ mb: 2 }} // Add some margin at the bottom
          >
            Back
          </Button>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                padding: 0,
                margin: 0,
                fontWeight: 700,
                textAlign: "center",
                fontWeight: 300,
                fontSize: { xs: "32px", sm: "40px" },
                color: "#747474",
                textAlign: "center",
                textTransform: "uppercase",
                paddingBottom: "5px",
                mt: -4,
                mb: 3,
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
              Enquiry Management
            </Typography>

            {/* Tabs and Controls Section */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={10} md={6}>
                <Box>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="Enquiries" />
                    <Tab label="Email History" />
                  </Tabs>
                </Box>
              </Grid>
              <Grid
                item
                xs={14}
                md={6}
                sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
              >
                {tabValue === 0 ? (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FilterListIcon />}
                      onClick={toggleFilters}
                    >
                      Filter
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FileDownloadIcon />}
                      onClick={() => exportToExcel("enquiries")}
                    >
                      Export{" "}
                      {selectedEnquiries.length > 0
                        ? `(${selectedEnquiries.length})`
                        : ""}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EmailIcon />}
                      onClick={handleSendEmailClick}
                      disabled={selectedEnquiries.length === 0}
                    >
                      Send Email{" "}
                      {selectedEnquiries.length > 0
                        ? `(${selectedEnquiries.length})`
                        : ""}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FilterListIcon />}
                      onClick={toggleFilters}
                      sx={{ mr: 1 }}
                    >
                      Filter
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FileDownloadIcon />}
                      onClick={() => exportToExcel("emails")}
                    >
                      Export{" "}
                      {selectedEmails.length > 0
                        ? `(${selectedEmails.length})`
                        : ""}
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>

            {/* Filter Sections */}
            {filtersVisible && (
              <>
                {tabValue === 0 ? (
                  // Enquiry Filters
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ mb: 1 }}
                      >
                        Enquiry Filters
                      </Typography>
                    </Grid>

                    {/* First row of filters */}
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Search by Name"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => setNameSearchTerm(e.target.value)}
                        value={nameSearchTerm}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Search by Email"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => setEmailSearchTerm(e.target.value)}
                        value={emailSearchTerm}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Search by Phone"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => setPhoneSearchTerm(e.target.value)}
                        value={phoneSearchTerm}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="category-filter-label">
                          Category
                        </InputLabel>
                        <Select
                          labelId="category-filter-label"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          input={<OutlinedInput label="Category" />}
                        >
                          <MenuItem value="">
                            <em>All Categories</em>
                          </MenuItem>
                          {uniqueCategories.map((category, index) => (
                            <MenuItem key={index} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Date Range
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="From"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) =>
                              setAppDateRangeFrom(e.target.value)
                            }
                            value={appDateRangeFrom || ""}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="To"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setAppDateRangeTo(e.target.value)}
                            value={appDateRangeTo || ""}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Filter actions */}
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={resetFilters}
                        sx={{ mr: 1 }}
                        size="small"
                      >
                        Clear Filters
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  // Email Filters
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ mb: 1 }}
                      >
                        Email History Filters
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Search by Recipient Name"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => setEmailNameSearchTerm(e.target.value)}
                        value={emailNameSearchTerm}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Search by Email Address"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) =>
                          setEmailAddressSearchTerm(e.target.value)
                        }
                        value={emailAddressSearchTerm}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Date Range
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="From"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) =>
                              setEmailDateRangeFrom(e.target.value)
                            }
                            value={emailDateRangeFrom || ""}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="To"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) =>
                              setEmailDateRangeTo(e.target.value)
                            }
                            value={emailDateRangeTo || ""}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Filter actions */}
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                      }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        onClick={resetFilters}
                        sx={{ mr: 1 }}
                        size="small"
                      >
                        Clear Filters
                      </Button>

                      {selectedEmails.length > 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ alignSelf: "center", ml: 2 }}
                        >
                          {selectedEmails.length} email(s) selected
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                )}
              </>
            )}
          </Box>

          {/* Enquiries Tab Content */}
          {tabValue === 0 && (
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ backgroundColor: theme.palette.primary.main }}
                    >
                      <TableCell padding="checkbox" sx={{ color: "white" }}>
                        <Checkbox
                          indeterminate={
                            selectedEnquiries.length > 0 &&
                            selectedEnquiries.length < filteredEnquiries.length
                          }
                          checked={selectAll}
                          onChange={handleSelectAllChange}
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "white" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Phone
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Category
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Courses
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Created At
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEnquiries.length > 0 ? (
                      filteredEnquiries
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((enquiry) => (
                          <TableRow
                            key={enquiry._id}
                            hover
                            selected={selectedEnquiries.includes(enquiry._id)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedEnquiries.includes(
                                  enquiry._id
                                )}
                                onChange={() =>
                                  handleCheckboxChange(enquiry._id)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {enquiry.name || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {enquiry.email || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {enquiry.phone || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {enquiry?.category?.category_name || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {enquiry?.courses?.course_name || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {enquiry.createdAt
                                  ? new Date(
                                    enquiry.createdAt
                                  ).toLocaleDateString()
                                  : "N/A"}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Tooltip title="Delete">
                                  <IconButton
                                    onClick={() =>
                                      handleDeleteClick(enquiry._id)
                                    }
                                    color="error"
                                    size={isMobile ? "small" : "medium"}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                          <Typography variant="h6" color="text.secondary">
                            No enquirys found
                          </Typography>
                          {(nameSearchTerm ||
                            emailSearchTerm ||
                            phoneSearchTerm ||
                            nameSearchTerm) && (
                              <Typography variant="body2" color="text.secondary">
                                No results match your filter criteria. Try
                                adjusting your filters.
                              </Typography>
                            )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredEnquiries.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredEnquiries.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </Paper>
          )}

          {/* Response Mail Send to Users Tab Content */}
          {tabValue === 1 && (
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ backgroundColor: theme.palette.primary.main }}
                    >
                      <TableCell padding="checkbox" sx={{ color: "white" }}>
                        <Checkbox
                          indeterminate={
                            selectedEmails.length > 0 &&
                            selectedEmails.length < filteredEmailHistory.length
                          }
                          checked={selectAllEmails}
                          onChange={handleSelectAllEmailsChange}
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "white" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        From
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        To
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Subject
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Body
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Sent On
                      </TableCell>

                      <TableCell sx={{ color: "white", fontWeight: 600 }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEmailHistory.length > 0 ? (
                      filteredEmailHistory
                        .slice(
                          emailPage * emailRowsPerPage,
                          emailPage * emailRowsPerPage + emailRowsPerPage
                        )
                        .map((email) => (
                          <TableRow
                            key={email._id}
                            hover
                            selected={selectedEmails.includes(email._id)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedEmails.includes(email._id)}
                                onChange={() =>
                                  handleEmailCheckboxChange(email._id)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {email.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {email.from}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {email.to}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {email.subject}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {email.body}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={500}>
                                {email.sentOn
                                  ? new Date(email.sentOn).toLocaleString()
                                  : "N/A"}{" "}
                              </Typography>
                            </TableCell>{" "}
                            <TableCell>
                              <Chip
                                label={email.status}
                                color={
                                  email.status === "Success"
                                    ? "success"
                                    : "error"
                                }
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="h6" color="text.secondary">
                            No email history found
                          </Typography>
                          {emailSearchTerm && (
                            <Typography variant="body2" color="text.secondary">
                              No results for "{emailSearchTerm}"
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredEmailHistory.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredEmailHistory.length}
                  rowsPerPage={emailRowsPerPage}
                  page={emailPage}
                  onPageChange={handleChangeEmailPage}
                  onRowsPerPageChange={handleChangeEmailRowsPerPage}
                />
              )}
            </Paper>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteCancel}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: isMobile ? "90%" : 400,
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: theme.palette.error.light,
                color: "white",
                fontWeight: 600,
              }}
            >
              Confirm Deletion
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="body1">
                Are you sure you want to delete this hiring enquiry? This
                action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleDeleteCancel}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                variant="contained"
                color="error"
                sx={{
                  backgroundColor: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Send Email Dialog */}
          <Dialog
            open={emailDialogOpen}
            onClose={() => setEmailDialogOpen(false)}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: isMobile ? "90%" : 500,
              },
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
                fontWeight: 600,
              }}
            >
              {tabValue === 0 ? "Send Email" : "Resend Email"}
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {tabValue === 0
                  ? `You are about to send emails to ${selectedEnquiries.length} selected enquiry(s).`
                  : `You are about to resend emails to ${selectedEmails.length} selected recipient(s).`}
              </Typography>
              {/* Display recipient names */}
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  p: 1.5,
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 1,
                  fontWeight: 500,
                }}
              >
                Recipients: {getRecipientNamesForDisplay()}
              </Typography>
              <TextField
                fullWidth
                label="Subject"
                variant="outlined"
                margin="normal"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                defaultValue={
                  tabValue === 0
                    ? "Your enquiry Status"
                    : "Follow-up on Previous Email"
                }
              />

              <TextField
                fullWidth
                label="Message"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                defaultValue={
                  tabValue === 0
                    ? "Thank you for your enquiry. We are reviewing your details and will get back to you soon."
                    : "This is a follow-up to our previous email. Please let us know if you have any questions."
                }
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setEmailDialogOpen(false)}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmailConfirm}
                variant="contained"
                color="primary"
                startIcon={
                  loadingEmail ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <EmailIcon />
                  )
                }
                disabled={loadingEmail || !emailSubject || !emailMessage} // Disable button while loading
              >
                {loadingEmail ? "Sending..." : "Send"}
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      }
    />
  );
};

export default EnquiryControl;
