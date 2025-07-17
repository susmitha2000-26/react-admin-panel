import React, { useState, useEffect } from 'react';

import axios from 'axios';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem, Select, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Chip,
  IconButton, Grid, CircularProgress, Snackbar, Alert,
  Menu, MenuItem as MuiMenuItem
} from '@mui/material';
import { Add, Search, MoreVert } from '@mui/icons-material';

// Constants
const SOURCES = ['Website', 'Walk-in', 'Social', 'Referral'];
const STATUSES = ['New', 'Contacted', 'Converted', 'Junk'];
const REPS = ['Alice', 'Bob', 'Carol'];

// API base URL
const API_URL = 'http://localhost:4000/leads';

export default function LeadsPage() {
  const [leads, setLeads] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(0);
  const [rowsPer, setRowsPer] = useState(10);  // <-- default to 10
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', source: '', status: 'New', notes: '', rep: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // For action menu on each row
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuLeadId, setMenuLeadId] = useState(null);

  // Fetch leads from mock API with pagination, search and filter
  useEffect(() => {
    fetchLeads();
  }, [page, rowsPer, search, filterSource]);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      let filtered = res.data;

      if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(l =>
          l.name.toLowerCase().includes(lowerSearch) ||
          l.email.toLowerCase().includes(lowerSearch)
        );
      }

      if (filterSource) {
        filtered = filtered.filter(l => l.source === filterSource);
      }

      const total = filtered.length;
      const start = page * rowsPer;
      const paginated = filtered.slice(start, start + rowsPer);

      setLeads({ items: paginated, total });
    } catch (error) {
      showAlert('Failed to fetch leads', 'error');
    }
    setLoading(false);
  }

  // Open menu for actions
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuLeadId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuLeadId(null);
  };

  function openNew() {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', source: '', status: 'New', notes: '', rep: '' });
    setOpenForm(true);
  }

  function openEdit(lead) {
    setEditing(lead);
    setForm({ ...lead });
    setOpenForm(true);
  }

  async function saveLead() {
    if (!form.name || !form.email) {
      showAlert('Name and Email are required', 'warning');
      return;
    }

    setLoading(true);
    try {
      if (editing) {
        await axios.put(`${API_URL}/${editing.id}`, form);
        showAlert('Lead updated');
      } else {
        await axios.post(API_URL, form);
        showAlert('Lead created');
      }
      setOpenForm(false);
      fetchLeads();
    } catch (error) {
      showAlert('Failed to save lead', 'error');
    }
    setLoading(false);
  }

  async function deleteLead(id) {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      showAlert('Lead deleted');
      fetchLeads();
    } catch (error) {
      showAlert('Failed to delete lead', 'error');
    }
    setLoading(false);
    handleMenuClose();
  }

  async function convertLead(id) {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      const updatedLead = { ...res.data, status: 'Converted' };
      await axios.put(`${API_URL}/${id}`, updatedLead);
      showAlert('Lead converted to opportunity!');
      fetchLeads();
    } catch (error) {
      showAlert('Failed to convert lead', 'error');
    }
    setLoading(false);
    handleMenuClose();
  }

  function showAlert(msg, severity = 'success') {
    setSnackbar({ open: true, message: msg, severity });
  }

  return (
    <Box p={2}>
      <Grid container spacing={2} alignItems="center" mb={1} justifyContent="space-between">
        <Grid item>
          <h2>Leads</h2>
        </Grid>

        <Grid item xs={12} sm={7} md={6}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={7}>
              <TextField
                label="Search"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                fullWidth
                InputProps={{ endAdornment: <Search /> }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  value={filterSource}
                  onChange={e => { setFilterSource(e.target.value); setPage(0); }}
                  label="Source"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {SOURCES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Button variant="contained" startIcon={<Add />} onClick={openNew}>
            New Lead
          </Button>
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {['Name', 'Email', 'Phone', 'Source', 'Status', 'Rep', 'Actions'].map(h => (
                <TableCell key={h} sx={h === 'Source' ? { minWidth: 120 } : {}}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} align="center"><CircularProgress /></TableCell></TableRow>
            ) : leads.items.length > 0 ? (
              leads.items.map(lead => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>{lead.source}</TableCell>
                  <TableCell>
                    <Chip label={lead.status} color={{
                      New: 'primary',
                      Contacted: 'info',
                      Converted: 'success',
                      Junk: 'default'
                    }[lead.status]} />
                  </TableCell>
                  <TableCell>{lead.rep}</TableCell>
                  <TableCell>
                    <IconButton onClick={e => handleMenuOpen(e, lead.id)}>
                      <MoreVert />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={menuLeadId === lead.id}
                      onClose={handleMenuClose}
                    >
                      <MuiMenuItem onClick={() => { openEdit(lead); handleMenuClose(); }}>Edit</MuiMenuItem>
                      <MuiMenuItem onClick={() => { deleteLead(lead.id); }}>Delete</MuiMenuItem>
                      {lead.status !== 'Converted' && (
                        <MuiMenuItem onClick={() => { convertLead(lead.id); }}>Convert to Opportunity</MuiMenuItem>
                      )}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={7} align="center">No leads found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={1} mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          Showing {(page * rowsPer) + 1}–{Math.min((page + 1) * rowsPer, leads.total)} of {leads.total} leads
        </Box>
        <TablePagination
          component="div"
          count={leads.total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPer}
          onRowsPerPageChange={e => { setRowsPer(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Lead' : 'New Lead'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            fullWidth margin="dense"
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            fullWidth margin="dense"
          />
          <TextField
            label="Phone"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            fullWidth margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Source</InputLabel>
            <Select
              value={form.source}
              onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
              label="Source"
            >
              {SOURCES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              label="Status"
            >
              {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Assign to</InputLabel>
            <Select
              value={form.rep}
              onChange={e => setForm(f => ({ ...f, rep: e.target.value }))}
              label="Assign to"
            >
              <MenuItem value="">—</MenuItem>
              {REPS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            label="Notes"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            fullWidth multiline rows={3} margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveLead} disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

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
