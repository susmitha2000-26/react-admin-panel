import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography,
  CircularProgress, Snackbar, Alert, useMediaQuery, useTheme, Grow, Slide
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/leads';
const SOURCES = ['Website', 'Walk-in', 'Social', 'Referral'];
const STATUSES = ['New', 'Contacted', 'Converted', 'Junk'];
const REPS = ['Alice', 'Bob', 'Carol'];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9\s()+-]*$/;

export default function LeadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [form, setForm] = useState({
    name: '', email: '', phone: '', source: '', status: 'New', notes: '', rep: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    setFormVisible(false);
    if (id) fetchLead();
    // Show form with animation after data fetch or immediately if new
    const timer = setTimeout(() => setFormVisible(true), id ? 300 : 100);
    return () => clearTimeout(timer);
  }, [id]);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setForm(res.data);
    } catch {
      showAlert('Failed to load lead', 'error');
    }
    setLoading(false);
  };

  const showAlert = (msg, severity = 'success') => {
    setSnackbar({ open: true, message: msg, severity });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Invalid email format';
    if (form.phone && !phoneRegex.test(form.phone)) newErrors.phone = 'Invalid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showAlert('Please fix validation errors', 'error');
      return;
    }
    setLoading(true);
    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, form);
        showAlert('Lead updated successfully', 'success');
      } else {
        await axios.post(API_URL, form);
        showAlert('Lead created successfully', 'success');
      }
      setTimeout(() => navigate('/leads'), 1200);
    } catch {
      showAlert('Failed to save lead', 'error');
    }
    setLoading(false);
  };

  return (
    <>
      <Grow in={formVisible} timeout={600}>
        <Box
          p={isSmallScreen ? 2 : 3}
          maxWidth={600}
          mx="auto"
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            boxShadow: 3,
            mt: 2,
            transition: 'all 0.3s ease',
            '& .MuiTextField-root, & .MuiFormControl-root': {
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 8px ${theme.palette.primary.main}`,
            },
          }}
        >
          <Typography variant={isSmallScreen ? 'h6' : 'h5'} mb={3} fontWeight="bold" align="center">
            {id ? 'Edit Lead' : 'New Lead'}
          </Typography>

          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            error={!!errors.name}
            helperText={errors.name}
            autoComplete="name"
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            error={!!errors.email}
            helperText={errors.email}
            autoComplete="email"
          />
          <TextField
            label="Phone"
            fullWidth
            margin="dense"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            error={!!errors.phone}
            helperText={errors.phone}
            autoComplete="tel"
          />

          <FormControl fullWidth margin="dense" sx={{ minWidth: 150 }}>
            <InputLabel id="source-label">Source</InputLabel>
            <Select
              labelId="source-label"
              value={form.source}
              label="Source"
              onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
              MenuProps={{ PaperProps: { style: { minWidth: 150 } } }}
            >
              {SOURCES.map(source => (
                <MenuItem key={source} value={source}>{source}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              label="Status"
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            >
              {STATUSES.map(status => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" sx={{ minWidth: 150 }}>
            <InputLabel id="rep-label">Rep</InputLabel>
            <Select
              labelId="rep-label"
              value={form.rep}
              label="Rep"
              onChange={e => setForm(f => ({ ...f, rep: e.target.value }))}
              MenuProps={{ PaperProps: { style: { minWidth: 150 } } }}
            >
              <MenuItem value="">—</MenuItem>
              {REPS.map(rep => (
                <MenuItem key={rep} value={rep}>{rep}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Notes"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          />

          <Box
            mt={3}
            display="flex"
            justifyContent="center"
            flexWrap="wrap"
            gap={2}
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                minWidth: 120,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/leads')}
              sx={{
                minWidth: 120,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Grow>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
