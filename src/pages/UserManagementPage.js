import React, { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, IconButton, Grid
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

const roles = ['Admin', 'Sales Rep', 'Manager'];

const initialUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', lastLogin: '2025-07-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Sales Rep', lastLogin: '2025-07-14' },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingUser(null);
    setOpen(false);
  };

  const handleSave = () => {
    if (editingUser.id) {
      setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
    } else {
      const newUser = { ...editingUser, id: Date.now(), lastLogin: 'Never' };
      setUsers([...users, newUser]);
    }
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>User Management</Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small" aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
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
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={editingUser?.email || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Select
                name="role"
                value={editingUser?.role || ''}
                onChange={handleChange}
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>Select Role</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
