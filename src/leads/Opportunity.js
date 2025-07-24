import React, { useState, useEffect } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Snackbar, Alert, TablePagination, Chip, Grid, Typography,
  IconButton, Menu, MenuItem, useTheme
} from '@mui/material';
import { Add, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const STATUSES = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];

const API_LEADS = 'http://localhost:4000/leads';
const API_OPPS = 'http://localhost:4000/opportunities';

export default function OpportunitiesPage() {
  const theme = useTheme();
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
        <Typography variant="h5" fontWeight="bold">Opportunities</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/leads/opportunity/create')}>
          New Opportunity
        </Button>
      </Grid>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
  <TableRow
    sx={{
      bgcolor: 'primary.main', // ensures good contrast with white text
      position: 'sticky',
      top: 0,
      zIndex: 10,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}
    >
     {['Name', 'Lead', 'Value', 'Rep', 'Status', 'Close Date', 'Actions'].map(header => (
      <TableCell
        key={header}
        sx={{
          color: '#fff', // white text
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          px: 2,
          py: 1.5,
          borderBottom: '2px solid rgba(255,255,255,0.2)',
          fontSize: { xs: '0.85rem', sm: '1rem' },
          backgroundColor: 'primary.main',
        }}
         >
           {header}
         </TableCell>
           ))}
          </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )
              : oppsData.items.length
                ? oppsData.items.map(o => {
                  const opp = enrich(o);
                  return (
                    <TableRow key={opp.id} hover>
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
                : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      No opportunities found
                    </TableCell>
                  </TableRow>
                )
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Typography>
          Showing {oppsData.total === 0 ? 0 : page * rowsPer + 1}–{Math.min((page + 1) * rowsPer, oppsData.total)} of {oppsData.total}
        </Typography>
        <TablePagination
          component="div"
          count={oppsData.total}
          page={page}
          rowsPerPage={rowsPer}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => { setRowsPer(+e.target.value); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ minWidth: 240 }}
        />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
