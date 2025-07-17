// src/opportunities/OpportunitiesPage.js

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem, Select, InputLabel, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Snackbar, Alert, TablePagination, Chip, Grid, Typography,
  IconButton, Menu
} from '@mui/material';
import { Add, MoreVert } from '@mui/icons-material';
import axios from 'axios';

// Constants
const STATUSES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];
const REPS = ['Alice', 'Bob', 'Carol'];

const API_LEADS = 'http://localhost:4000/leads';
const API_OPPS = 'http://localhost:4000/opportunities';

export default function OpportunitiesPage() {
  const [oppsData, setOppsData] = useState({ items: [], total: 0 });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPer, setRowsPer] = useState(10);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', value: '', rep: '', status: 'Prospecting', closeDate: '', leadId: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // New state for menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [leadsRes, oppsRes] = await Promise.all([
          axios.get(API_LEADS),
          axios.get(API_OPPS)
        ]);
        setLeads(leadsRes.data);
        const total = oppsRes.data.length;
        const items = oppsRes.data.slice(page * rowsPer, (page + 1) * rowsPer);
        setOppsData({ total, items });
      } catch (err) {
        console.error(err);
        showAlert('Failed to load opportunities', 'error');
      }
      setLoading(false);
    }
    load();
  }, [page, rowsPer]);

  const showAlert = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });

  const openNew = () => {
    setEditing(null);
    setForm({
      name: '', value: '', rep: '', status: 'Prospecting',
      closeDate: new Date().toISOString().split('T')[0],
      leadId: ''
    });
    setOpenForm(true);
  };

  const openEdit = (opp) => {
    setEditing(opp);
    setForm({ ...opp });
    setOpenForm(true);
  };

  const saveOpp = async () => {
    const { name, value, rep, status, closeDate, leadId } = form;
    if (!name || !value || !rep || !leadId) {
      return showAlert('Please fill required fields', 'warning');
    }
    setLoading(true);
    try {
      if (editing) {
        await axios.put(`${API_OPPS}/${editing.id}`, form);
        showAlert('Opportunity updated');
      } else {
        await axios.post(API_OPPS, form);
        showAlert('Opportunity created');
      }
      setOpenForm(false);
      setPage(0);
    } catch (err) {
      showAlert('Failed to save', 'error');
    }
    setLoading(false);
  };

  const deleteOpp = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_OPPS}/${id}`);
      showAlert('Deleted opportunity');
      setPage(0);
    } catch {
      showAlert('Failed to delete', 'error');
    }
    setLoading(false);
  };

  const enrich = (opp) => {
    const lead = leads.find(l => l.id === opp.leadId) || {};
    return { ...opp, leadName: lead.name || '—' };
  };

  // Handlers for menu
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  return (
    <Box p={2}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Opportunities</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openNew}>New Opportunity</Button>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Lead</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Rep</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Close Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? <TableRow>
                  <TableCell colSpan={7} align="center"><CircularProgress /></TableCell>
                </TableRow>
              : oppsData.items.length
                ? oppsData.items.map(o => {
                    const opp = enrich(o);
                    return (
                      <TableRow key={opp.id}>
                        <TableCell>{opp.name}</TableCell>
                        <TableCell>{opp.leadName}</TableCell>
                        <TableCell>${opp.value}</TableCell>
                        <TableCell>{opp.rep}</TableCell>
                        <TableCell>
                          <Chip label={opp.status} color={{
                            Prospecting: 'primary',
                            Qualification: 'info',
                            Proposal: 'secondary',
                            Negotiation: 'warning',
                            Won: 'success',
                            Lost: 'error'
                          }[opp.status]} />
                        </TableCell>
                        <TableCell>{opp.closeDate}</TableCell>
                        <TableCell>
                          <IconButton
                            aria-controls={menuRowId === opp.id ? 'actions-menu' : undefined}
                            aria-haspopup="true"
                            onClick={(e) => handleMenuOpen(e, opp.id)}
                          >
                            <MoreVert />
                          </IconButton>

                          <Menu
                            id="actions-menu"
                            anchorEl={anchorEl}
                            open={menuRowId === opp.id}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          >
                            <MenuItem onClick={() => { openEdit(opp); handleMenuClose(); }}>Edit</MenuItem>
                            <MenuItem onClick={() => { deleteOpp(opp.id); handleMenuClose(); }} sx={{ color: 'error.main' }}>
                              Delete
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : <TableRow>
                    <TableCell colSpan={7} align="center">No opportunities found</TableCell>
                  </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={1} mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography>
          Showing {page * rowsPer + 1}–{Math.min((page + 1) * rowsPer, oppsData.total)} of {oppsData.total}
        </Typography>
        <TablePagination
          component="div"
          count={oppsData.total}
          page={page}
          rowsPerPage={rowsPer}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => { setRowsPer(+e.target.value); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Opportunity' : 'New Opportunity'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            fullWidth margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Lead</InputLabel>
            <Select
              value={form.leadId}
              onChange={e => setForm(f => ({ ...f, leadId: e.target.value }))}
              label="Lead"
            >
              <MenuItem value="">—</MenuItem>
              {leads.map(l =>
                <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField
            label="Value ($)"
            type="number"
            value={form.value}
            onChange={e => setForm(f => ({ ...f, value: +e.target.value }))}
            fullWidth margin="dense"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Assigned Rep</InputLabel>
            <Select
              value={form.rep}
              onChange={e => setForm(f => ({ ...f, rep: e.target.value }))}
              label="Assigned Rep"
            >
              <MenuItem value="">—</MenuItem>
              {REPS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
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
          <TextField
            label="Close Date"
            type="date"
            value={form.closeDate}
            onChange={e => setForm(f => ({ ...f, closeDate: e.target.value }))}
            fullWidth margin="dense"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveOpp} disabled={loading}>Save</Button>
        </DialogActions>
      </Dialog>

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
