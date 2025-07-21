import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Paper, MenuItem, FormControl, InputLabel, Select,
  CircularProgress, Snackbar, Alert, Grid, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_CALLS = 'http://localhost:4000/calls';
const API_LEADS = 'http://localhost:4000/leads';

export default function CallLogForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ leadId: '', date: '', duration: '', notes: '' });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsRes = await axios.get(API_LEADS);
        setLeads(leadsRes.data);

        if (isEdit) {
          const callRes = await axios.get(`${API_CALLS}/${id}`);
          setForm({
            leadId: callRes.data.leadId.toString(),
            date: callRes.data.date,
            duration: callRes.data.duration,
            notes: callRes.data.notes
          });
        } else {
          const today = new Date().toISOString().split('T')[0];
          setForm(f => ({ ...f, date: today }));
        }
      } catch {
        showAlert('Failed to load form data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    if (!form.leadId || !form.date || !form.duration) {
      showAlert('All fields except notes are required.', 'error');
      setSubmitting(false);
      return;
    }

    const payload = {
      leadId: parseInt(form.leadId),
      date: form.date,
      duration: form.duration.trim(),
      notes: form.notes.trim()
    };

    try {
      if (isEdit) {
        await axios.put(`${API_CALLS}/${id}`, payload);
        showAlert('Call log updated');
      } else {
        await axios.post(API_CALLS, payload);
        showAlert('Call log created');
      }
      navigate('/calls');
    } catch {
      showAlert('Failed to save call log', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_CALLS}/${id}`);
      showAlert('Call log deleted');
      navigate('/calls');
    } catch {
      showAlert('Delete failed', 'error');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const showAlert = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(s => ({ ...s, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, maxWidth: 800, mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          {isEdit ? 'Edit' : 'Create'} Call Log
        </Typography>
        {isEdit && (
          <IconButton color="error" onClick={() => setConfirmOpen(true)} disabled={deleting}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
  <InputLabel id="lead-label" shrink>
    Select Lead
  </InputLabel>
  <Select
    labelId="lead-label"
    id="lead-leadId"
    name="leadId"
    value={form.leadId}
    label="Select Lead"
    onChange={handleChange}
    fullWidth
    sx={{ minWidth: 200 }}  
    notched
  >
    {leads.map(lead => (
      <MenuItem key={lead.id} value={lead.id.toString()}>
        {lead.name}
      </MenuItem>
    ))}
  </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Call Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 15 mins"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              name="notes"
              label="Call Notes (Optional)"
              value={form.notes}
              onChange={handleChange}
              placeholder="Describe what was discussed during the call..."
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              fullWidth
              sx={{ py: 1.2 }}
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Call Log' : 'Create Call Log'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete This Call Log?</DialogTitle>
        <DialogContent>Are you sure you want to permanently delete this record?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
