
import React, { useState } from 'react';
import {
  Box, Typography, TextField, FormControlLabel,
  Switch, Button, Grid, Paper
} from '@mui/material';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    defaultRep: '',
    timeZone: 'UTC'
  });

  const handleSave = () => {
    console.log('Saved settings:', settings);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                />
              }
              label="Enable Notifications"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Default Sales Rep"
              fullWidth
              value={settings.defaultRep}
              onChange={(e) => setSettings({ ...settings, defaultRep: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Time Zone"
              fullWidth
              value={settings.timeZone}
              onChange={(e) => setSettings({ ...settings, timeZone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSave}>Save Settings</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
