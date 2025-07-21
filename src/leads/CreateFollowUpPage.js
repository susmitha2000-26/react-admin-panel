import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Grid,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateFollowUpPage() {
  const [form, setForm] = useState({ title: '', date: '', notes: '', leadId: '', rep: '' });
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  const API = {
    followUps: 'http://localhost:4000/followUps',
    leads: 'http://localhost:4000/leads'
  };

  useEffect(() => {
    axios.get(API.leads).then(res => setLeads(res.data)).catch(console.error);
  }, []);

  const handleSave = () => {
    axios.post(API.followUps, form)
      .then(() => navigate('/leads/follow-up'))
      .catch(console.error);
  };

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Typography variant="h4" mb={3} textAlign="center">
        Create New Follow-Up
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            fullWidth
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
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
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ minWidth: 250 }}>
            <InputLabel id="lead-select-label">Lead</InputLabel>
            <Select
              labelId="lead-select-label"
              label="Lead"
              value={form.leadId}
              onChange={e => {
                const leadName = leads.find(l => l.id === e.target.value)?.name;
                setForm({ ...form, leadId: e.target.value, rep: leadName || '' });
              }}
            >
              {leads.map(l => (
                <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Rep"
            fullWidth
            value={form.rep}
            disabled
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

        {/* New Grid item row for buttons — separate from notes */}
        <Grid
          item
          xs={12}
          container
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="center"
          sx={{ mt: 3 }} // margin-top added here to push buttons below notes
        >
          <Grid item xs={12} sm={6}>
            <Button fullWidth variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button fullWidth onClick={() => navigate('/leads/follow-up')}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
