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
  Fade
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

  const filterQuestions = (faqs) =>
    faqs.filter(
      (item) =>
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Box p={4} maxWidth="900px" mx="auto">
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Help & Support
      </Typography>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Tooltip title="Search by keyword or question" arrow>
                <SearchIcon color="action" />
              </Tooltip>
            </InputAdornment>
          )
        }}
      />

      {/* FAQ  */}
      {Object.entries(categorizedFaq).map(([category, items], idx) => {
        const filtered = filterQuestions(items);
        if (filtered.length === 0) return null;

        return (
          <Box key={idx} mb={4}>
            <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
              {category}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {filtered.map((item, i) => (
              <Fade in key={i}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <HelpOutlineIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography fontWeight={500}>{item.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ display: 'flex' }}>
                    <InfoOutlinedIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                    <Typography component="div" variant="body2">
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
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          No matching FAQs found.
        </Typography>
      )}

      {/* Contact Support */}
      <Box mt={6} textAlign="center">
        <Tooltip title="Click to contact our support team" arrow>
          <Button
            component={RouterLink}
  to="/contact-support"
  variant="contained"
  color="primary"
  size="large"
  startIcon={<SupportAgentIcon />}
>
            Contact Support
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
}
