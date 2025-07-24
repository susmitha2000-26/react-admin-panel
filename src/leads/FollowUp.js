import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Grid, IconButton, MenuItem, Select,
  FormControl, InputLabel, TextField, useTheme, useMediaQuery
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

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Box
      p={{ xs: 2, sm: 3, md: 4 }}
      sx={{ 
        backgroundColor: theme.palette.grey[50], 
        minHeight: '100vh',
        fontFamily: "'Roboto', sans-serif"
      }}
    >
      {/* Header */}
      <Grid 
        container 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography 
          variant={isSmDown ? "h5" : "h4"} 
          fontWeight="bold"
          component="h1"
        >
          Follow Ups
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/leads/follow-up/new')}
          sx={{
            bgcolor: theme.palette.secondary.main,
            '&:hover': {
              bgcolor: theme.palette.secondary.dark,
            },
            fontWeight: '600',
            px: 3,
            py: 1.2
          }}
        >
          New Follow-Up
        </Button>
      </Grid>

      {/* Filters */}
      <Grid
        container
        spacing={2}
        mb={3}
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
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              boxShadow: theme.shadows[1],
            }}
          />
        </Grid>
        <Grid item xs={12} sm="auto" sx={{ minWidth: 200 }}>
          <FormControl fullWidth sx={{backgroundColor: 'white', borderRadius: 1, boxShadow: theme.shadows[1]}}>
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
      <Box 
        sx={{ 
          overflowX: 'auto', 
          boxShadow: theme.shadows[2], 
          borderRadius: 2,
          backgroundColor: 'white',
          p: 1,
          mb: 4,
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            [`& .MuiTableRow-root:nth-of-type(even)`]: {
              backgroundColor: theme.palette.action.hover,
            },
            [`& .MuiTableCell-head`]: {
              fontWeight: 'bold',
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
            }
          }}
          aria-label="follow ups table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Lead</TableCell>
              <TableCell>Rep</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(fu => {
              const lead = leads.find(l => l.id === fu.leadId);
              return (
                <TableRow key={fu.id} hover>
                  <TableCell>{fu.title}</TableCell>
                  <TableCell>{dayjs(fu.date).format('DD-MM-YYYY')}</TableCell>
                  <TableCell> {lead?.name ? lead.name.charAt(0).toUpperCase() : '-'}</TableCell>
                  <TableCell>{fu.rep}</TableCell>
                  <TableCell>{fu.notes}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      aria-label="edit follow-up"
                      onClick={() => navigate(`/leads/follow-up/${fu.id}/edit`)}
                      size={isSmDown ? "small" : "medium"}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      aria-label="delete follow-up" 
                      onClick={() => handleDelete(fu.id)}
                      size={isSmDown ? "small" : "medium"}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, fontStyle: 'italic', color: theme.palette.text.secondary }}>
                  No follow-ups found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
