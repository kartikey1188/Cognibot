import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

function QueryLimits() {
  const [studentId, setStudentId] = useState('');
  const [queryLimit, setQueryLimit] = useState('');
  const [timePeriod, setTimePeriod] = useState('day');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usageData, setUsageData] = useState([]); 

  // Dummy usage data (replace with your actual API endpoint)
  const dummyUsageData = [
    { id: 1, name: 'Alice Wonderland', email: 'alice@example.com', queries: 5, limit: 10, timePeriod: 'day' },
    { id: 2, name: 'Bob The Builder', email: 'bob@example.com', queries: 12, limit: 10, timePeriod: 'day' },
    { id: 3, name: 'Charlie Chaplin', email: 'charlie@example.com', queries: 3, limit: 5, timePeriod: 'week' },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // will add logic later
      } catch (error) {
        setError('');// no error for now
      }
    };

    const fetchUsageData = async () => {
      // will add actual logic later
      setUsageData(dummyUsageData); // Using dummy data for now
    };

    fetchStudents();
    fetchUsageData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!studentId || !queryLimit || !timePeriod) {
      setSuccessMessage('')
      setError('Please fill in all fields.');
      return;
    }

    try {

      setTimePeriod('day');
      
      setError('');
      setQueryLimit('');
      setSuccessMessage('Query limits updated successfully!');
      setStudentId('');
    }
    catch (error) {
      console.error('Error updating query limits:', error);
      setError('Failed to update query limits.');
      setSuccessMessage('');
    }
  };

  return (
    <section className="p-6">
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        QUERY LIMITS
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          {error && (
            <Typography color="error" className="mb-3">
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography color="success" className="mb-3">
              {successMessage}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="student-id-label">Select Student</InputLabel>
                  <Select
                    labelId="student-id-label"
                    id="student-id"
                    value={studentId}
                    label="Select Student"
                    onChange={(e) => setStudentId(e.target.value)}
                  >
                    {dummyUsageData.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Query Limit"
                  type="number"
                  value={queryLimit}
                  onChange={(e) => setQueryLimit(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="time-period-label">Time Period</InputLabel>
                  <Select
                    labelId="time-period-label"
                    id="time-period"
                    value={timePeriod}
                    label="Time Period"
                    onChange={(e) => setTimePeriod(e.target.value)}
                  >
                    <MenuItem value="hour">Hour</MenuItem>
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" color="primary" type="submit">
                    Update Limits
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
        Student Query Usage
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="student query usage">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Queries Used</TableCell>
              <TableCell>Limit</TableCell>
              <TableCell>Time Period</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usageData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.queries}</TableCell>
                <TableCell>{row.limit}</TableCell>
                <TableCell>{row.timePeriod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}

export default QueryLimits;