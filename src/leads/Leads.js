import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem, Select, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Chip,
  IconButton, Grid, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Add, Search, Send } from '@mui/icons-material';

// Constants
const SOURCES = ['Website', 'Walk-in', 'Social', 'Referral'];
const STATUSES = ['New', 'Contacted', 'Converted', 'Junk'];
const REPS = ['Alice', 'Bob', 'Carol'];

// Simulated backend
let MOCK_LEADS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', source: 'Website', status: 'New', notes: '', rep: 'Alice' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210', source: 'Social', status: 'Contacted', notes: '', rep: 'Bob' }
];

export default function LeadsPage() {
  const [leads, setLeads] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(0);
  const [rowsPer, setRowsPer] = useState(5);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', source: '', status: 'New', notes: '', rep: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchLeads();
  }, [page, rowsPer, search, filterSource]);

  function fetchLeads() {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...MOCK_LEADS];
      if (search) {
        filtered = filtered.filter(l =>
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          l.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (filterSource) {
        filtered = filtered.filter(l => l.source === filterSource);
      }
      const start = page * rowsPer;
      const paginated = filtered.slice(start, start + rowsPer);
      setLeads({ items: paginated, total: filtered.length });
      setLoading(false);
    }, 300);
  }

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

  function saveLead() {
    if (editing) {
      MOCK_LEADS = MOCK_LEADS.map(l => l.id === editing.id ? form : l);
      showAlert('Lead updated');
    } else {
      const newLead = { ...form, id: Date.now() };
      MOCK_LEADS.push(newLead);
      showAlert('Lead created');
    }
    setOpenForm(false);
    fetchLeads();
  }

  function deleteLead(id) {
    MOCK_LEADS = MOCK_LEADS.filter(l => l.id !== id);
    showAlert('Lead deleted');
    fetchLeads();
  }

  function convertLead(id) {
    MOCK_LEADS = MOCK_LEADS.map(l =>
      l.id === id ? { ...l, status: 'Converted' } : l
    );
    showAlert('Lead converted to opportunity!');
    fetchLeads();
  }

  function showAlert(msg, severity = 'success') {
    setSnackbar({ open: true, message: msg, severity });
  }

  return (
    <Box p={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            fullWidth
            InputProps={{ endAdornment: <Search /> }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Source</InputLabel>
            <Select
              value={filterSource}
              onChange={e => { setFilterSource(e.target.value); setPage(0); }}
            >
              <MenuItem value="">All</MenuItem>
              {SOURCES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={5} textAlign="right">
          <Button variant="contained" startIcon={<Add />} onClick={openNew}>
            New Lead
          </Button>
        </Grid>
      </Grid>

      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Name', 'Email', 'Phone', 'Source', 'Status', 'Rep', 'Actions'].map(h => (
                <TableCell key={h}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}><CircularProgress /></TableCell></TableRow>
            ) : leads.items.length > 0 ? (
              leads.items.map(lead => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.source}</TableCell>
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
                    <Button size="small" onClick={() => openEdit(lead)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => deleteLead(lead.id)}>Delete</Button>
                    {lead.status !== 'Converted' &&
                      <Button size="small" color="success" variant="outlined" onClick={() => convertLead(lead.id)}>
                        Convert to Opportunity
                      </Button>}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={7}>No leads found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={leads.total}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPer}
        onRowsPerPageChange={e => { setRowsPer(parseInt(e.target.value)); setPage(0); }}
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Lead' : 'New Lead'}</DialogTitle>
        <DialogContent>
          <TextField label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth margin="dense" />
          <TextField label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} fullWidth margin="dense" />
          <TextField label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} fullWidth margin="dense" />
          <FormControl fullWidth margin="dense">
            <InputLabel>Source</InputLabel>
            <Select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
              {SOURCES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Assign to</InputLabel>
            <Select value={form.rep} onChange={e => setForm(f => ({ ...f, rep: e.target.value }))}>
              <MenuItem value="">—</MenuItem>
              {REPS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} fullWidth multiline rows={3} margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveLead}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
