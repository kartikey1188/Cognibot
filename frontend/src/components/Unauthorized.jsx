import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{mt : 16}}>
      <Paper 
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: '#fafafa'
        }}
      >
        <BlockIcon 
          sx={{ 
            fontSize: 64,
            color: 'error.main',
            mb: 2
          }} 
        />
        
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: 'error.main'
          }}
        >
          Access Denied
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          You don't have permission to access this page. Please contact your administrator if you think this is a mistake.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Unauthorized;