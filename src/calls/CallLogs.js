import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert,
  TablePagination, IconButton, Menu, MenuItem, useMediaQuery, useTheme, Stack
} from '@mui/material';
import { Add, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_CALLS = 'http://localhost:4000/calls';
const API_LEADS = 'http://localhost:4000/leads';

export default function CallLogs() {
  const [calls, setCalls] = useState([]);
  const [leadsMap, setLeadsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [callsRes, leadsRes] = await Promise.all([
        axios.get(API_CALLS),
        axios.get(API_LEADS)
      ]);

      const leadsById = Object.fromEntries(leadsRes.data.map(l => [String(l.id), l.name]));
      const enrichedCalls = callsRes.data.map(call => ({
        ...call,
        leadName: leadsById[String(call.leadId)] || '—'
      }));

      setCalls(enrichedCalls);
      setLeadsMap(leadsById);
    } catch {
      showAlert('Failed to fetch call logs', 'error');
    }
    setLoading(false);
  };

  const showAlert = (msg, severity = 'success') => {
    setSnackbar({ open: true, message: msg, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleEdit = () => {
    navigate(`/calls/edit/${menuId}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    handleMenuClose();
    setLoading(true);
    try {
      await axios.delete(`${API_CALLS}/${menuId}`);
      showAlert('Call log deleted');
      fetchData();
    } catch {
      showAlert('Failed to delete', 'error');
    }
    setLoading(false);
  };

  const paginatedCalls = calls.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box p={isMobile ? 2 : 4} bgcolor="#f4f6f8" minHeight="100vh">
      {/* Header */}
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isMobile ? 'flex-start' : 'center'}
        spacing={2}
        mb={3}
      >
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>📞 Call Logs</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/calls/create')}
          >
            New Call Log
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/calls/analytics')}
          >
            View Analytics
          </Button>
        </Stack>
      </Stack>

      {/* Table */}
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#e8eaf6' }}>
              <TableRow>
                <TableCell><strong>Lead</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Duration</strong></TableCell>
                <TableCell><strong>Notes</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedCalls.length ? (
                paginatedCalls.map(log => (
                  <TableRow key={log.id} hover>
                    <TableCell>{log.leadName}</TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.duration}</TableCell>
                    <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{log.notes}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={e => handleMenuOpen(e, log.id)}>
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={menuId === log.id}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">No call logs found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Box mt={2} display="flex" justifyContent="space-between" flexWrap="wrap" alignItems="center" gap={1}>
        <Typography variant="body2">
          Showing {calls.length ? page * rowsPerPage + 1 : 0}–{Math.min((page + 1) * rowsPerPage, calls.length)} of {calls.length}
        </Typography>
        <TablePagination
          component="div"
          count={calls.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
