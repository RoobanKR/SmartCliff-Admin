"use client";

import React, { useEffect, useState } from 'react';
import { formatDistance, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

// Material UI imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Pagination,
  useTheme,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  Chip,
  Stack,
  Button,
  Divider
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import { getVisitorLogs, getVisitorStats } from './viisi';
import LeftNavigationBar from '../../navbars/LeftNavigationBar';

const MuiVisitorStats = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalCount: 0,
    uniqueCount: 0,
    todayCount: 0,
    weeklyCount: 0,
    recentVisitors: []
  });
  
  const [visitorLogs, setVisitorLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ipFilter, setIpFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeDateFilter, setActiveDateFilter] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchLogs(1);
  }, []);

  // Effect to apply filters
  useEffect(() => {
    if (visitorLogs.length) {
      let filtered = [...visitorLogs];
      
      // Apply IP filter
      if (activeFilters.length > 0) {
        filtered = filtered.filter(log => 
          activeFilters.some(filter => log.ip.includes(filter))
        );
      }
      
      // Apply date filter
      if (activeDateFilter && startDate && endDate) {
        filtered = filtered.filter(log => {
          const visitDate = parseISO(log.visitDate);
          return isWithinInterval(visitDate, { 
            start: startOfDay(startDate), 
            end: endOfDay(endDate) 
          });
        });
      }
      
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs([]);
    }
  }, [visitorLogs, activeFilters, activeDateFilter, startDate, endDate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getVisitorStats();
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load visitor statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (page) => {
    try {
      setLoading(true);
      const response = await getVisitorLogs(page, pagination.limit);
      setVisitorLogs(response.data.logs);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to load visitor logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    fetchLogs(newPage);
  };

  const handleIpFilterChange = (event) => {
    setIpFilter(event.target.value);
  };

  const addIpFilter = () => {
    if (ipFilter && !activeFilters.includes(ipFilter)) {
      setActiveFilters([...activeFilters, ipFilter]);
      setIpFilter('');
    }
  };

  const removeFilter = (filterToRemove) => {
    setActiveFilters(activeFilters.filter(filter => filter !== filterToRemove));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setIpFilter('');
    setStartDate(null);
    setEndDate(null);
    setActiveDateFilter(false);
  };
  
  const applyDateFilter = () => {
    if (startDate && endDate) {
      setActiveDateFilter(true);
    }
  };
  
  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setActiveDateFilter(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && ipFilter) {
      addIpFilter();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <LeftNavigationBar
      Content={
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 4 }}>
            Website Visitor Analytics
          </Typography>
          
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <PersonIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Visits
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.totalCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <GroupIcon sx={{ fontSize: 40, color: theme.palette.secondary.main, mb: 1 }} />
                  <Typography variant="subtitle1" color="text.secondary">
                    Unique Visitors
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.uniqueCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <TodayIcon sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                  <Typography variant="subtitle1" color="text.secondary">
                    Today's Visits
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.todayCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <DateRangeIcon sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
                  <Typography variant="subtitle1" color="text.secondary">
                    Last 7 Days
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {stats.weeklyCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Recent Visitors */}
          <Paper sx={{ width: '100%', mb: 4, overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
              Recent Visitors
            </Typography>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="recent visitors table">
                <TableHead>
                  <TableRow>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Visit Time</TableCell>
                    <TableCell>Page</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentVisitors && stats.recentVisitors.map((visitor, index) => (
                    <TableRow hover key={index}>
                      <TableCell>{visitor.ip}</TableCell>
                      <TableCell>{formatDistance(new Date(visitor.visitDate), new Date(), { addSuffix: true })}</TableCell>
                      <TableCell>{visitor.page}</TableCell>
                    </TableRow>
                  ))}
                  {!stats.recentVisitors?.length && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No recent visitors</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          {/* Filters Panel */}
          <Paper sx={{ width: '100%', p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Filter Visitor Logs
            </Typography>
            
            <Grid container spacing={2}>
              {/* IP Address Filter */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  <SearchIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'text-bottom' }} />
                  IP Address Filter
                </Typography>
                <FormControl fullWidth>
                  <TextField
                    label="Filter by IP Address"
                    variant="outlined"
                    value={ipFilter}
                    onChange={handleIpFilterChange}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="add filter"
                            onClick={addIpFilter}
                            edge="end"
                            disabled={!ipFilter}
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </Grid>
              
              {/* Date Range Filter */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  <CalendarMonthIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'text-bottom' }} />
                  Date Range Filter
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        slotProps={{
                          textField: { 
                            fullWidth: true,
                            size: "small", 
                            variant: "outlined", 
                            InputProps: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        minDate={startDate || undefined}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        slotProps={{
                          textField: { 
                            fullWidth: true,
                            size: "small", 
                            variant: "outlined",
                            InputProps: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                      <Button 
                        variant="outlined" 
                        onClick={applyDateFilter}
                        disabled={!startDate || !endDate}
                        sx={{ mr: 1 }}
                      >
                        Apply
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        onClick={clearDateFilter}
                        disabled={!activeDateFilter}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Grid>
            </Grid>
            
            {/* Active Filters */}
            {(activeFilters.length > 0 || activeDateFilter) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Active Filters:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {activeFilters.map((filter, index) => (
                    <Chip
                      key={`ip-${index}`}
                      label={`IP: ${filter}`}
                      onDelete={() => removeFilter(filter)}
                      color="primary"
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                  
                  {activeDateFilter && startDate && endDate && (
                    <Chip
                      key="date-filter"
                      label={`Date: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
                      onDelete={clearDateFilter}
                      color="info"
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  )}
                  
                  {(activeFilters.length > 0 || activeDateFilter) && (
                    <Chip
                      label="Clear All Filters"
                      onClick={clearAllFilters}
                      color="secondary"
                      sx={{ m: 0.5 }}
                    />
                  )}
                </Stack>
              </>
            )}
          </Paper>
          
          {/* All Visitor Logs with Pagination */}
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
              Visitor Logs {(activeFilters.length > 0 || activeDateFilter) && `(Filtered: ${filteredLogs.length} results)`}
            </Typography>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="visitor logs table">
                <TableHead>
                  <TableRow>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Visit Time</TableCell>
                    <TableCell>Page</TableCell>
                    <TableCell>User Agent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {((activeFilters.length > 0 || activeDateFilter) ? filteredLogs : visitorLogs).map((log, index) => (
                    <TableRow hover key={index}>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>{new Date(log.visitDate).toLocaleString()}</TableCell>
                      <TableCell>{log.page}</TableCell>
                      <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.userAgent}
                      </TableCell>
                    </TableRow>
                  ))}
                  {((activeFilters.length > 0 || activeDateFilter) ? filteredLogs : visitorLogs).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        {(activeFilters.length > 0 || activeDateFilter) ? 'No matches found for the current filters' : 'No visitor logs found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination - Only show when not filtering */}
            {activeFilters.length === 0 && !activeDateFilter && pagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Pagination 
                  count={pagination.pages} 
                  page={pagination.page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  showFirstButton 
                  showLastButton 
                />
              </Box>
            )}
          </Paper>
        </Box>
      }
    />
  );
};

export default MuiVisitorStats;