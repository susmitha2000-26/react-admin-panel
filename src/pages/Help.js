import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  Divider,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReactMarkdown from 'react-markdown';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const categorizedFaq = {
  'Leads & Contacts': [
    {
      q: 'How do I add a new lead?',
      a: 'Click **"New Lead"** on the *Leads* page and fill out the form.'
    },
    {
      q: 'How do I assign reps?',
      a: 'While creating or editing a lead or opportunity, choose a rep from the dropdown menu.'
    }
  ],
  'Integrations': [
    {
      q: 'Can I integrate social platforms?',
      a: 'Yes, go to *Social Integrations* to connect **Facebook**, **LinkedIn**, etc.'
    }
  ]
};

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const filterQuestions = (faqs) =>
    faqs.filter(
      (item) =>
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Box
      p={{ xs: 2, sm: 4 }}
      maxWidth="900px"
      mx="auto"
      sx={{
        bgcolor: theme.palette.mode === 'light' ? '#fafafa' : '#121212',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s ease'
      }}
    >
      <Typography
        variant={isSmUp ? 'h4' : 'h5'}
        gutterBottom
        fontWeight={700}
        color="primary.main"
        sx={{ letterSpacing: '0.05em', textTransform: 'uppercase', mb: 4 }}
      >
        Help & Support
      </Typography>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 4,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'light' ? '#fff' : '#1e1e1e',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              bgcolor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333'
            },
            '&.Mui-focused': {
              boxShadow: `0 0 8px ${theme.palette.primary.main}`
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Tooltip title="Search by keyword or question" arrow>
                <SearchIcon color="primary" />
              </Tooltip>
            </InputAdornment>
          )
        }}
      />

      {/* FAQ */}
      {Object.entries(categorizedFaq).map(([category, items], idx) => {
        const filtered = filterQuestions(items);
        if (filtered.length === 0) return null;

        return (
          <Box key={idx} mb={5}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: 'primary.main',
                fontWeight: 'bold',
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                pb: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {category}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {filtered.map((item, i) => (
              <Fade in key={i} timeout={400 + i * 100}>
                <Accordion
                  sx={{
                    mb: 1.5,
                    bgcolor: theme.palette.mode === 'light' ? '#fff' : '#1f1f1f',
                    borderRadius: 2,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      bgcolor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                      '& svg': { color: theme.palette.primary.contrastText }
                    }
                  }}
                  elevation={2}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                    sx={{ px: 3, py: 1.5 }}
                  >
                    <HelpOutlineIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Typography fontWeight={600} fontSize={{ xs: 14, sm: 16 }}>
                      {item.q}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ display: 'flex', px: 3, py: 2 }}>
                    <InfoOutlinedIcon
                      sx={{
                        mr: 1.5,
                        mt: 0.6,
                        color: 'text.secondary',
                        flexShrink: 0,
                        fontSize: { xs: 18, sm: 20 }
                      }}
                    />
                    <Typography
                      component="div"
                      variant="body2"
                      sx={{
                        lineHeight: 1.6,
                        fontSize: { xs: 13, sm: 15 },
                        color: theme.palette.text.primary
                      }}
                    >
                      <ReactMarkdown>{item.a}</ReactMarkdown>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Fade>
            ))}
          </Box>
        );
      })}

      {/* No Results */}
      {Object.values(categorizedFaq).every(
        (group) => filterQuestions(group).length === 0
      ) && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 6, fontStyle: 'italic', textAlign: 'center' }}
        >
          No matching FAQs found.
        </Typography>
      )}

      {/* Contact Support */}
      <Box mt={8} textAlign="center">
        <Tooltip title="Click to contact our support team" arrow>
          <Button
            component={RouterLink}
            to="/contact-support"
            variant="contained"
            color="primary"
            size={isSmUp ? 'large' : 'medium'}
            startIcon={<SupportAgentIcon />}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'capitalize',
              boxShadow: `0 6px 12px ${theme.palette.primary.main}88`,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: `0 8px 20px ${theme.palette.primary.dark}cc`,
                transform: 'translateY(-2px)'
              }
            }}
          >
            Contact Support
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
}
