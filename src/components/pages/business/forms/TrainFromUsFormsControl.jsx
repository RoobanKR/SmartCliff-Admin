import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
    Alert
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Search as SearchIcon,
    Email as EmailIcon,
    FileDownload as FileDownloadIcon,
    Clear as ClearIcon,
    Tune as FilterListIcon
} from '@mui/icons-material';
import LeftNavigationBar from '../../../navbars/LeftNavigationBar';
import * as XLSX from 'xlsx';
import fi from 'date-fns/locale/fi/index.js';
import { deleteTrainFromUs, getAllTrainFromUs, sendEmailToTrainFromUsApplicants } from '../../../redux/slices/business/form/trainFormUsForm';
import { useNavigate } from 'react-router-dom';

const TrainFromUsFormsControl = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const trainingApplications = useSelector((state) => state.trainFromUs.trainingApplications) || [];
    const [loading, setLoading] = useState(true);
    const [nameSearchTerm, setNameSearchTerm] = useState('');
    const [emailSearchTerm, setEmailSearchTerm] = useState('');
    const [companySearchTerm, setCompanySearchTerm] = useState('');
    const [selectedSkillset, setSelectedSkillset] = useState('');
    const [emailNameSearchTerm, setEmailNameSearchTerm] = useState('');
    const [emailAddressSearchTerm, setEmailAddressSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [emailPage, setEmailPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [emailRowsPerPage, setEmailRowsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectAllEmails, setSelectAllEmails] = useState(false);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  // For Registered Users tab

const [appDateRangeFrom, setAppDateRangeFrom] = useState("");

const [appDateRangeTo, setAppDateRangeTo] = useState("");
 
// For Response Mail Send to Users tab

const [emailDateRangeFrom, setEmailDateRangeFrom] = useState("");

const [emailDateRangeTo, setEmailDateRangeTo] = useState("");
 
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

    const [filtersVisible, setFiltersVisible] = useState(false);

  const handleBack = () => {
    navigate(-1); 
  }; 

    // Add this function to toggle filter visibility
    const toggleFilters = () => {
        setFiltersVisible(prev => !prev);
    };
    const handleCloseEmailDialog = () => {
        setEmailDialogOpen(false);
        setEmailSubject("");
        setEmailMessage("");
      };
    
    // Extract unique skillsets for dropdown filter
    const uniqueSkillsets = [...new Set(
        trainingApplications
            .flatMap(app => app.skillsetRequirements || [])
            .map(skill => skill.skillset)
            .filter(Boolean)
    )];

    // Mock email history data - more entries for pagination testing

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getAllTrainFromUs());
                setLoading(false);
            } catch (error) {
                console.error("Error fetching hiring applications:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        // Reset selected applications and emails when tab changes
        setSelectedApplications([]);
        setSelectedEmails([]);
        setSelectAll(false);
        setSelectAllEmails(false);
    }, [tabValue]);

    const handleDeleteClick = (id) => {
        setSelectedApplicationId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteTrainFromUs(selectedApplicationId))
            .then(() => {
                dispatch(getAllTrainFromUs());
                setDeleteDialogOpen(false);
            })
            .catch((error) => {
                console.error("Error deleting application:", error);
            });
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedApplicationId(null);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setPage(0);
        setEmailPage(0);
    };

    const handleSendEmailClick = () => {
        if (tabValue === 0 && selectedApplications.length > 0) {
            setEmailDialogOpen(true);
        } else if (tabValue === 1 && selectedEmails.length > 0) {
            setEmailDialogOpen(true);
        } else {
            // You could show an alert or notification here
            console.log("No items selected");
        }
    };

    const handleSendEmailConfirm = async () => {
       if (!emailSubject || !emailMessage) {
            setSnackbar({
              open: true,
              message: "Subject and message are required",
              severity: "error"
            });
            return;
          }
          setLoadingEmail(true);
        
          try {
            const response = await dispatch(sendEmailToTrainFromUsApplicants({
              subject: emailSubject,
              message: emailMessage,
              applicationIds: selectedApplications
            })).unwrap();
        
            setSnackbar({
              open: true,
              message: `Email sent successfully to ${response.results.success.length} trainingApplications`,
              severity: "success"
            });
            handleCloseEmailDialog();
          } catch (error) {
            setSnackbar({
              open: true,
              message: error.response?.data?.message?.[0]?.value || "Failed to send emails",
              severity: "error"
            });
          }finally {
            setLoadingEmail(false);
          }
        };
      

        const handleCheckboxChange = (id) => {
            setSelectedApplications(prev => {
                if (prev.includes(id)) {
                    return prev.filter(appId => appId !== id);
                } else {
                    return [...prev, id];
                }
            });
            // Reset selectAll state if any individual checkbox is checked/unchecked
            if (selectAll) {
                setSelectAll(false);
            }
        };
        const handleEmailCheckboxChange = (id) => {
            setSelectedEmails(prev => {
                if (prev.includes(id)) {
                    return prev.filter(emailId => emailId !== id);
                } else {
                    return [...prev, id];
                }
            });
            // Reset selectAllEmails state if any individual checkbox is checked/unchecked
            if (selectAllEmails) {
                setSelectAllEmails(false);
            }
        };
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedApplications([]);
        } else {
            setSelectedApplications(filteredApplications.map(app => app._id));
        }
        setSelectAll(!selectAll);
    };
    const handleSelectAllEmailsChange = () => {
        if (selectAllEmails) {
            setSelectedEmails([]);
        } else {
            setSelectedEmails(filteredEmailHistory.map(email => email._id));
        }
        setSelectAllEmails(!selectAllEmails);
    };
    
    const exportToExcel = (type) => {
        let dataToExport = [];
        let fileName = '';
 
        if (type === 'applications') {
            // Prepare data for applications export
            const selectedData = selectedApplications.length > 0
                ? trainingApplications.filter(app => selectedApplications.includes(app._id))
                : filteredApplications; // <-- This is the change: use filteredApplications instead of trainingApplications
 
            dataToExport = selectedData.map(app => ({
                'Name': app.name || 'N/A',
                'Company Name': app.company_name || 'N/A',
                'Mobile': app.mobile || 'N/A',
                'Email': app.email || 'N/A',
                'Skillset Requirements': app.skillsetRequirements ? app.skillsetRequirements.map(skill => skill.skillset).join(', ') : 'N/A',
                'Resources': app.skillsetRequirements ? app.skillsetRequirements.map(skill => skill.resources).join(', ') : 'N/A',
                'Enquiry': app.enquiry || 'N/A'
            }));
 
            fileName = 'Hiring_Applications_Export_' + new Date().toISOString().split('T')[0] + '.xlsx';
        } else if (type === 'emails') {
            // Prepare data for email history export
            const selectedEmailData = selectedEmails.length > 0
            ? hasSentEmails ? sentEmails.filter(email => selectedEmails.includes(email._id)) : filteredEmailHistory
            : filteredEmailHistory; 
            dataToExport = selectedEmailData.map(email => ({
                'Name': email.name,
                'From': email.from,
                'To': email.to,
                'Date': email.date,
                'Time': email.time,
                'Status': email.status
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
 
 

    const resetFilters = () => {

        if (tabValue === 0) {
    
            setNameSearchTerm('');
    
            setEmailSearchTerm('');
    
            setCompanySearchTerm('');
    
            setSelectedSkillset('');
    
            setAppDateRangeFrom('');
    
            setAppDateRangeTo('');
    
        } else {
    
            setEmailNameSearchTerm('');
    
            setEmailAddressSearchTerm('');
    
            setEmailDateRangeFrom('');
    
            setEmailDateRangeTo('');
    
        }
    
    };
     

    // Application filtering with multiple filters
    const filteredApplications = trainingApplications.filter(application => {
        if (!application) return false;

        const nameMatch = application.name ?
            application.name.toLowerCase().includes(nameSearchTerm.toLowerCase()) :
            nameSearchTerm === '';

        const emailMatch = application.email ?
            application.email.toLowerCase().includes(emailSearchTerm.toLowerCase()) :
            emailSearchTerm === '';

        const companyMatch = application.company_name ?
            application.company_name.toLowerCase().includes(companySearchTerm.toLowerCase()) :
            companySearchTerm === '';

        const skillsetMatch = selectedSkillset === '' ||
            (application.skillsetRequirements &&
                application.skillsetRequirements.some(skill =>
                    skill.skillset && skill.skillset.toLowerCase() === selectedSkillset.toLowerCase()
                ));
//  Add date filtering for applications     
 let dateMatch = true;    
  if (appDateRangeFrom || appDateRangeTo) {      
       // Use createdAt or another appropriate date field from your application   
             const appDate = new Date(application.createdAt); 
             // Change to your actual date field      
                if (appDateRangeFrom) {      
                           const fromDate = new Date(appDateRangeFrom);     
                                   dateMatch = dateMatch && appDate >= fromDate;  
                                       }         if (appDateRangeTo) {      
                                               const toDate = new Date(appDateRangeTo);    
                                                        // Set time to end of day for the "to" date      
                                                               toDate.setHours(23, 59, 59, 999);    
                                                                 dateMatch = dateMatch && appDate <= toDate;
                                                                 }     }
 
        return nameMatch && emailMatch && companyMatch && skillsetMatch && dateMatch;
    });

    // Email filtering with multiple filters
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
    const getRecipientNamesForDisplay = () => {
        if (tabValue === 0) {
            // For applications tab
            const selectedNames = trainingApplications
                .filter(app => selectedApplications.includes(app._id))
                .map(app => app.name || 'Unnamed');
    
            // Display first 3 names and then show "+X more" if there are more
            if (selectedNames.length <= 3) {
                return selectedNames.join(', ');
            } else {
                return `${selectedNames.slice(0, 3).join(', ')} + ${selectedNames.length - 3} more`;
            }
        } else {
            // For email history tab
            const selectedNames = hasSentEmails 
                ? sentEmails.filter(email => selectedEmails.includes(email._id)).map(email => email.name)
                : []; // Ensure there's a fallback if hasSentEmails is false
    
            // Display first 3 names and then show "+X more" if there are more
            if (selectedNames.length <= 3) {
                return selectedNames.join(', ');
            } else {
                return `${selectedNames.slice(0, 3).join(', ')} + ${selectedNames.length - 3} more`;
            }
        }
    };
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
      };
    

      const getAllSentEmails = () => {
        const sentEmails = [];
        
        trainingApplications.forEach(hiring => {
          if (hiring.responseEmails && hiring.responseEmails.length > 0) {
            hiring.responseEmails.forEach(email => {
              sentEmails.push({
                applicationIds: hiring._id,
     contactName: hiring.name,
                contactEmail: hiring.email,
                ...email
              });
            });
          }
        });
        
        return sentEmails.sort((a, b) => new Date(b.sentOn) - new Date(a.sentOn));
      };
    
      const sentEmails = getAllSentEmails();
      const hasSentEmails = Array.isArray(sentEmails) && sentEmails.length > 0;
      const filteredEmailHistory = hasSentEmails ? sentEmails.filter(email => {
        if (!email) return false;
    
        const nameMatch = email.name ?
            email.name.toLowerCase().includes(emailNameSearchTerm.toLowerCase()) :
            emailNameSearchTerm === '';
    
        const emailAddressMatch = email.to ?
            email.to.toLowerCase().includes(emailAddressSearchTerm.toLowerCase()) :
            emailAddressSearchTerm === '';
            let dateMatch = true;
            if (emailDateRangeFrom || emailDateRangeTo) {
                const emailDate = new Date(email.sentOn);
     
                if (emailDateRangeFrom) {
                    const fromDate = new Date(emailDateRangeFrom);
                    dateMatch = dateMatch && emailDate >= fromDate;
                }
     
                if (emailDateRangeTo) {
                    const toDate = new Date(emailDateRangeTo);
                    // Set time to end of day for the "to" date
                    toDate.setHours(23, 59, 59, 999);
                    dateMatch = dateMatch && emailDate <= toDate;
                }
            }
     
    
        return nameMatch && emailAddressMatch&&dateMatch;
    }) : [];
    
    
    const formatDateToTamilNaduTime = (utcDateTime) => {
        const date = new Date(utcDateTime);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Kolkata'
        };
    
        // Convert to local time string
        const localDateTime = date.toLocaleString('en-IN', options);
    
        // Format the date to YYYY-MM-DD HH:mm:ss
        const [datePart, timePart] = localDateTime.split(', ');
        const formattedDate = datePart.split('/').reverse().join('-'); // Convert DD/MM/YYYY to YYYY-MM-DD
        return `${formattedDate} ${timePart}`;
    };
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
                                   <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleBack}
                                    sx={{ mb: 2 }} // Add some margin at the bottom
                                  >
                                    Back
                                  </Button>
                        
                        <Typography variant="h4"
                            sx={{
                                position: "relative",
                                padding: 0,
                                margin: 0,
                                fontWeight: 700, textAlign: 'center',
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
                            Training Applications Records
                        </Typography>

                        {/* Tabs and Controls Section */}
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Grid item xs={10} md={6} >
                                <Box>
                                    <Tabs
                                        value={tabValue}
                                        onChange={handleTabChange}
                                        indicatorColor="primary"
                                        textColor="primary"
                                    >
                                        <Tab label="Registered Users" />
                                        <Tab label="Response Mail Send to Users" />
                                    </Tabs>
                                </Box>
                            </Grid>
                            <Grid item xs={14} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }} >
                                {tabValue === 0 ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<FilterListIcon />}  // You'll need to import FilterListIcon
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
                                            Export {selectedApplications.length > 0 ? `(${selectedApplications.length})` : ''}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EmailIcon />}
                                            onClick={handleSendEmailClick}
                                            disabled={selectedApplications.length === 0}
                                        >
                                            Send Email {selectedApplications.length > 0 ? `(${selectedApplications.length})` : ''}
                                        </Button>
                                        
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<FilterListIcon />}  // You'll need to import FilterListIcon
                                            onClick={toggleFilters}
                                            sx={{ mr: 1 }}
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
                                {tabValue === 0 ? (
                                    // Application Filters
                                    < >
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
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    label="Search by Company"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SearchIcon color="action" fontSize="small" />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    onChange={(e) => setCompanySearchTerm(e.target.value)}
                                                    value={companySearchTerm}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel id="skillset-filter-label">Skillset</InputLabel>
                                                    <Select
                                                        labelId="skillset-filter-label"
                                                        value={selectedSkillset}
                                                        onChange={(e) => setSelectedSkillset(e.target.value)}
                                                        input={<OutlinedInput label="Skillset" />}
                                                    >
                                                        <MenuItem value="">
                                                            <em>All Skillsets</em>
                                                        </MenuItem>
                                                        {uniqueSkillsets.map((skillset, index) => (
                                                            <MenuItem key={index} value={skillset}>
                                                                {skillset}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
<Typography variant="body2" sx={{ mb: 1 }}>Date Range</Typography>
<Grid container spacing={1}>
<Grid item xs={6}>
<TextField

                fullWidth

                variant="outlined"

                size="small"

                label="From"

                type="date"

                InputLabelProps={{ shrink: true }}

                onChange={(e) => setAppDateRangeFrom(e.target.value)}

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
                                    </>
                                ) : (
                                    // Email Filters
                                    <>
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
                                            <Grid item xs={12} sm={6} md={4}>
<Typography variant="body2" sx={{ mb: 1 }}>Date Range</Typography>
<Grid container spacing={1}>
<Grid item xs={6}>
<TextField

                fullWidth

                variant="outlined"

                size="small"

                label="From"

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

                label="To"

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

                                                {selectedEmails.length > 0 && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', ml: 2 }}>
                                                        {selectedEmails.length} email(s) selected
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </>
                        )}


                    </Box>

                    {/* Registered Users Tab Content */}
                    {tabValue === 0 && (
                        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                                            <TableCell padding="checkbox" sx={{ color: 'white' }}>
                                                <Checkbox
                                                    indeterminate={selectedApplications.length > 0 && selectedApplications.length < filteredApplications.length}
                                                    checked={selectAll}
                                                    onChange={handleSelectAllChange}
                                                    sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Company Name</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Mobile</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Skillset Requirements</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Resources</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Enquiry</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Created At</TableCell>

                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredApplications.length > 0 ? filteredApplications
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((application) => (
                                                <TableRow
                                                    key={application._id}
                                                    hover
                                                    selected={selectedApplications.includes(application._id)}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedApplications.includes(application._id)}
                                                            onChange={() => handleCheckboxChange(application._id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={500}>
                                                            {application.name || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={500}>
                                                            {application.company_name || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={500}>
                                                            {application.mobile || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={500}>
                                                            {application.email || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={500}>
                                                            {application.skillsetRequirements.map(skill => skill.skillset).join(', ') || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={500}>
                                                            {application.skillsetRequirements.map(skill => skill.resources).join(', ') || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={500}>
                                                            {application.enquiry || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight={500}>
                                                            {application.createdAt || 'N/A'}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Tooltip title="Delete">
                                                                <IconButton
                                                                    onClick={() => handleDeleteClick(application._id)}
                                                                    color="error"
                                                                    size={isMobile ? 'small' : 'medium'}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                            <TableRow>
                                                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                                    <Typography variant="h6" color="text.secondary">
                                                        No applications found
                                                    </Typography>
                                                    {(nameSearchTerm || emailSearchTerm || companySearchTerm || selectedSkillset) && (
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
                    )}

                    {/* Response Mail Send to Users Tab Content */}
                    {tabValue === 1 && (
                        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                                            <TableCell padding="checkbox" sx={{ color: 'white' }}>
                                                <Checkbox
                                                    indeterminate={selectedEmails.length > 0 && selectedEmails.length < filteredEmailHistory.length}
                                                    checked={selectAllEmails}
                                                    onChange={handleSelectAllEmailsChange}
                                                    sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>From</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>To</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Subject</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Body</TableCell>
                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Sent On</TableCell>

                                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredEmailHistory.length > 0 ? filteredEmailHistory
                                            .slice(emailPage * emailRowsPerPage, emailPage * emailRowsPerPage + emailRowsPerPage)
                                            .map((email) => (
                                                <TableRow
                                                    key={email._id}
                                                    hover
                                                    selected={selectedEmails.includes(email._id)}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedEmails.includes(email._id)}
                                                            onChange={() => handleEmailCheckboxChange(email._id)}
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
                                                                : 'N/A'}    </Typography>
</TableCell>                                                    <TableCell>
                                                        <Chip
                                                            label={email.status}
                                                            color={email.status === 'Success' ? 'success' : 'error'}
                                                            size="small"
                                                            sx={{ fontWeight: 500 }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
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
                                minWidth: isMobile ? '90%' : 400
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            backgroundColor: theme.palette.error.light,
                            color: 'white',
                            fontWeight: 600
                        }}>
                            Confirm Deletion
                        </DialogTitle>
                        <DialogContent sx={{ py: 3 }}>
                            <Typography variant="body1">
                                Are you sure you want to delete this hiring application? This action cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button
                                onClick={handleDeleteCancel}
                                variant="outlined"
                                sx={{
                                    borderColor: theme.palette.grey[400],
                                    color: theme.palette.text.primary
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
                                    '&:hover': {
                                        backgroundColor: theme.palette.error.dark
                                    }
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
                                minWidth: isMobile ? '90%' : 500
                            }
                        }}
                    >
                        <DialogTitle sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            fontWeight: 600
                        }}>
                            {tabValue === 0 ? 'Send Email' : 'Resend Email'}
                        </DialogTitle>
                        <DialogContent sx={{ py: 3 }}>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {tabValue === 0
                                    ? `You are about to send emails to ${selectedApplications.length} selected application(s).`
                                    : `You are about to resend emails to ${selectedEmails.length} selected recipient(s).`
                                }
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
                                Recipients: {getRecipientNamesForDisplay()}
                            </Typography>
                            <TextField
                                fullWidth
                                label="Subject"
                                variant="outlined"
                                margin="normal"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}              
                                defaultValue={tabValue === 0 ? "Your Application Status" : "Follow-up on Previous Email"}
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
              
                                defaultValue={tabValue === 0
                                    ? "Thank you for your application. We are reviewing your details and will get back to you soon."
                                    : "This is a follow-up to our previous email. Please let us know if you have any questions."}
                            />
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button
                                onClick={() => setEmailDialogOpen(false)}
                                variant="outlined"
                                sx={{
                                    borderColor: theme.palette.grey[400],
                                    color: theme.palette.text.primary
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSendEmailConfirm}
                                variant="contained"
                                color="primary"
                                startIcon={loadingEmail ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />}
                                disabled={loadingEmail || !emailSubject || !emailMessage} // Disable button while loading
                              >
                                {loadingEmail ? 'Sending...' : 'Send'}
                 
                            </Button>
                        </DialogActions>
                    </Dialog>
                              <Snackbar
                                open={snackbar.open}
                                autoHideDuration={6000}
                                onClose={handleCloseSnackbar}
                                anchorOrigin={{ vertical : 'bottom', horizontal: 'right' }}
                              >
                                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant='filled'>
                                  {snackbar.message}
                                </Alert>
                              </Snackbar>
                    
                </Box>
                
            }
            
        />
    );
};

export default TrainFromUsFormsControl;