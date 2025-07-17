// src/followups/FollowUpPage.js
import React, { useState } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Grid
} from '@mui/material';
import { Add } from '@mui/icons-material';

export default function FollowUpPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', notes: '' });
  const [followUps, setFollowUps] = useState([]);

  const handleSave = () => {
    if (form.title && form.date) {
      setFollowUps([...followUps, form]);
      setForm({ title: '', date: '', notes: '' });
      setOpen(false);
    }
  };

  return (
    <Box p={3}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Follow Ups</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>New Follow-Up</Button>
      </Grid>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {followUps.map((f, i) => (
            <TableRow key={i}>
              <TableCell>{f.title}</TableCell>
              <TableCell>{f.date}</TableCell>
              <TableCell>{f.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Follow-Up</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <TextField
            label="Notes"
            multiline
            rows={3}
            fullWidth
            margin="dense"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
