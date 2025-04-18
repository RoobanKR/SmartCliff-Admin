import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DialogActions,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Checkbox,
  TextField,
  Box,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Grid,
  TablePagination,
  Chip,
  InputAdornment,
  Tooltip,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  Clear as ClearIcon,
  Tune as FilterListIcon,
} from "@mui/icons-material";
import {
  deleteContact,
  getAllContact,
  sendEmailToContactApplicants,
} from "../../redux/slices/contact/contact";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const ContactControl = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contact.contacts) || [];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // State for dialogs
  const [openDialog, setOpenDialog] = useState(false);
  const [contactId, setContactId] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State for tabs
  const [tabIndex, setTabIndex] = useState(0);

  // State for pagination
  const [page, setPage] = useState(0);
  const [emailPage, setEmailPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailRowsPerPage, setEmailRowsPerPage] = useState(10);

  // State for filters
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [messageSearchTerm, setMessageSearchTerm] = useState("");
  // const [dateSearchTerm, setDateSearchTerm] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [dateRangeFrom, setDateRangeFrom] = useState(null);
  const [dateRangeTo, setDateRangeTo] = useState(null);

  // State for email history filters
  const [emailNameSearchTerm, setEmailNameSearchTerm] = useState("");
  const [emailAddressSearchTerm, setEmailAddressSearchTerm] = useState("");
  const [emailSubjectSearchTerm, setEmailSubjectSearchTerm] = useState("");
  const [emailDateRangeFrom, setEmailDateRangeFrom] = useState(null);
  const [emailDateRangeTo, setEmailDateRangeTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  const handleBack = () => {
    navigate(-1); 
  };  

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllContact());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleDelete = (clientId) => {
    setContactId(clientId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteContact(contactId))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAllContact());
        setSnackbar({
          open: true,
          message: "Contact deleted successfully",
          severity: "success",
        });
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: "Failed to delete contact",
          severity: "error",
        });
      });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setContactId(null);
  };

  const handleCheckboxChange = (id) => {
    setSelectedContacts((prev) => {
      if (prev.includes(id)) {
        return prev.filter((contactId) => contactId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedContacts(filteredContacts.map((contact) => contact._id));
    } else {
      setSelectedContacts([]);
    }
  };

  // Email selection handlers
  const handleEmailCheckboxChange = (emailId) => {
    setSelectedEmails((prev) => {
      if (prev.includes(emailId)) {
        return prev.filter((id) => id !== emailId);
      } else {
        return [...prev, emailId];
      }
    });
  };

  const handleSelectAllEmails = (event) => {
    if (event.target.checked) {
      // Create unique IDs for emails since they don't have their own IDs
      const emailIds = filteredSentEmails.map((_, index) => `email-${index}`);
      setSelectedEmails(emailIds);
    } else {
      setSelectedEmails([]);
    }
  };

  const handleOpenEmailDialog = () => {
    if (selectedContacts.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one contact",
        severity: "warning",
      });
      return;
    }
    setOpenEmailDialog(true);
  };

  const handleCloseEmailDialog = () => {
    setOpenEmailDialog(false);
    setEmailSubject("");
    setEmailMessage("");
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailMessage) {
      setSnackbar({
        open: true,
        message: "Subject and message are required",
        severity: "error",
      });
      return;
    }

    setLoadingEmail(true); // Start loading

    try {
      const response = await dispatch(
        sendEmailToContactApplicants({
          subject: emailSubject,
          message: emailMessage,
          contactIds: selectedContacts,
        })
      ).unwrap();

      setSnackbar({
        open: true,
        message: `Email sent successfully to ${response.results.success.length} contacts`,
        severity: "success",
      });
      handleCloseEmailDialog();
      // Reset selections after sending
      setSelectedContacts([]);
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message?.[0]?.value || "Failed to send emails",
        severity: "error",
      });
    } finally {
      setLoadingEmail(false); // Stop loading
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    // Reset page and selected items when changing tabs
    setPage(0);
    setEmailPage(0);
    setSelectedContacts([]);
    setSelectedEmails([]);
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setFiltersVisible((prev) => !prev);
  };

  // Reset filters
  const resetFilters = () => {
    if (tabIndex === 0) {
      setNameSearchTerm("");
      setEmailSearchTerm("");
      setMessageSearchTerm("");
      // setDateSearchTerm('');
      setDateRangeFrom(null);
      setDateRangeTo(null);
    } else {
      setEmailNameSearchTerm("");
      setEmailAddressSearchTerm("");
      setEmailSubjectSearchTerm("");
      setEmailDateRangeFrom(null); // Add this
      setEmailDateRangeTo(null); // Add this
    }
  };

  // Handle pagination
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

  // Get all sent emails across all contacts
  const getAllSentEmails = () => {
    const sentEmails = [];

    contacts.forEach((contact) => {
      if (contact.responseEmails && contact.responseEmails.length > 0) {
        contact.responseEmails.forEach((email) => {
          sentEmails.push({
            contactId: contact._id,
            contactName: contact.name,
            contactEmail: contact.email,
            ...email,
          });
        });
      }
    });

    return sentEmails.sort((a, b) => new Date(b.sentOn) - new Date(a.sentOn));
  };

  // Export to Excel functionality
  const exportToExcel = (type) => {
    let dataToExport = [];
    let fileName = "";

    if (type === "contacts") {
      // Prepare data for contacts export
      const selectedData =
        selectedContacts.length > 0
          ? contacts.filter((contact) => selectedContacts.includes(contact._id))
          : filteredContacts;

      dataToExport = selectedData.map((contact) => ({
        Name: contact.name || "N/A",
        Email: contact.email || "N/A",
        Message: contact.message || "N/A",
        "Created At": contact.createdAt
          ? format(new Date(contact.createdAt), "yyyy-MM-dd HH:mm")
          : "N/A",
      }));

      fileName =
        "Contacts_Export_" + new Date().toISOString().split("T")[0] + ".xlsx";
    } else if (type === "emails") {
      // Prepare data for email history export
      // If emails are selected, export only those
      const allEmails = getAllSentEmails();
      const selectedEmailData =
        selectedEmails.length > 0
          ? filteredSentEmails.filter((_, index) =>
              selectedEmails.includes(`email-${index}`)
            )
          : filteredSentEmails;

      dataToExport = selectedEmailData.map((email) => ({
        Name: email.contactName || "N/A",
        Email: email.contactEmail || "N/A",
        Subject: email.subject || "N/A",
        Message: email.body || "N/A",
        "Sent On": email.sentOn
          ? new Date(email.sentOn).toLocaleString()
          : "N/A",
      }));

      fileName =
        "Email_History_Export_" +
        new Date().toISOString().split("T")[0] +
        ".xlsx";
    }

    if (dataToExport.length > 0) {
      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Generate Excel file and download
      XLSX.writeFile(workbook, fileName);
    }
  };

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    if (!contact) return false;

    const nameMatch = contact.name
      ? contact.name.toLowerCase().includes(nameSearchTerm.toLowerCase())
      : nameSearchTerm === "";

    const emailMatch = contact.email
      ? contact.email.toLowerCase().includes(emailSearchTerm.toLowerCase())
      : emailSearchTerm === "";

    const messageMatch = contact.message
      ? contact.message.toLowerCase().includes(messageSearchTerm.toLowerCase())
      : messageSearchTerm === "";
    const contactDate = contact.createdAt ? new Date(contact.createdAt) : null;
    const dateMatch = contactDate
      ? (!dateRangeFrom || contactDate >= new Date(dateRangeFrom)) &&
        (!dateRangeTo || contactDate <= new Date(dateRangeTo + "T23:59:59"))
      : !dateRangeFrom && !dateRangeTo;

    return nameMatch && emailMatch && messageMatch && dateMatch;
  });

  // Filter sent emails
  const sentEmails = getAllSentEmails();
  const filteredSentEmails = sentEmails.filter((email) => {
    if (!email) return false;

    const nameMatch = email.contactName
      ? email.contactName
          .toLowerCase()
          .includes(emailNameSearchTerm.toLowerCase())
      : emailNameSearchTerm === "";

    const emailMatch = email.contactEmail
      ? email.contactEmail
          .toLowerCase()
          .includes(emailAddressSearchTerm.toLowerCase())
      : emailAddressSearchTerm === "";

    const subjectMatch = email.subject
      ? email.subject
          .toLowerCase()
          .includes(emailSubjectSearchTerm.toLowerCase())
      : emailSubjectSearchTerm === "";

    const emailDate = email.sentOn ? new Date(email.sentOn) : null;
    const dateMatch = emailDate
      ? (!emailDateRangeFrom || emailDate >= new Date(emailDateRangeFrom)) &&
        (!emailDateRangeTo ||
          emailDate <= new Date(emailDateRangeTo + "T23:59:59"))
      : !emailDateRangeFrom && !emailDateRangeTo;

    return nameMatch && emailMatch && subjectMatch && dateMatch;
  });

  const hasSentEmails = sentEmails.length > 0;
  const recipientCount = selectedContacts.length;

  // Get recipient names for display
  const getRecipientNamesForDisplay = () => {
    const selectedNames = contacts
      .filter((contact) => selectedContacts.includes(contact._id))
      .map((contact) => contact.name || "Unnamed");

    // Display first 3 names and then show "+X more" if there are more
    if (selectedNames.length <= 3) {
      return selectedNames.join(", ");
    } else {
      return `${selectedNames.slice(0, 3).join(", ")} + ${
        selectedNames.length - 3
      } more`;
    }
  };

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ p: 3 }}>
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
              Contact Application Records
            </Typography>

            {/* Tabs and Controls Section */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="Application Details" />
                    <Tab label="Email Details" />
                  </Tabs>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
              >
                {tabIndex === 0 ? (
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
                      onClick={() => exportToExcel("contacts")}
                    >
                      Export{" "}
                      {selectedContacts.length > 0
                        ? `(${selectedContacts.length})`
                        : ""}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EmailIcon />}
                      onClick={handleOpenEmailDialog}
                      disabled={selectedContacts.length === 0}
                    >
                      Send Email{" "}
                      {selectedContacts.length > 0
                        ? `(${selectedContacts.length})`
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
                    >
                      Filter
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FileDownloadIcon />}
                      onClick={() => exportToExcel("emails")}
                      disabled={filteredSentEmails.length === 0}
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
                {tabIndex === 0 ? (
                  // Contact Filters
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ mb: 1 }}
                      >
                        Application Details{" "}
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
                        label="Search by Message"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => setMessageSearchTerm(e.target.value)}
                        value={messageSearchTerm}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="From Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setDateRangeFrom(e.target.value)}
                            value={dateRangeFrom || ""}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            label="To Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => setDateRangeTo(e.target.value)}
                            value={dateRangeTo || ""}
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
                  // Email History Filters
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{ mb: 1 }}
                      >
                        Email Details
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
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
                    <Grid item xs={12} sm={6} md={4}>
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
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Search by Subject"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) =>
                          setEmailSubjectSearchTerm(e.target.value)
                        }
                        value={emailSubjectSearchTerm}
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
                    </Grid>
                  </Grid>
                )}
              </>
            )}
          </Box>

          {/* Contacts Tab Content */}
          {tabIndex === 0 && (
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
                            selectedContacts.length > 0 &&
                            selectedContacts.length < filteredContacts.length
                          }
                          checked={
                            filteredContacts.length > 0 &&
                            selectedContacts.length === filteredContacts.length
                          }
                          onChange={handleSelectAll}
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "white" },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        Message
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        Created At
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredContacts.length > 0 ? (
                      filteredContacts
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((contact) => (
                          <TableRow
                            key={contact._id}
                            hover
                            selected={selectedContacts.includes(contact._id)}
                          >
                            <TableCell
                              padding="checkbox"
                              sx={{ textAlign: "center" }}
                            >
                              <Checkbox
                                checked={selectedContacts.includes(contact._id)}
                                onChange={() =>
                                  handleCheckboxChange(contact._id)
                                }
                              />
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Typography fontWeight={500}>
                                {contact.name || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Typography fontWeight={500}>
                                {contact.email || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Typography fontWeight={500}>
                                {contact.message && contact.message.length > 50
                                  ? `${contact.message.substring(0, 50)}...`
                                  : contact.message || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Typography fontWeight={500}>
                                {contact.createdAt
                                  ? new Date(contact.createdAt).toLocaleString()
                                  : "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Box>
                                <Tooltip title="Delete">
                                  <IconButton
                                    onClick={() => handleDelete(contact._id)}
                                    color="error"
                                    size={isMobile ? "small" : "medium"}
                                    sx={{ textAlign: "center" }}
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
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="h6" color="text.secondary">
                            No contacts found
                          </Typography>
                          {(nameSearchTerm ||
                            emailSearchTerm ||
                            messageSearchTerm) && (
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

              {filteredContacts.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredContacts.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </Paper>
          )}

          {/* Email History Tab Content */}
          {tabIndex === 1 && (
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
              {hasSentEmails ? (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{ backgroundColor: theme.palette.primary.main }}
                        >
                          <TableCell
                            padding="checkbox"
                            sx={{ color: "white", textAlign: "center" }}
                          >
                            <Checkbox
                              indeterminate={
                                selectedEmails.length > 0 &&
                                selectedEmails.length <
                                  filteredSentEmails.length
                              }
                              checked={
                                filteredSentEmails.length > 0 &&
                                selectedEmails.length ===
                                  filteredSentEmails.length
                              }
                              onChange={handleSelectAllEmails}
                              sx={{
                                color: "white",
                                "&.Mui-checked": { color: "white" },
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            Name
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            From
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            To
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            Subject
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            Message
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            Sent On
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "white",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredSentEmails.length > 0 ? (
                          filteredSentEmails
                            .slice(
                              emailPage * emailRowsPerPage,
                              emailPage * emailRowsPerPage + emailRowsPerPage
                            )
                            .map((email, index) => {
                              const emailId = `email-${index}`;
                              return (
                                <TableRow
                                  key={emailId}
                                  hover
                                  selected={selectedEmails.includes(emailId)}
                                >
                                  <TableCell
                                    padding="checkbox"
                                    sx={{ textAlign: "center" }}
                                  >
                                    <Checkbox
                                      checked={selectedEmails.includes(emailId)}
                                      onChange={() =>
                                        handleEmailCheckboxChange(emailId)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    <Typography fontWeight={500}>
                                      {email.contactName || "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    <Typography fontWeight={500}>
                                      {email.from || "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    <Typography fontWeight={500}>
                                      {email.contactEmail || "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    <Typography fontWeight={500}>
                                      {email.subject || "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    <Typography fontWeight={500}>
                                      {email.body && email.body.length > 50
                                        ? `${email.body.substring(0, 50)}...`
                                        : email.body || "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    <Typography fontWeight={500}>
                                      {email.sentOn
                                        ? new Date(
                                            email.sentOn
                                          ).toLocaleString()
                                        : "N/A"}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              align="center"
                              sx={{ py: 4 }}
                            >
                              <Typography variant="h6" color="text.secondary">
                                No email history found
                              </Typography>
                              {(emailNameSearchTerm ||
                                emailAddressSearchTerm ||
                                emailSubjectSearchTerm ||
                                emailDateRangeFrom ||
                                emailDateRangeTo) && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
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

                  {filteredSentEmails.length > 0 && (
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={filteredSentEmails.length}
                      rowsPerPage={emailRowsPerPage}
                      page={emailPage}
                      onPageChange={handleChangeEmailPage}
                      onRowsPerPageChange={handleChangeEmailRowsPerPage}
                    />
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                    borderRadius: "4px",
                    p: 3,
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    No email responses have been sent yet
                  </Typography>
                </Box>
              )}
            </Paper>
          )}

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: isMobile ? "90%" : 500,
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
                Are you sure you want to delete this contact? This action cannot
                be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
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
            open={openEmailDialog}
            onClose={handleCloseEmailDialog}
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
              Send Email to Selected Contacts
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You are about to send emails to {recipientCount} selected
                contact(s).
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
                label="Subject"
                fullWidth
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Message"
                fullWidth
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                margin="normal"
                required
                multiline
                rows={4}
                variant="outlined"
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleCloseEmailDialog}
                variant="outlined"
                sx={{
                  borderColor: theme.palette.grey[400],
                  color: theme.palette.text.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmail}
                variant="contained"
                color="primary"
                disabled={loadingEmail || !emailSubject || !emailMessage}
                startIcon={
                  loadingEmail ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <EmailIcon />
                  )
                }
              >
                {loadingEmail ? "Sending..." : "Send"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

export default ContactControl;
