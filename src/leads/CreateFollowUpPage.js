import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Grid, Typography,
  MenuItem, Select, FormControl, InputLabel, FormHelperText,
  useTheme, useMediaQuery
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export default function CreateFollowUpPage() {
  const [form, setForm] = useState({
    title: '',
    date: '',
    notes: '',
    leadId: '',
    rep: ''
  });

  const [leads, setLeads] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const API = {
    followUps: 'http://localhost:4000/followUps',
    leads: 'http://localhost:4000/leads'
  };

  useEffect(() => {
    axios.get(API.leads)
      .then(res => setLeads(res.data))
      .catch(err => {
        console.error(err);
        enqueueSnackbar('Failed to load leads', { variant: 'error' });
      });
  }, [enqueueSnackbar]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.leadId) newErrors.leadId = 'Please select a lead';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      enqueueSnackbar('Please fix the errors before saving', { variant: 'warning' });
      return;
    }

    setSubmitting(true);
    axios.post(API.followUps, form)
      .then(() => {
        enqueueSnackbar('Follow-Up created successfully', { variant: 'success' });
        navigate('/leads/follow-up');
      })
      .catch(err => {
        console.error(err);
        enqueueSnackbar('Failed to create Follow-Up', { variant: 'error' });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Box
      px={{ xs: 2, sm: 3 }}
      py={{ xs: 3, sm: 4 }}
      maxWidth={{ xs: '100%', sm: 600 }}
      mx="auto"
      sx={{
        backgroundColor: '#f9fafb',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant={isXs ? "h5" : "h4"}
        mb={3}
        textAlign="center"
        color="primary.main"
        fontWeight="600"
      >
        Create New Follow-Up
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            fullWidth
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            error={Boolean(errors.title)}
            helperText={errors.title}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            error={Boolean(errors.date)}
            helperText={errors.date}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl
            fullWidth
            sx={{ minWidth: 250 }}
            error={Boolean(errors.leadId)}
            required
          >
            <InputLabel id="lead-select-label">Lead</InputLabel>
            <Select
              labelId="lead-select-label"
              label="Lead"
              value={form.leadId}
              onChange={e => {
                const selectedLead = leads.find(l => l.id === e.target.value);
                setForm({
                  ...form,
                  leadId: e.target.value,
                  rep: selectedLead?.rep || ''
                });
                setErrors(prev => ({ ...prev, leadId: undefined }));
              }}
            >
              {leads.map(lead => (
                <MenuItem key={lead.id} value={lead.id}>
                  {lead.name}
                </MenuItem>
              ))}
            </Select>
            {errors.leadId && <FormHelperText>{errors.leadId}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Rep"
            fullWidth
            value={form.rep}
            onChange={e => setForm({ ...form, rep: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </Grid>

        <Grid
          item
          xs={12}
          container
          spacing={2}
          direction={isXs ? 'column' : 'row'}
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSave}
              disabled={submitting}
              color="primary"
              size={isXs ? "medium" : "large"}
            >
              Save
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              onClick={() => navigate('/leads/follow-up')}
              color="secondary"
              size={isXs ? "medium" : "large"}
              disabled={submitting}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
