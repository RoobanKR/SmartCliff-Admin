import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  TextField,
  TablePagination,
  useTheme,
  useMediaQuery,
  Tooltip,
  Avatar,
  Badge,
  Collapse
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  School as CourseIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@mui/icons-material";
import LeftNavigationBar from "../../navbars/LeftNavigationBar";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFAQById,
  fetchAllFAQs,
  selectFAQs,
  selectStatus,
} from "../../redux/slices/faq/faq";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 4,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  minWidth: 0,
  padding: theme.spacing(1, 2),
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const FaqCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.light,
  },
}));

const ExpandButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  textTransform: 'none',
  fontSize: '0.8rem',
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    textDecoration: 'underline',
  }
}));

const FaqControl = () => {
  const dispatch = useDispatch();
  const faqData = useSelector(selectFAQs);
  const status = useSelector(selectStatus);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedCategory, setSelectedCategory] = useState("common");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Track expanded FAQ items
  const [expandedFaqs, setExpandedFaqs] = useState({});

  useEffect(() => {
    dispatch(fetchAllFAQs());
  }, [dispatch]);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setPage(0);
  };

  const handleEdit = (id) => {
    navigate(`/FAQ-edit/${id}`);
  };

  const handleAddNew = () => {
    navigate('/FAQ-add');
  };

  const handleDelete = (faqId) => {
    setDeleteItemId(faqId);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmation = () => {
    if (deleteItemId) {
      dispatch(deleteFAQById(deleteItemId))
        .then(() => {
          dispatch(fetchAllFAQs());
        });
    }
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteItemId(null);
    setDeleteConfirmationOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Toggle expanded state for an FAQ item
  const toggleExpandFaq = (faqId) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
  };

  const filteredFAQs = Array.isArray(faqData?.FAQ)
    ? faqData.FAQ.filter(faqItem => {
      const matchesCategory = faqItem.category_name === selectedCategory;
      const matchesSearch = searchTerm === '' ||
        faqItem.faqItems.some(item =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (faqItem.course?.course_name && faqItem.course.course_name.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    })
    : [];

  const paginatedFAQs = filteredFAQs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ p: isMobile ? 2 : 3 }}>
          <Typography
            variant="h4"
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
            FAQ Management
          </Typography>

          <Paper elevation={0} sx={{
            p: 3,
            mb: -4,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search FAQs..."
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 1,
                  }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddNew}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark
                    },
                    whiteSpace: 'nowrap'
                  }}
                >
                  Add New FAQ
                </Button>
              </Grid>
            </Grid>

            <StyledTabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="FAQ categories"
              variant="fullWidth"
              sx={{ mt: 3 }}
            >
              <StyledTab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <HelpIcon sx={{ mr: 1 }} />
                    Common FAQs
                  </Box>
                }
                value="common"
              />
              <StyledTab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CategoryIcon sx={{ mr: 1 }} />
                    Non-Common FAQs
                  </Box>
                }
                value="non-common"
              />
            </StyledTabs>
          </Paper>

          {status === "loading" && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress size={60} />
            </Box>
          )}

          {status === "failed" && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error fetching FAQs. Please try again later.
            </Alert>
          )}

          {status === "idle" && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Showing {filteredFAQs.length} {selectedCategory === 'common' ? 'Common' : 'Non-Common'} FAQs
                </Typography>
                {filteredFAQs.length > 0 && (
                  <Chip
                    label={`Page ${page + 1} of ${Math.ceil(filteredFAQs.length / rowsPerPage)}`}
                    size="small"
                    color="default"
                  />
                )}
              </Box>

              {filteredFAQs.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No {selectedCategory === 'common' ? 'common' : 'non-common'} FAQs found matching your search.
                </Alert>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {paginatedFAQs.map((faqItem, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <FaqCard>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Chip
                                label={faqItem.category_name}
                                color={faqItem.category_name === 'common' ? 'primary' : 'secondary'}
                                size="small"
                                icon={faqItem.category_name === 'common' ? <HelpIcon fontSize="small" /> : <CategoryIcon fontSize="small" />}
                              />
                              {faqItem.course && (
                                <Tooltip title="Related Course">
                                  <Chip
                                    label={faqItem.course.course_name}
                                    color="default"
                                    size="small"
                                    icon={<CourseIcon fontSize="small" />}
                                  />
                                </Tooltip>
                              )}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Badge
                              badgeContent={faqItem.faqItems.length}
                              color="primary"
                              sx={{ mb: 2 }}
                            >
                              <Typography variant="subtitle2" color="text.secondary">
                                Questions
                              </Typography>
                            </Badge>

                            {/* Always display first 2 questions */}
                            {faqItem.faqItems.slice(0, 2).map((item, itemIndex) => (
                              <Box key={itemIndex} sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  Q: {item.question}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  A: {item.answer}
                                </Typography>
                              </Box>
                            ))}

                            {/* Expandable section for additional questions */}
                            {faqItem.faqItems.length > 2 && (
                              <>
                                <Collapse in={expandedFaqs[faqItem._id] || false}>
                                  {faqItem.faqItems.slice(2).map((item, itemIndex) => (
                                    <Box key={itemIndex} sx={{ mb: 2 }}>
                                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Q: {item.question}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        A: {item.answer}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Collapse>

                                <ExpandButton
                                  size="small"
                                  onClick={() => toggleExpandFaq(faqItem._id)}
                                  startIcon={expandedFaqs[faqItem._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                >
                                  {expandedFaqs[faqItem._id]
                                    ? "Show less"
                                    : `+ ${faqItem.faqItems.length - 2} more questions`}
                                </ExpandButton>
                              </>
                            )}
                          </CardContent>

                          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${theme.palette.divider}` }}>
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() => handleEdit(faqItem._id)}
                                color="primary"
                                aria-label="edit"
                                sx={{ mr: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() => handleDelete(faqItem._id)}
                                color="error"
                                aria-label="delete"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </FaqCard>
                      </Grid>
                    ))}
                  </Grid>

                  {filteredFAQs.length > rowsPerPage && (
                    <TablePagination
                      component="div"
                      count={filteredFAQs.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[6, 12, 24]}
                      sx={{ mt: 3, borderTop: `1px solid ${theme.palette.divider}` }}
                    />
                  )}
                </>
              )}
            </>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteConfirmationOpen}
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
                Are you sure you want to delete this FAQ? This action cannot be undone.
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
                onClick={handleDeleteConfirmation}
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
        </Box>
      }
    />
  );
};

export default FaqControl;