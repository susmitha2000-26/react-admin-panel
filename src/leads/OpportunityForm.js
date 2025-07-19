import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, MenuItem, FormControl,
  InputLabel, Select, Typography, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const STATUSES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];
const REPS = ['Alice', 'Bob', 'Carol'];
const API_LEADS = 'http://localhost:4000/leads';
const API_OPPS = 'http://localhost:4000/opportunities';

export default function OpportunityForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    leadId: '',
    value: '',
    rep: '',
    status: 'Prospecting',
    closeDate: new Date().toISOString().split('T')[0]
  });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    axios.get(API_LEADS)
      .then(res => setLeads(res.data))
      .catch(() => setError('Failed to load leads'));

    if (id) {
      setLoading(true);
      axios.get(`${API_OPPS}/${id}`)
        .then(res => setForm(res.data))
        .catch(() => setError('Failed to load opportunity'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? +e.target.value : e.target.value;
    setForm(f => ({ ...f, [field]: value }));
  };

  const showAlert = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.leadId || !form.value || !form.rep) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (id) {
        await axios.put(`${API_OPPS}/${id}`, form);
        showAlert('Opportunity updated successfully');
      } else {
        await axios.post(API_OPPS, form);
        showAlert('Opportunity created successfully');
      }
      navigate('/leads/opportunity');
    } catch {
      setError('Failed to save opportunity');
    } finally {
      setLoading(false);
    }
  };

  // Cancel button navigates back to opportunity list
  const handleCancel = () => {
    navigate('/leads/opportunity');
  };

  return (
    <Box maxWidth={600} mx="auto" p={2}>
      <Typography variant="h5" mb={2}>
        {id ? 'Edit Opportunity' : 'New Opportunity'}
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && (
        <form onSubmit={handleSubmit}>

          <TextField
            label="Name"
            value={form.name}
            onChange={handleChange('name')}
            fullWidth
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Lead</InputLabel>
            <Select value={form.leadId} onChange={handleChange('leadId')} label="Lead">
              <MenuItem value="">—</MenuItem>
              {leads.map(l => (
                <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Value ($)"
            type="number"
            value={form.value}
            onChange={handleChange('value')}
            fullWidth
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Assigned Rep</InputLabel>
            <Select value={form.rep} onChange={handleChange('rep')} label="Assigned Rep">
              <MenuItem value="">—</MenuItem>
              {REPS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} onChange={handleChange('status')} label="Status">
              {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField
            label="Close Date"
            type="date"
            value={form.closeDate}
            onChange={handleChange('closeDate')}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              type="button"  // <-- Important: prevent form submission on Cancel!
              variant="outlined"
              onClick={handleCancel}
              data-testid="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {id ? 'Update' : 'Create'}
            </Button>
          </Box>
        </form>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
