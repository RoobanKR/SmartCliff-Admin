// components/visitore/visitore.js
import axios from 'axios';
import { getAPIURL } from '../../../utils/utils';


// Track a page visit
export const trackPageVisit = async (pageData) => {
  try {
    const response = await axios.post(`${getAPIURL()}/visitors/track`, {
      userAgent: navigator.userAgent,
      page: pageData.page || window.location.pathname,
      referrer: document.referrer || null,
    });
    return response.data;
  } catch (error) {
    console.error('Error tracking page visit:', error);
    return { success: false };
  }
};

// Get visitor statistics
export const getVisitorStats = async () => {
  try {
    const response = await axios.get(`${getAPIURL()}/visitors/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    throw error;
  }
};

// Get visitor logs with pagination
export const getVisitorLogs = async (page = 1, limit = 50) => {
  try {
    const response = await axios.get(`${getAPIURL()}/visitors/logs`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor logs:', error);
    throw error;
  }
};