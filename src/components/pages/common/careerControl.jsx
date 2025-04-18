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
  CircularProgress,
  TablePagination,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  FileDownload as FileDownloadIcon,
  Clear as ClearIcon,
  Tune as FilterListIcon
} from "@mui/icons-material";
import { deleteCareerForm, getAllCareerForm, sendEmailToApplicants } from "../../redux/slices/career/careerForm";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import * as XLSX from 'xlsx';

const CareerControl = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const careeries = useSelector((state) => state.careerForm.careeries) || [];
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [careerId, setCareerId] = useState(null);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Filter states
  const [nameSearchTerm, setNameSearchTerm] = useState('');
  const [emailSearchTerm, setEmailSearchTerm] = useState('');
  const [positionSearchTerm, setPositionSearchTerm] = useState('');
  const [qualificationSearchTerm, setQualificationSearchTerm] = useState('');
  const [emailNameSearchTerm, setEmailNameSearchTerm] = useState('');
  const [emailAddressSearchTerm, setEmailAddressSearchTerm] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  // Add these state variables at the top with your other filter states
  const [dateRangeFrom, setDateRangeFrom] = useState('');
  const [dateRangeTo, setDateRangeTo] = useState('');
  const [emailDateRangeFrom, setEmailDateRangeFrom] = useState('');
  const [emailDateRangeTo, setEmailDateRangeTo] = useState('');

  // Pagination states
  const [page, setPage] = useState(0);
  const [emailPage, setEmailPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [emailRowsPerPage, setEmailRowsPerPage] = useState(10);

  // Tab state
  const [tabIndex, setTabIndex] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllEmails, setSelectAllEmails] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Extract unique job positions for dropdown filter
  const uniquePositions = [...new Set(
    careeries.map(career => career.job_position).filter(Boolean)
  )];


  const [loadingEmail, setLoadingEmail] = useState(false);
  // Extract unique qualifications for dropdown filter
  const uniqueQualifications = [...new Set(
    careeries.map(career => career.qualification).filter(Boolean)
  )];

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllCareerForm());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching career applications:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    // Reset selected applications and emails when tab changes
    setSelectedApplicants([]);
    setSelectedEmails([]);
    setSelectAll(false);
    setSelectAllEmails(false);
  }, [tabIndex]);

  const toggleFilters = () => {
    setFiltersVisible(prev => !prev);
  };

  const resetFilters = () => {
    if (tabIndex === 0) {
      setNameSearchTerm('');
      setEmailSearchTerm('');
      setPositionSearchTerm('');
      setQualificationSearchTerm('');
      setDateRangeFrom(''); // Add this line
      setDateRangeTo('');   // Add this line
    } else {
      setEmailNameSearchTerm('');
      setEmailAddressSearchTerm('');
      setEmailDateRangeFrom(''); // Add this line
      setEmailDateRangeTo('');   // Add this line
    }
  };

  const handleDelete = (clientId) => {
    setCareerId(clientId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteCareerForm(careerId))
      .then(() => {
        setOpenDialog(false);
        dispatch(getAllCareerForm());
        setSnackbar({
          open: true,
          message: "Application deleted successfully",
          severity: "success"
        });
      })
      .catch((error) => {
        setSnackbar({
          open: true,
          message: "Failed to delete application",
          severity: "error"
        });
      });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCareerId(null);
  };

  const handleCheckboxChange = (id) => {
    setSelectedApplicants(prev => {
      if (prev.includes(id)) {
        return prev.filter(applicantId => applicantId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleEmailCheckboxChange = (id) => {
    setSelectedEmails(prev => {
      if (prev.includes(id)) {
        return prev.filter(emailId => emailId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(filteredApplications.map(career => career._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectAllEmails = () => {
    if (selectAllEmails) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(sentEmails.map((_, index) => index));
    }
    setSelectAllEmails(!selectAllEmails);
  };

  const handleOpenEmailDialog = () => {
    if (selectedApplicants.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one applicant",
        severity: "warning"
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
        severity: "error"
      });
      return;
    }

    setLoadingEmail(true); // Start loading

    try {
      // Dispatch the sendEmailToApplicants thunk
      const response = await dispatch(sendEmailToApplicants({
        subject: emailSubject,
        message: emailMessage,
        applicationIds: selectedApplicants
      })).unwrap(); // Use unwrap to handle the promise

      // Update the responseEmails in the Redux store
      const updatedCareers = careeries.map(career => {
        if (selectedApplicants.includes(career._id)) {
          return {
            ...career,
            responseEmails: [
              ...(career.responseEmails || []),
              {
                subject: emailSubject,
                body: emailMessage,
                sentOn: new Date().toISOString()
              }
            ]
          };
        }
        return career;
      });

      // Dispatch the updated careers to the Redux store
      dispatch({ type: 'UPDATE_CAREERS', payload: updatedCareers });

      setSnackbar({
        open: true,
        message: `Email sent successfully to ${response?.results?.success?.length || selectedApplicants.length} applicants`,
        severity: "success"
      });
      handleCloseEmailDialog();
      setSelectedApplicants([]);
      setSelectAll(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message?.[0]?.value || "Failed to send emails",
        severity: "error"
      });
    } finally {
      setLoadingEmail(false); // Stop loading
    }
  };

  const handleDownloadResume = (resumeUrl, applicantName) => {
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `${applicantName}_resume${resumeUrl.substring(resumeUrl.lastIndexOf('.'))}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage(0);
    setEmailPage(0);
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

  // Export data to Excel
  const exportToExcel = (type) => {
    let dataToExport = [];
    let fileName = '';

    if (type === 'applications') {
      // Prepare data for applications export
      const selectedData = selectedApplicants.length > 0
        ? careeries.filter(app => selectedApplicants.includes(app._id))
        : filteredApplications;

      dataToExport = selectedData.map(app => ({
        'Name': app.name || 'N/A',
        'Email': app.email || 'N/A',
        'Phone': app.phone || 'N/A',
        'Qualification': app.qualification || 'N/A',
        'Job Position': app.job_position || 'N/A',
        'Resume URL': app.resume || 'N/A'
      }));

      fileName = 'Career_Applications_Export_' + new Date().toISOString().split('T')[0] + '.xlsx';
    } else if (type === 'emails') {
      // Prepare data for email history export
      const selectedEmailData = selectedEmails.length > 0
        ? sentEmails.filter((_, index) => selectedEmails.includes(index))
        : filteredSentEmails;

      dataToExport = selectedEmailData.map(email => ({
        'Name': email.applicantName || 'N/A',
        'Email': email.applicantEmail || 'N/A',
        'Subject': email.subject || 'N/A',
        'Message': email.body || 'N/A',
        'Sent On': new Date(email.sentOn).toLocaleString() || 'N/A'
      }));

      fileName = 'Email_History_Export_' + new Date().toISOString().split('T')[0] + '.xlsx';
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

  // Get all sent emails across all applicants
  const getAllSentEmails = () => {
    const sentEmails = [];

    careeries.forEach(career => {
      if (career.responseEmails && career.responseEmails.length > 0) {
        career.responseEmails.forEach(email => {
          sentEmails.push({
            applicantId: career._id,
            applicantName: career.name,
            applicantEmail: career.email,
            ...email
          });
        });
      }
    });

    // Sort emails by sent date (newest first)
    return sentEmails.sort((a, b) => new Date(b.sentOn) - new Date(a.sentOn));
  };

  // Get recipient names for display in email dialog
  const getRecipientNamesForDisplay = () => {
    const selectedNames = careeries
      .filter(app => selectedApplicants.includes(app._id))
      .map(app => app.name || 'Unnamed');

    // Display first 3 names and then show "+X more" if there are more
    if (selectedNames.length <= 3) {
      return selectedNames.join(', ');
    } else {
      return `${selectedNames.slice(0, 3).join(', ')} + ${selectedNames.length - 3} more`;
    }
  };

  // Application filtering with multiple filters
  const filteredApplications = careeries.filter(career => {
    if (!career) return false;

    const nameMatch = career.name ?
      career.name.toLowerCase().includes(nameSearchTerm.toLowerCase()) :
      nameSearchTerm === '';

    const emailMatch = career.email ?
      career.email.toLowerCase().includes(emailSearchTerm.toLowerCase()) :
      emailSearchTerm === '';

    const positionMatch = positionSearchTerm === '' ||
      (career.job_position && career.job_position.toLowerCase() === positionSearchTerm.toLowerCase());

    const qualificationMatch = qualificationSearchTerm === '' ||
      (career.qualification && career.qualification.toLowerCase() === qualificationSearchTerm.toLowerCase());

    // Add date range filtering
    let dateMatch = true;
    if (dateRangeFrom || dateRangeTo) {
      const createdDate = career.createdOn ? new Date(career.createdOn) : null;

      if (createdDate) {
        // Set to start of day for from date
        const fromDate = dateRangeFrom ? new Date(dateRangeFrom) : null;
        if (fromDate) {
          fromDate.setHours(0, 0, 0, 0);
          if (createdDate < fromDate) dateMatch = false;
        }

        // Set to end of day for to date
        const toDate = dateRangeTo ? new Date(dateRangeTo) : null;
        if (toDate) {
          toDate.setHours(23, 59, 59, 999);
          if (createdDate > toDate) dateMatch = false;
        }
      } else {
        // If we can't parse the date but we have filters, exclude it
        if (dateRangeFrom || dateRangeTo) dateMatch = false;
      }
    }

    return nameMatch && emailMatch && positionMatch && qualificationMatch && dateMatch;
  });

  // Get all sent emails
  const sentEmails = getAllSentEmails();
  const hasSentEmails = sentEmails.length > 0;

  // Email filtering with multiple filters
  const filteredSentEmails = sentEmails.filter(email => {
    if (!email) return false;

    const nameMatch = email.applicantName ?
      email.applicantName.toLowerCase().includes(emailNameSearchTerm.toLowerCase()) :
      emailNameSearchTerm === '';

    const emailAddressMatch = email.applicantEmail ?
      email.applicantEmail.toLowerCase().includes(emailAddressSearchTerm.toLowerCase()) :
      emailAddressSearchTerm === '';

    // Add date range filtering for emails
    let dateMatch = true;
    if (emailDateRangeFrom || emailDateRangeTo) {
      const sentDate = email.sentOn ? new Date(email.sentOn) : null;

      if (sentDate) {
        // Set to start of day for from date
        const fromDate = emailDateRangeFrom ? new Date(emailDateRangeFrom) : null;
        if (fromDate) {
          fromDate.setHours(0, 0, 0, 0);
          if (sentDate < fromDate) dateMatch = false;
        }

        // Set to end of day for to date
        const toDate = emailDateRangeTo ? new Date(emailDateRangeTo) : null;
        if (toDate) {
          toDate.setHours(23, 59, 59, 999);
          if (sentDate > toDate) dateMatch = false;
        }
      } else {
        // If we can't parse the date but we have filters, exclude it
        if (emailDateRangeFrom || emailDateRangeTo) dateMatch = false;
      }
    }

    return nameMatch && emailAddressMatch && dateMatch;
  });

  if (loading) {
    return (
      <LeftNavigationBar
        Content={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
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
          <Box sx={{ mb: 4 }}>
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
              Career Application Records
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
              <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
                      onClick={() => exportToExcel('applications')}
                    >
                      Export {selectedApplicants.length > 0 ? `(${selectedApplicants.length})` : ''}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EmailIcon />}
                      onClick={handleOpenEmailDialog}
                      disabled={selectedApplicants.length === 0}
                    >
                      Send Email {selectedApplicants.length > 0 ? `(${selectedApplicants.length})` : ''}
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
                      onClick={() => exportToExcel('emails')}
                    >
                      Export {selectedEmails.length > 0 ? `(${selectedEmails.length})` : ''}
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>

            {/* Filter Sections */}
            {filtersVisible && (
              <>
                {tabIndex === 0 ? (
                  // Application Filters
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Application Filters
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
                          )
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
                          )
                        }}
                        onChange={(e) => setEmailSearchTerm(e.target.value)}
                        value={emailSearchTerm}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="position-filter-label">Job Position</InputLabel>
                        <Select
                          labelId="position-filter-label"
                          value={positionSearchTerm}
                          onChange={(e) => setPositionSearchTerm(e.target.value)}
                          input={<OutlinedInput label="Job Position" />}
                        >
                          <MenuItem value="">
                            <em>All Positions</em>
                          </MenuItem>
                          {uniquePositions.map((position, index) => (
                            <MenuItem key={index} value={position}>
                              {position}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="qualification-filter-label">Qualification</InputLabel>
                        <Select
                          labelId="qualification-filter-label"
                          value={qualificationSearchTerm}
                          onChange={(e) => setQualificationSearchTerm(e.target.value)}
                          input={<OutlinedInput label="Qualification" />}
                        >
                          <MenuItem value="">
                            <em>All Qualifications</em>
                          </MenuItem>
                          {uniqueQualifications.map((qualification, index) => (
                            <MenuItem key={index} value={qualification}>
                              {qualification}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* ADD DATE RANGE FILTERS HERE */}
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
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
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
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
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
                          )
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
                          )
                        }}
                        onChange={(e) => setEmailAddressSearchTerm(e.target.value)}
                        value={emailAddressSearchTerm}
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
                            onChange={(e) => setEmailDateRangeFrom(e.target.value)}
                            value={emailDateRangeFrom || ""}
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
                            onChange={(e) => setEmailDateRangeTo(e.target.value)}
                            value={emailDateRangeTo || ""}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Filter actions */}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
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

          {/* Applicants Tab Content */}
          {tabIndex === 0 && (
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                      <TableCell padding="checkbox" sx={{ color: 'white' }}>
                        <Checkbox
                          indeterminate={selectedApplicants.length > 0 && selectedApplicants.length < filteredApplications.length}
                          checked={selectAll}
                          onChange={handleSelectAll}
                          sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Email</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Phone</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Qualification</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Job Position</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Created At</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Resume</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApplications.length > 0 ? (
                      filteredApplications
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((career) => (
                          <TableRow key={career._id} hover selected={selectedApplicants.includes(career._id)}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedApplicants.includes(career._id)}
                                onChange={() => handleCheckboxChange(career._id)}
                              />
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Typography fontWeight={500}>
                                {career.name || 'N/A'}
                              </Typography>
                            </TableCell >
                            <TableCell sx={{ textAlign: "center" }}>
                              <Typography fontWeight={500}>
                                {career.email || 'N/A'}
                              </Typography>
                            </TableCell >
                            <TableCell sx={{ textAlign: "center" }}>
                              <Typography fontWeight={500}>
                                {career.phone || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Typography fontWeight={500}>
                                {career.qualification || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Typography fontWeight={500}>
                                {career.job_position || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Typography fontWeight={500}>
                                {career.createdOn
                                  ? new Date(career.createdOn).toLocaleString()
                                  : 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleDownloadResume(career.resume, career.name)}
                              >
                                Download
                              </Button>
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Box >
                                <Tooltip title="Delete">
                                  <IconButton
                                    onClick={() => handleDelete(career._id)}
                                    color="error"
                                    size={isMobile ? 'small' : 'medium'}
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
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="h6" color="text.secondary">
                            No applications found
                          </Typography>
                          {(nameSearchTerm || emailSearchTerm || positionSearchTerm || qualificationSearchTerm) && (
                            <Typography variant="body2" color="text.secondary">
                              No results match your filter criteria. Try adjusting your filters.
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredApplications.length > 0 && (
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredApplications.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </Paper>
          )
          }

          {/* Email History Tab Content */}
          {
            tabIndex === 1 && (
              <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {hasSentEmails ? (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                            <TableCell padding="checkbox" sx={{ color: 'white' }}>
                              <Checkbox
                                indeterminate={selectedEmails.length > 0 && selectedEmails.length < filteredSentEmails.length}
                                checked={selectAllEmails}
                                onChange={handleSelectAllEmails}
                                sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>From</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>To</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Subject</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Message</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Sent On</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: "center" }}>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredSentEmails.length > 0 ? (
                            filteredSentEmails
                              .slice(emailPage * emailRowsPerPage, emailPage * emailRowsPerPage + emailRowsPerPage)
                              .map((email, index) => (
                                <TableRow key={index} hover>
                                  <TableCell padding="checkbox">
                                    <Checkbox
                                      checked={selectedEmails.includes(index)}
                                      onChange={() => handleEmailCheckboxChange(index)}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>{email.applicantName}</TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    {email?.from ?? "N/A"}
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>{email.applicantEmail}</TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>{email.subject}</TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>
                                    {email.body?.length > 50
                                      ? `${email.body.substring(0, 50)}...`
                                      : email.body}
                                  </TableCell>
                                  <TableCell sx={{ textAlign: "center" }}>{new Date(email.sentOn).toLocaleString()}</TableCell>
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                <Typography variant="h6" color="text.secondary">
                                  No email history found
                                </Typography>
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
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    mt: 2
                  }}>
                    <Typography variant="h6" color="text.secondary">
                      No email responses have been sent yet
                    </Typography>
                  </Box>
                )}
              </Paper>
            )
          }

          {/* Delete Confirmation Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this application?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Email Dialog */}
          <Dialog open={openEmailDialog} onClose={handleCloseEmailDialog} PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: isMobile ? '90%' : 500
            }
          }}>
            <DialogTitle sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              fontWeight: 600
            }}>
              Send Email
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You are about to send emails to {selectedApplicants.length} selected applicant(s).
              </Typography>
              {/* Display recipient names */}
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  p: 1.5,
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 1,
                  fontWeight: 500
                }}
              >
                Recipients: {getRecipientNamesForDisplay()} {/* Implement this function to get names */}
              </Typography>
              <TextField
                fullWidth
                label="Subject"
                variant="outlined"
                margin="normal"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Message"
                variant="outlined"
                margin="normal"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                multiline
                rows={4}
                required
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleCloseEmailDialog} variant="outlined">Cancel</Button>

              <Button
                onClick={handleSendEmail}
                variant="contained"
                color="primary"
                startIcon={loadingEmail ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />}
                disabled={loadingEmail || !emailSubject || !emailMessage} // Disable button while loading
              >
                {loadingEmail ? 'Sending...' : 'Send'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
              {snackbar.message}
            </Alert >
          </Snackbar>
        </Box >
      }
    />
  );
};

export default CareerControl;