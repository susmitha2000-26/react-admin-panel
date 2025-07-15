import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const VALID_PIN = '123456'; // pin

const Login = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (pin === VALID_PIN) {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid PIN. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Admin Panel Login
        </Typography>

        <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
          Enter your 6-digit PIN to continue
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box mt={3}>
          <TextField
            fullWidth
            label="Enter PIN"
            variant="outlined"
            type="password"
            value={pin}
            inputProps={{ maxLength: 6 }}
            onChange={(e) => setPin(e.target.value)}
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
