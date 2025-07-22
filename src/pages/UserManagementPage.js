import React, { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, IconButton, Grid, Snackbar,
  Alert, useMediaQuery, useTheme, Stack, Card, CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const roles = ['Admin', 'Sales Rep', 'Manager'];

const initialUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', lastLogin: '2025-07-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Sales Rep', lastLogin: '2025-07-14' },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = (user = null) => {
    setEditingUser(user || { name: '', email: '', role: '' });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setEditingUser(null);
    setErrors({});
    setOpen(false);
  };

  const validateForm = () => {
    const errs = {};
    if (!editingUser?.name?.trim()) errs.name = 'Name is required';
    if (!editingUser?.email?.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(editingUser.email)) errs.email = 'Invalid email';
    if (!editingUser?.role) errs.role = 'Role is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingUser.id) {
      setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
      setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
    } else {
      const newUser = { ...editingUser, id: Date.now(), lastLogin: 'Never' };
      setUsers([...users, newUser]);
      setSnackbar({ open: true, message: 'User added successfully!', severity: 'success' });
    }
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    setSnackbar({ open: true, message: 'User deleted successfully!', severity: 'info' });
    setConfirmDeleteOpen(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setUserToDelete(null);
  };

  return (
    <Box p={isMobile ? 2 : 4} bgcolor="#f9f9f9" minHeight="100vh">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add User
        </Button>
      </Stack>

      {isMobile ? (
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} key={user.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">{user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  <Typography variant="body2" color="text.secondary">Role: {user.role}</Typography>
                  <Typography variant="body2" color="text.secondary">Last Login: {user.lastLogin}</Typography>

                  <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                    <IconButton
                      aria-label="Edit"
                      size="small"
                      color="primary"
                      onClick={() => handleOpen(user)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Login</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(user)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingUser?.id ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={editingUser?.name || ''}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={editingUser?.email || ''}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                name="role"
                value={editingUser?.role || ''}
                onChange={handleChange}
                error={!!errors.role}
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>Select Role</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
              {errors.role && (
                <Typography variant="caption" color="error">{errors.role}</Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
