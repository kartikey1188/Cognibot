import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '@/axiosClient';
import { setRateLimit } from '@/redux/slice/uiSlice';

function QueryLimits() {
  const [queryLimit, setQueryLimit] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useDispatch();
  const currentLimit = useSelector(state => state.ui.rateLimit);

  useEffect(() => {
    if (currentLimit){
      setQueryLimit(currentLimit)
    }
    setLoading(false)
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!queryLimit) {
      setError('Please enter a query limit');
      setSuccessMessage('');
      return;
    }

    const limit = parseInt(queryLimit);
    if (isNaN(limit) || limit < 1) {
      setError('Please enter a valid number greater than 0');
      setSuccessMessage('');
      return;
    }

    try {
      await axiosClient.post('/admin/update_rate_limit', {
        rate_limit: limit
      });
      
      dispatch(setRateLimit(limit));
      setError('');
      setSuccessMessage('Rate limit updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating rate limit:', error);
      setError('Failed to update rate limit');
      setSuccessMessage('');
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 3 
        }}
      >
        Hourly Rate Limit Settings
      </Typography>

      <Card elevation={3}>
        <CardContent>
          {currentLimit && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 2,
                '& .MuiAlert-message': {
                  fontSize: '1.1rem'
                }
              }}
            >
              Current rate limit: {currentLimit} requests per hour
            </Alert>
          )}
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
          
          {successMessage && (
            <Alert 
              severity="success" 
              sx={{ mb: 2 }}
              onClose={() => setSuccessMessage('')}
            >
              {successMessage}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Queries Per Hour"
              type="number"
              value={queryLimit}
              onChange={(e) => {
                setQueryLimit(e.target.value);
                setError('');
              }}
              inputProps={{ 
                min: 1,
                step: 1
              }}
              required
              sx={{ mb: 3 }}
              error={!!error}
              helperText={error || 'Enter the number of queries allowed per hour'}
            />
            
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              fullWidth
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'medium'
              }}
            >
              Update Rate Limit
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default QueryLimits;