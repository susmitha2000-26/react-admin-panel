import React, { useState, useEffect } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Snackbar, Alert, TablePagination, Chip, Grid, Typography,
  IconButton, Menu, MenuItem
} from '@mui/material';
import { Add, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const STATUSES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];

const API_LEADS = 'http://localhost:4000/leads';
const API_OPPS = 'http://localhost:4000/opportunities';

export default function OpportunitiesPage() {
  const [oppsData, setOppsData] = useState({ items: [], total: 0 });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPer, setRowsPer] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const navigate = useNavigate();

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
        showAlert('Failed to load opportunities', 'error');
      }
      setLoading(false);
    }
    load();
  }, [page, rowsPer]);

  const showAlert = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });

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
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/leads/opportunity/create')}>
          New Opportunity
        </Button>
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
              ? <TableRow><TableCell colSpan={7} align="center"><CircularProgress /></TableCell></TableRow>
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
                          <IconButton onClick={(e) => handleMenuOpen(e, opp.id)}>
                            <MoreVert />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={menuRowId === opp.id}
                            onClose={handleMenuClose}
                          >
                            <MenuItem onClick={() => { navigate(`/leads/opportunity/edit/${opp.id}`); handleMenuClose(); }}>
                              Edit
                            </MenuItem>
                            <MenuItem onClick={() => { deleteOpp(opp.id); handleMenuClose(); }} sx={{ color: 'error.main' }}>
                              Delete
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : <TableRow><TableCell colSpan={7} align="center">No opportunities found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
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
