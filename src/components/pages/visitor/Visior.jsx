"use client";

import React, { useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';

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
  useTheme
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
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

  useEffect(() => {
    fetchStats();
    fetchLogs(1);
  }, []);

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
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.recentVisitors && stats.recentVisitors.map((visitor, index) => (
                <TableRow hover key={index}>
                  <TableCell>{visitor.ip}</TableCell>
                  <TableCell>{formatDistance(new Date(visitor.visitDate), new Date(), { addSuffix: true })}</TableCell>
                  <TableCell>{visitor.page}</TableCell>
                  <TableCell>{visitor.city && visitor.countryCode ? `${visitor.city}, ${visitor.countryCode}` : 'Unknown'}</TableCell>
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
      
      {/* All Visitor Logs with Pagination */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
          Visitor Logs
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
              {visitorLogs.map((log, index) => (
                <TableRow hover key={index}>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>{new Date(log.visitDate).toLocaleString()}</TableCell>
                  <TableCell>{log.page}</TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.userAgent}
                  </TableCell>
                </TableRow>
              ))}
              {!visitorLogs.length && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No visitor logs found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        {pagination.pages > 1 && (
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
    }/>
  );
};

export default MuiVisitorStats;