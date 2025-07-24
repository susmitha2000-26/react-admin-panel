import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, MenuItem, FormControl,
  InputLabel, Select, Typography, CircularProgress,
  Alert, Snackbar, useMediaQuery, useTheme, Fade
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    axios.get(API_LEADS)
      .then(res => setLeads(res.data))
      .catch(() => showAlert('Failed to load leads', 'error'));

    if (id) {
      setLoading(true);
      axios.get(`${API_OPPS}/${id}`)
        .then(res => setForm(res.data))
        .catch(() => showAlert('Failed to load opportunity', 'error'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? +e.target.value : e.target.value;
    setForm(f => ({ ...f, [field]: value }));
    setFieldErrors(e => ({ ...e, [field]: '' }));
  };

  const showAlert = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });

  const validate = () => {
    const errors = {};
    if (!form.name) errors.name = 'Name is required';
    if (!form.leadId) errors.leadId = 'Please select a lead';
    if (!form.value || form.value <= 0) errors.value = 'Value must be a positive number';
    if (!form.rep) errors.rep = 'Please assign a rep';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await axios.put(`${API_OPPS}/${id}`, form);
        showAlert('Opportunity updated successfully');
      } else {
        await axios.post(API_OPPS, form);
        showAlert('Opportunity created successfully');
      }
      setTimeout(() => navigate('/leads/opportunity'), 1000);
    } catch {
      showAlert('Failed to save opportunity', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/leads/opportunity');
  };

  return (
    <Fade in timeout={500}>
      <Box
        maxWidth={600}
        mx="auto"
        p={isMobile ? 2 : 4}
        boxShadow={3}
        borderRadius={2}
        bgcolor="background.paper"
      >
        <Typography variant="h5" mb={2} color="primary.main" fontWeight="bold">
          {id ? 'Edit Opportunity' : 'New Opportunity'}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Name"
              value={form.name}
              onChange={handleChange('name')}
              fullWidth
              margin="normal"
              required
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
            />

            <FormControl fullWidth margin="normal" required error={!!fieldErrors.leadId}>
              <InputLabel>Lead</InputLabel>
              <Select value={form.leadId} onChange={handleChange('leadId')} label="Lead">
                <MenuItem value="">—</MenuItem>
                {leads.map(l => (
                  <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
                ))}
              </Select>
              {fieldErrors.leadId && <Typography variant="caption" color="error">{fieldErrors.leadId}</Typography>}
            </FormControl>

            <TextField
              label="Value ($)"
              type="number"
              value={form.value}
              onChange={handleChange('value')}
              fullWidth
              margin="normal"
              required
              error={!!fieldErrors.value}
              helperText={fieldErrors.value}
            />

            <FormControl fullWidth margin="normal" required error={!!fieldErrors.rep}>
              <InputLabel>Assigned Rep</InputLabel>
              <Select value={form.rep} onChange={handleChange('rep')} label="Assigned Rep">
                <MenuItem value="">—</MenuItem>
                {REPS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
              {fieldErrors.rep && <Typography variant="caption" color="error">{fieldErrors.rep}</Typography>}
            </FormControl>

            <FormControl fullWidth margin="normal">
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

            <Box mt={3} display="flex" justifyContent="space-between" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancel}
                fullWidth={isMobile}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth={isMobile}
              >
                {loading ? <CircularProgress size={22} /> : id ? 'Update' : 'Create'}
              </Button>
            </Box>
          </form>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar(s => ({ ...s, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
}
