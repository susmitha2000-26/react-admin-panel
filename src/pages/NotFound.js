
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Box p={4} textAlign="center">
      <Typography variant="h3" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" mb={3}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" component={Link} to="/dashboard">
        Go to Dashboard
      </Button>
    </Box>
  );
}
