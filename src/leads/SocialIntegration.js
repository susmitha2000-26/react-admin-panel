import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  LinkedIn,
  Twitter,
  Instagram,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';

// Platform data with icons
const platforms = [
  { name: 'Facebook', connected: true, icon: <Facebook color="primary" /> },
  { name: 'LinkedIn', connected: false, icon: <LinkedIn color="primary" /> },
  { name: 'Twitter', connected: false, icon: <Twitter color="primary" /> },
  { name: 'Instagram', connected: true, icon: <Instagram color="primary" /> },
];

export default function SocialIntegrationPage() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleToggle = (name, connected) => {
    // Fake toggle logic and feedback
    const message = connected
      ? `${name} disconnected successfully.`
      : `${name} connected successfully.`;
    enqueueSnackbar(message, { variant: connected ? 'warning' : 'success' });
  };

  return (
    <Box
      px={{ xs: 2, sm: 3 }}
      py={{ xs: 3, sm: 4 }}
      sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}
    >
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        color="primary"
        fontWeight={600}
      >
        Social Integrations
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {platforms.map(({ name, connected, icon }) => (
          <Grid item xs={12} sm={6} md={4} key={name}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  transition: '0.3s',
                  borderRadius: 3,
                  boxShadow: theme.shadows[1],
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    {icon}
                    <Typography
                      variant="h6"
                      ml={1.2}
                      color={connected ? 'primary' : 'text.secondary'}
                    >
                      {name}
                    </Typography>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={connected}
                        onChange={() => handleToggle(name, connected)}
                        color="success"
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        color={connected ? 'green' : 'error'}
                        fontWeight="bold"
                      >
                        {connected ? 'Connected' : 'Disconnected'}
                      </Typography>
                    }
                  />

                  <Box mt={2}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      color={connected ? 'primary' : 'inherit'}
                    >
                      Manage
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
