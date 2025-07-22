import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function ContactSupport() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log('Submitted:', form);

    // Simulate success
    setSuccess(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <Box
      p={isSmallScreen ? 2 : 4}
      maxWidth="600px"
      mx="auto"
      sx={{
        bgcolor: theme.palette.mode === 'light' ? '#f9f9f9' : '#1e1e1e',
        borderRadius: 2,
        boxShadow: 3,
        mt: 4,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
        Contact Support
      </Typography>

      <Typography variant="body1" gutterBottom color="text.secondary">
        We're here to help. Fill out the form and our support team will reach out.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          multiline
          rows={4}
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
              boxShadow: 4
            }
          }}
        >
          Send Message
        </Button>
      </Box>

      {/* Success Toast */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSuccess(false)}>
          Message sent! We'll get back to you soon.
        </Alert>
      </Snackbar>

      {/* Error Toast */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={4000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
