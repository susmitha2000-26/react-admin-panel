import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Grid, IconButton, MenuItem, Select,
  FormControl, InputLabel, TextField
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function FollowUpPage() {
  const [followUps, setFollowUps] = useState([]);
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState({ date: '', leadId: '' });
  const navigate = useNavigate();

  const API = {
    followUps: 'http://localhost:4000/followUps',
    leads: 'http://localhost:4000/leads'
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

  const handleDelete = (id) => {
    axios.delete(`${API.followUps}/${id}`)
      .then(() => setFollowUps(fu => fu.filter(x => x.id !== id)))
      .catch(console.error);
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/leads/follow-up/new')}
        >
          New Follow-Up
        </Button>
      </Grid>

      {/* Filters: stacked on xs, inline on sm+ */}
      <Grid
        container
        spacing={2}
        mb={2}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
      >
        <Grid item xs={12} sm="auto" sx={{ minWidth: 200 }}>
          <TextField
            type="date"
            label="Filter by Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={filter.date}
            onChange={e => setFilter({ ...filter, date: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm="auto" sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel>Filter by Lead</InputLabel>
            <Select
              label="Filter by Lead"
              value={filter.leadId}
              onChange={e => setFilter({ ...filter, leadId: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              {leads.map(l => (
                <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Table container with horizontal scroll on small devices */}
      <Box sx={{ overflowX: 'auto' }}>
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
                  <TableCell> {lead?.name ? lead.name.charAt(0).toUpperCase() : '-'}</TableCell>
                  <TableCell>{fu.rep}</TableCell>
                  <TableCell>{fu.notes}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/leads/follow-up/${fu.id}/edit`)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(fu.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
