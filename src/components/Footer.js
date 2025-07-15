import React from 'react';
import {
  Box,
  Typography,
  Container,
  IconButton,
  Link,
  Stack,
  Divider,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1e293b', 
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          
          <Typography variant="body2" textAlign="center">
            © {new Date().getFullYear()}{' '}
            <Link
              href="https://yourwebsite.com"
              target="_blank"
              rel="noopener"
              underline="hover"
              color="inherit"
              sx={{ fontWeight: 500 }}
            >
              Your Name
            </Link>
            . All rights reserved.
          </Typography>

          
          <Box>
            <IconButton
              href="https://github.com/yourusername"
              target="_blank"
              aria-label="GitHub"
              sx={{ color: 'white' }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              aria-label="LinkedIn"
              sx={{ color: 'white' }}
            >
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Stack>

        
        <Divider sx={{ mt: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 1, color: 'rgba(255,255,255,0.6)' }}
        >
          Built with ❤️ using React & Material UI
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
