import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 1,
              mr: 2,
            }}
          >
            HTML Forms Generator
          </Typography>
          {isLoggedIn && (
            <Button component={Link} to="/my-forms" color="primary" sx={{ textTransform: 'none' }}>
              My Forms
            </Button>
          )}
        </Box>
        <Box>
          {!isLoggedIn && (
            <Button
              component={Link}
              to="/login"
              color="primary"
              variant="outlined"
              sx={{ textTransform: 'none', ml: 2 }}
            >
              Login/Register
            </Button>
          )}
          {isLoggedIn && (
            <Button
              onClick={handleLogout}
              color="primary"
              variant="contained"
              sx={{ textTransform: 'none', ml: 2 }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 