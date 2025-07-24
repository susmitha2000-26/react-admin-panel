import React from 'react';
import { Box, Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

export default function PrintActions({ selectedPrinter }) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
        padding: 2,
        mt: 4,
        backgroundColor: '#f0f4f8',
        borderRadius: 2,
        boxShadow: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" sx={{ color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <PrintIcon color="disabled" />
        Print feature not available
      </Typography>
    </Box>
  );
}
