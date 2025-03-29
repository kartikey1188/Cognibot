import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Paper, Grid, Divider, Chip, CircularProgress, Container } from '@mui/material';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import axiosClient from '../axiosClient';

const Search = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query?.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosClient.post('/topic_search', {
          quest: query
        });
        setResults(response.data.results || []);
      } catch (err) {
        setError('No results found');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleResultClick = (result) => {
    if (result.nature === 'lecture') {
      const lectureId = result["Lecture ID"]
      const courseId = result["Course ID"]
      navigate(`/course/${courseId}/lecture/${lectureId}`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <SearchIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          Search Results
        </Typography>
        {query && (
          <Chip 
            label={`"${query}"`}
            sx={{ ml: 2, fontSize: '1rem', py: 2 }}
            color="primary"
          />
        )}
      </Box>
  
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, bgcolor: '#ef9a9a', color: 'error.dark' }}>
          <Typography>{error}</Typography>
        </Paper>
      ) : results.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
          <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No results found for "{query}"
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {results.map((result, index) => (
            <Grid item xs={12} key={index}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 5,
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={() => handleResultClick(result)}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" color="primary.main">
                        <Link to={result["Lecture Link"]}>{result["Lecture Title"]}</Link>
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mt: 1 
                    }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        {result["Name Of Course"]}
                      </Typography>
                      <Chip 
                        label={`Week ${result["Week Number"]}`}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );}
export default Search