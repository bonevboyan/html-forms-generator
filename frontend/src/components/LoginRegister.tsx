import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const LoginRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, register, error, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/');
    } catch (err) {
      // Error is handled by the auth hook
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '60px auto', p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" color="primary" fontWeight={700} mb={3}>
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2, mb: 1, py: 1.5, fontWeight: 600 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : (isLogin ? 'Login' : 'Register')}
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {isLogin ? (
            <>
              Don't have an account?
              <Button variant="text" color="primary" onClick={() => setIsLogin(false)} sx={{ ml: 1 }}>
                Register
              </Button>
            </>
          ) : (
            <>
              Already have an account?
              <Button variant="text" color="primary" onClick={() => setIsLogin(true)} sx={{ ml: 1 }}>
                Login
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginRegister; 