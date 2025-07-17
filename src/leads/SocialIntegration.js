// src/social/SocialIntegrationPage.js
import React from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, Switch, FormControlLabel
} from '@mui/material';

const platforms = [
  { name: 'Facebook', connected: true },
  { name: 'LinkedIn', connected: false },
  { name: 'Twitter', connected: false },
  { name: 'Instagram', connected: true },
];

export default function SocialIntegrationPage() {
  const handleToggle = (name) => {
    // Here you'd trigger an API call to connect/disconnect
    console.log(`Toggle ${name}`);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Social Integrations</Typography>
      <Grid container spacing={2}>
        {platforms.map(({ name, connected }) => (
          <Grid item xs={12} sm={6} md={4} key={name}>
            <Card>
              <CardContent>
                <Typography variant="h6">{name}</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={connected}
                      onChange={() => handleToggle(name)}
                      color="primary"
                    />
                  }
                  label={connected ? 'Connected' : 'Disconnected'}
                />
                <Box mt={1}>
                  <Button variant="outlined" size="small">Manage</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
