import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';
import qz from 'qz-tray';

export default function PrinterSelector({ selectedPrinter, setSelectedPrinter }) {
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrinters() {
      try {
        if (!qz.websocket.isActive()) await qz.websocket.connect();
        const printerList = await qz.printers.find();
        setPrinters(printerList);
      } catch (err) {
        console.error('Failed to load printers:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPrinters();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 500,
        margin: '0 auto',
        padding: 2,
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: 2,
        mt: 4,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
        Select a Printer
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={80}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <FormControl fullWidth sx={{ backgroundColor: '#fff' }}>
          <InputLabel sx={{ color: '#1976d2' }}>Printer</InputLabel>
          <Select
            value={selectedPrinter}
            onChange={(e) => setSelectedPrinter(e.target.value)}
            label="Printer"
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
            }}
          >
            {printers.length > 0 ? (
              printers.map((printer) => (
                <MenuItem key={printer} value={printer}>
                  {printer}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No printers found</MenuItem>
            )}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
