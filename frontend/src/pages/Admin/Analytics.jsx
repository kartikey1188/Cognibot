import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const Analytics = () => {
  const [timePeriod, setTimePeriod] = useState('week');
  const [analyticsData, setAnalyticsData] = useState({
    userActivity: [],
    userEngagement: [],
    aiUsage: [],
  });

  // Dummy data
  const dummyAnalyticsData = {
    userActivity: [
      { name: 'Day 1', signups: 5, logins: 15 },
      { name: 'Day 2', signups: 3, logins: 12 },
      { name: 'Day 3', signups: 7, logins: 18 },
      { name: 'Day 4', signups: 2, logins: 10 },
      { name: 'Day 5', signups: 6, logins: 16 },
      { name: 'Day 6', signups: 4, logins: 14 },
      { name: 'Day 7', signups: 8, logins: 20 },
    ],
    userEngagement: [
      { name: 'Active Users', value: 80 },
      { name: 'Inactive Users', value: 20 },
    ],
    aiUsage: [
      { name: 'Day 1', queries: 30 },
      { name: 'Day 2', queries: 45 },
      { name: 'Day 3', queries: 25 },
      { name: 'Day 4', queries: 50 },
      { name: 'Day 5', queries: 35 },
      { name: 'Day 6', queries: 40 },
      { name: 'Day 7', queries: 60 },
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      setAnalyticsData(dummyAnalyticsData);
    }, 500); 
  }, [timePeriod]);

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        User Analytics
      </Typography>

      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="time-period-label">Time Period</InputLabel>
        <Select
          labelId="time-period-label"
          id="time-period"
          value={timePeriod}
          label="Time Period"
          onChange={handleTimePeriodChange}
        >
          <MenuItem value="day">Day</MenuItem>
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="year">Year</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              User Activity
            </Typography>
            <BarChart width={600} height={300} data={analyticsData.userActivity}> {/* Added width and height */}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="signups" fill="#8884d8" />
              <Bar dataKey="logins" fill="#82ca9d" />
            </BarChart>
          </Paper>
        </Grid>

        {/* pie chart */}
        {/* <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              User Engagement
            </Typography>
           
          </Paper>
        </Grid> */}

        <Grid item xs={12} md={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              AI Usage
            </Typography>
            <BarChart width={600} height={300} data={analyticsData.aiUsage}> {/* Added width and height */}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="queries" fill="#FFBB28" />
            </BarChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;