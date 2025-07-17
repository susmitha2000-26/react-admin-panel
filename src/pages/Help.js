// src/help/HelpPage.js
import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faq = [
  { q: 'How do I add a new lead?', a: 'Click "New Lead" on the Leads page and fill out the form.' },
  { q: 'Can I integrate social platforms?', a: 'Yes, go to the Social Integrations page to connect platforms.' },
  { q: 'How do I assign reps?', a: 'While creating/editing a lead or opportunity, choose a rep from the dropdown.' }
];

export default function HelpPage() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Help & Support</Typography>
      {faq.map((item, i) => (
        <Accordion key={i}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{item.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
