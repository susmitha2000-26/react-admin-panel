import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  IconButton,
  Tooltip,
  CssBaseline,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Login = () => {
  const [mode, setMode] = useState('light'); // Local theme mode
  const theme = createTheme({ palette: { mode } });
  const isDarkMode = mode === 'dark';

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: isDarkMode ? 'background.default' : '#eef2f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          position: 'relative',
        }}
      >
        {/* Theme Toggle Button */}
        <Tooltip title="Toggle Light/Dark Mode">
          <IconButton
            onClick={toggleColorMode}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: isDarkMode ? 'grey.100' : 'grey.900',
            }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ width: '100%' }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={6}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                minHeight: { xs: 'auto', md: 500 },
              }}
            >
              {/* Left Side Image Section */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                  overflow: 'hidden',
                  minHeight: 500,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    zIndex: 2,
                    textAlign: 'center',
                    px: 3,
                  }}
                >
                  <Box
                    component="img"
                    src="/crm.jpg"
                    alt="CRM Illustration"
                    sx={{
                      maxWidth: '90%',
                      objectFit: 'contain',
                      borderRadius: 2,
                      mb: 3,
                    }}
                  />
                  <Typography
                    variant="h6"
                    color="white"
                    fontWeight="bold"
                    sx={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}
                  >
                    Smart CRM for Growing Businesses
                  </Typography>
                </Box>
              </Grid>

              {/* Right Side Login Form */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: { xs: 4, sm: 6 },
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                  CRM Login
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
                  Enter your username and password
                </Typography>

                <Box mt={3}>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
                  onClick={handleLogin}
                >
                  Login
                </Button>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 4 }}
                >
                  Visit our website:{' '}
                  <Link
                    href="https://crmwebsite.com"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                  >
                    crmwebsite.com
                  </Link>
                </Typography>
              </Grid>
            </Paper>
          </Container>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
