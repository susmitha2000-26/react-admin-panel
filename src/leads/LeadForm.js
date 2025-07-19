import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography,
  CircularProgress, Snackbar, Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/leads';
const SOURCES = ['Website', 'Walk-in', 'Social', 'Referral'];
const STATUSES = ['New', 'Contacted', 'Converted', 'Junk'];
const REPS = ['Alice', 'Bob', 'Carol'];

export default function LeadForm() {
  const { id } = useParams(); // if editing
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', source: '', status: 'New', notes: '', rep: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setForm(res.data);
    } catch (error) {
      showAlert('Failed to load lead', 'error');
    }
    setLoading(false);
  };

  const showAlert = (msg, severity = 'success') => {
    setSnackbar({ open: true, message: msg, severity });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      showAlert('Name and Email are required', 'warning');
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, form);
        showAlert('Lead updated');
      } else {
        await axios.post(API_URL, form);
        showAlert('Lead created');
      }
      setTimeout(() => navigate('/leads'), 1000);
    } catch (err) {
      showAlert('Failed to save lead', 'error');
    }
    setLoading(false);
  };

  return (
    <Box p={3} maxWidth="600px" mx="auto">
      <Typography variant="h5" mb={2}>
        {id ? 'Edit Lead' : 'New Lead'}
      </Typography>

      <TextField
        label="Name"
        fullWidth
        margin="dense"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
      />
      <TextField
        label="Email"
        fullWidth
        margin="dense"
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
      />
      <TextField
        label="Phone"
        fullWidth
        margin="dense"
        value={form.phone}
        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
      />
      <FormControl fullWidth margin="dense">
        <InputLabel>Source</InputLabel>
        <Select
          value={form.source}
          label="Source"
          onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
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

      <FormControl fullWidth margin="dense">
        <InputLabel>Rep</InputLabel>
        <Select
          value={form.rep}
          label="Rep"
          onChange={e => setForm(f => ({ ...f, rep: e.target.value }))}
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

      <Box mt={2}>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
        <Button onClick={() => navigate('/leads')} sx={{ ml: 2 }}>Cancel</Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
