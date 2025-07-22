import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, FormControlLabel, Switch,
  Button, Grid, Paper, useTheme
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:4000/settings/1';

export default function SettingsPage() {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    defaultRep: '',
    timeZone: 'UTC',
  });
  const [loading, setLoading] = useState(true);

  // Load existing settings on mount
  useEffect(() => {
    axios.get(API_URL)
      .then((res) => setSettings(res.data))
      .catch((err) => {
        toast.error('Failed to load settings');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings.defaultRep || !settings.timeZone) {
      toast.warning("All fields are required.");
      return;
    }

    try {
      await axios.put(API_URL, settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Save error:', error);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [field]: value });
  };

  return (
    <Box p={{ xs: 2, md: 4 }}>
      <Typography variant="h4" mb={3} fontWeight="bold" color="primary">
        Settings
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={handleChange('notifications')}
                  color="primary"
                />
              }
              label="Enable Notifications"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Default Sales Rep"
              fullWidth
              variant="outlined"
              value={settings.defaultRep}
              onChange={handleChange('defaultRep')}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Time Zone"
              fullWidth
              variant="outlined"
              value={settings.timeZone}
              onChange={handleChange('timeZone')}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 2,
              }}
            >
              Save Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
