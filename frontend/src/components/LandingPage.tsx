import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 600, margin: '60px auto', p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h3" color="primary" fontWeight={700} gutterBottom align="center">
          Welcome to HTML Forms Generator
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
          Instantly create, share, and manage forms with zero coding.
        </Typography>
        <Typography align="center" sx={{ mt: 2, mb: 4 }}>
          <ul style={{ textAlign: 'left', margin: '0 auto', maxWidth: 400 }}>
            <li>Build forms visually with a drag-and-drop editor</li>
            <li>Share forms with a simple link</li>
            <li>Collect and analyze response</li>
            <li>Fast and easy to use</li>
          </ul>
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
            Get Started
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LandingPage; 