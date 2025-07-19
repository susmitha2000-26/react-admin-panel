import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, MenuItem, FormControl, InputLabel, Select,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Grid, CircularProgress, IconButton, Menu, Snackbar, Alert, Chip,
  useMediaQuery, useTheme
} from '@mui/material';
import { Add, Search, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SOURCES = ['Website', 'Walk-in', 'Social', 'Referral'];
const STATUSES = ['New', 'Contacted', 'Converted', 'Junk'];
const API_URL = 'http://localhost:4000/leads';

export default function LeadsPage() {
  const [leads, setLeads] = useState({ items: [], total: 0 });
  const [page, setPage] = useState(0);
  const [rowsPer, setRowsPer] = useState(10);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuLeadId, setMenuLeadId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchLeads();
  }, [page, rowsPer, search, filterSource]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      let filtered = res.data;

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(l =>
          l.name.toLowerCase().includes(s) ||
          l.email.toLowerCase().includes(s)
        );
      }
      if (filterSource) filtered = filtered.filter(l => l.source === filterSource);

      const total = filtered.length;
      const start = page * rowsPer;
      const paginated = filtered.slice(start, start + rowsPer);

      setLeads({ items: paginated, total });
    } catch {
      showAlert('Failed to fetch leads', 'error');
    }
    setLoading(false);
  };

  const handleMenuOpen = (e, id) => {
    setAnchorEl(e.currentTarget);
    setMenuLeadId(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuLeadId(null);
  };

  const deleteLead = async id => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      showAlert('Lead deleted');
      fetchLeads();
    } catch {
      showAlert('Delete failed', 'error');
    }
    handleMenuClose();
    setLoading(false);
  };

  const convertLead = async id => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      await axios.put(`${API_URL}/${id}`, { ...res.data, status: 'Converted' });
      showAlert('Lead converted');
      fetchLeads();
    } catch {
      showAlert('Conversion failed', 'error');
    }
    handleMenuClose();
    setLoading(false);
  };

  const showAlert = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box p={2}>
      {/* Header + Filters */}
      <Grid container spacing={2} alignItems="center" mb={2} justifyContent="space-between">
        <Grid item><h2>Leads</h2></Grid>

        <Grid item xs={12} sm={7} md={6}>
          <Grid container spacing={2} alignItems="center" wrap="wrap">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Search"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                fullWidth
                InputProps={{ endAdornment: <Search fontSize="small" /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ minWidth: 150 }}>
                <InputLabel id="source-label">Source</InputLabel>
                <Select
                  labelId="source-label"
                  value={filterSource}
                  onChange={e => { setFilterSource(e.target.value); setPage(0); }}
                  label="Source"
                >
                  <MenuItem value="">All</MenuItem>
                  {SOURCES.map(src => <MenuItem key={src} value={src}>{src}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/leads/create')}>
            New Lead
          </Button>
        </Grid>
      </Grid>

      {/* Responsive Table */}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: isMobile ? 700 : 650 }}>
          <TableHead>
            <TableRow>
              {['Name', 'Email', 'Phone', 'Source', 'Status', 'Rep', 'Actions'].map(h => (
                <TableCell key={h}
                  sx={h === 'Source'
                    ? { minWidth: 150, whiteSpace: 'normal', wordBreak: 'break-word' }
                    : {}}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} align="center"><CircularProgress /></TableCell></TableRow>
            ) : leads.items.length ? (
              leads.items.map(lead => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell sx={{ minWidth: 150, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {lead.source}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={lead.status}
                      color={{
                        New: 'primary',
                        Contacted: 'info',
                        Converted: 'success',
                        Junk: 'default'
                      }[lead.status]}
                    />
                  </TableCell>
                  <TableCell>{lead.rep}</TableCell>
                  <TableCell>
                    <IconButton onClick={e => handleMenuOpen(e, lead.id)}>
                      <MoreVert />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={menuLeadId === lead.id} onClose={handleMenuClose}>
                      <MenuItem onClick={() => { navigate(`/leads/edit/${lead.id}`); handleMenuClose(); }}>Edit</MenuItem>
                      <MenuItem onClick={() => deleteLead(lead.id)}>Delete</MenuItem>
                      {lead.status !== 'Converted' && (
                        <MenuItem onClick={() => convertLead(lead.id)}>Convert</MenuItem>
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

      {/* Pagination */}
      <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          Showing {leads.items.length ? page * rowsPer + 1 : 0}–{Math.min((page + 1) * rowsPer, leads.total)} of {leads.total}
        </Box>
        <TablePagination
          component="div"
          count={leads.total}
          page={page}
          rowsPerPage={rowsPer}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => { setRowsPer(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
