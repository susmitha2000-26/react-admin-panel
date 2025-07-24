import React, { useState } from 'react';
import { Button, Snackbar, Alert, Box, Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { printLeads } from '../utils/qzUtils'; // adjust path as needed

export default function LeadPrintExport({ leads, printer }) {
  const [status, setStatus] = useState({ open: false, severity: '', message: '' });

  const handlePrint = async () => {
    if (!printer) {
      setStatus({ open: true, severity: 'warning', message: 'Please select a printer first.' });
      return;
    }

    try {
      setStatus({ open: true, severity: 'info', message: 'Connecting and printing...' });
      await printLeads(printer, leads);
      setStatus({ open: true, severity: 'success', message: 'Leads sent to printer successfully!' });
      console.log('Print successful');
    } catch (err) {
      setStatus({
        open: true,
        severity: 'error',
        message: 'Failed to print. Is QZ Tray running?',
      });
      console.error('Print failed:', err);
    }
  };

  const handleClose = () => setStatus((s) => ({ ...s, open: false }));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
        mt: 4,
        px: 2,
        py: 3,
        backgroundColor: '#f5f8fb',
        borderRadius: 2,
        boxShadow: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
        Export & Print Leads
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        fullWidth
        startIcon={<PrintIcon />}
        sx={{
          fontWeight: 'bold',
          fontSize: '1rem',
          paddingY: 1.5,
          borderRadius: 2,
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        }}
      >
        Print Leads
      </Button>

      <Snackbar
        open={status.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={status.severity} sx={{ width: '100%' }}>
          {status.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
