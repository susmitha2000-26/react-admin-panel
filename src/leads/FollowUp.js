// src/followups/FollowUpPage.js
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Grid, IconButton, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

export default function FollowUpPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', notes: '', leadId: '', rep: '' });
  const [followUps, setFollowUps] = useState([]);
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState({ date: '', leadId: '' });

  const API = {
    followUps: 'http://localhost:4000/followUps',
    leads:      'http://localhost:4000/leads'
  };

  useEffect(() => {
    axios.all([
      axios.get(API.followUps),
      axios.get(API.leads)
    ]).then(axios.spread((fuRes, leadsRes) => {
      setFollowUps(fuRes.data);
      setLeads(leadsRes.data);
    }));
  }, []);

  const resetForm = () => {
    setForm({ title: '', date: '', notes: '', leadId: '', rep: '' });
    setEditing(null);
  };

  const openNew = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (fu) => {
    setEditing(fu.id);
    setForm(fu);
    setOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${API.followUps}/${id}`)
      .then(() => setFollowUps(fu => fu.filter(x => x.id !== id)))
      .catch(console.error);
  };

  const handleSave = () => {
    const apiCall = editing 
      ? axios.put(`${API.followUps}/${editing}`, form)
      : axios.post(API.followUps, form);

    apiCall.then(res => {
      setFollowUps(prev => {
        if (editing) return prev.map(fu => fu.id === editing ? res.data : fu);
        return [...prev, res.data];
      });
      setOpen(false);
      resetForm();
    }).catch(console.error);
  };

  const filtered = followUps.filter(fu => {
    const matchDate = filter.date ? fu.date === filter.date : true;
    const matchLead = filter.leadId ? fu.leadId === filter.leadId : true;
    return matchDate && matchLead;
  });

  return (
    <Box p={3}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Follow Ups</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openNew}>New Follow-Up</Button>
      </Grid>

      <Grid container spacing={2} mb={2}>
        <Grid item>
          <TextField
            type="date" label="Filter by Date"
            InputLabelProps={{ shrink: true }}
            value={filter.date}
            onChange={e => setFilter({ ...filter, date: e.target.value })}
          />
        </Grid>
        <Grid item>
          <FormControl>
            <InputLabel>Filter by Lead</InputLabel>
            <Select
              label="Filter by Lead"
              value={filter.leadId}
              onChange={e => setFilter({ ...filter, leadId: e.target.value })}
              style={{ width: 200 }}
            >
              <MenuItem value="">All</MenuItem>
              {leads.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Lead</TableCell>
            <TableCell>Rep</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map(fu => {
            const lead = leads.find(l => l.id === fu.leadId);
            return (
              <TableRow key={fu.id}>
                <TableCell>{fu.title}</TableCell>
                <TableCell>{dayjs(fu.date).format('DD-MM-YYYY')}</TableCell>
                <TableCell>{lead?.name || '-'}</TableCell>
                <TableCell>{fu.rep}</TableCell>
                <TableCell>{fu.notes}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => openEdit(fu)}><Edit /></IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(fu.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Follow-Up' : 'New Follow-Up'}</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="dense" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
          <TextField label="Date" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }}
            value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Lead</InputLabel>
            <Select label="Lead" value={form.leadId}
              onChange={e => {
                const leadName = leads.find(l => l.id === e.target.value)?.name;
                setForm({ ...form, leadId: e.target.value, rep: leadName || '' });
              }}
            >
              {leads.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Rep" fullWidth margin="dense" value={form.rep} disabled />
          <TextField label="Notes" multiline rows={3} fullWidth margin="dense"
            value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editing ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
