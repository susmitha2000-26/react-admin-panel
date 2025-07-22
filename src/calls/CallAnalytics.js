import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Card, CardContent, Grid, CircularProgress
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const API_CALLS = 'http://localhost:4000/calls';
const API_LEADS = 'http://localhost:4000/leads';

export default function CallAnalytics() {
  const [calls, setCalls] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [callsRes, leadsRes] = await Promise.all([
          axios.get(API_CALLS),
          axios.get(API_LEADS)
        ]);
        setCalls(callsRes.data);
        setLeads(leadsRes.data);
      } catch (err) {
        console.error('Failed loading analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const callsOverTime = {};
  calls.forEach(c => {
    const day = c.date;
    callsOverTime[day] = (callsOverTime[day] || 0) + 1;
  });
  const sortedDates = Object.keys(callsOverTime).sort();

  const leadStats = {};
  calls.forEach(c => {
    const lead = leads.find(l => l.id === c.leadId);
    const name = lead ? lead.name : 'Unknown';
    leadStats[name] = (leadStats[name] || 0) + 1;
  });

  const avgDurationByLead = {};
  calls.forEach(c => {
    const lead = leads.find(l => l.id === c.leadId);
    const name = lead ? lead.name : 'Unknown';
    const mins = parseInt(c.duration);
    if (!avgDurationByLead[name]) avgDurationByLead[name] = { total: 0, count: 0 };
    avgDurationByLead[name].total += mins;
    avgDurationByLead[name].count += 1;
  });

  const leadNames = Object.keys(leadStats);
  const avgDurations = leadNames.map(name =>
    Math.round(avgDurationByLead[name].total / avgDurationByLead[name].count)
  );
  const callCounts = leadNames.map(name => leadStats[name]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      p={{ xs: 2, sm: 3, md: 5 }}
      maxWidth="1200px"
      mx="auto"
      sx={{ backgroundColor: '#fafafa', minHeight: '100vh' }}
    >
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
        📞 Call Analytics
      </Typography>
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={4}
            sx={{ bgcolor: '#e3f2fd', borderRadius: 2, boxShadow: '0 6px 12px rgba(25, 118, 210, 0.15)' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} color="#1976d2">
                Calls Over Time
              </Typography>
              <Line
                data={{
                  labels: sortedDates,
                  datasets: [{
                    label: 'Daily Calls',
                    data: sortedDates.map(d => callsOverTime[d]),
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.2)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                  }]
                }}
                options={{
                  animation: { duration: 1200, easing: 'easeInOutQuad' },
                  responsive: true,
                  plugins: {
                    legend: { labels: { color: '#0d47a1', font: { weight: 'bold' } } },
                    tooltip: { enabled: true }
                  },
                  scales: {
                    x: {
                      ticks: { color: '#0d47a1' },
                      grid: { color: '#bbdefb' }
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { color: '#0d47a1' },
                      grid: { color: '#bbdefb' }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={4}
            sx={{ bgcolor: '#e8f5e9', borderRadius: 2, boxShadow: '0 6px 12px rgba(76, 175, 80, 0.15)' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} color="#388e3c">
                Calls Per Lead
              </Typography>
              <Bar
                data={{
                  labels: leadNames,
                  datasets: [{
                    label: 'Call Count',
                    data: callCounts,
                    backgroundColor: '#4caf50',
                    borderRadius: 4,
                  }]
                }}
                options={{
                  indexAxis: 'y',
                  animation: { duration: 1200, easing: 'easeInOutQuad' },
                  responsive: true,
                  plugins: {
                    legend: { labels: { color: '#2e7d32', font: { weight: 'bold' } } },
                    tooltip: { enabled: true }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: { color: '#2e7d32' },
                      grid: { color: '#c8e6c9' }
                    },
                    y: {
                      ticks: { color: '#2e7d32', font: { weight: 'bold' } },
                      grid: { display: false }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={4}
            sx={{ bgcolor: '#fff3e0', borderRadius: 2, boxShadow: '0 6px 12px rgba(255, 152, 0, 0.15)' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} color="#ef6c00">
                Average Duration (mins) by Lead
              </Typography>
              <Bar
                data={{
                  labels: leadNames,
                  datasets: [{
                    label: 'Avg Duration',
                    data: avgDurations,
                    backgroundColor: '#ff9800',
                    borderRadius: 4,
                  }]
                }}
                options={{
                  animation: { duration: 1200, easing: 'easeInOutQuad' },
                  responsive: true,
                  plugins: {
                    legend: { labels: { color: '#ef6c00', font: { weight: 'bold' } } },
                    tooltip: { enabled: true }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: { color: '#ef6c00' },
                      grid: { color: '#ffe0b2' }
                    },
                    y: {
                      ticks: { color: '#ef6c00', font: { weight: 'bold' } },
                      grid: { display: false }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={4}
            sx={{ bgcolor: '#e0f7fa', borderRadius: 2, boxShadow: '0 6px 12px rgba(0, 150, 136, 0.15)' }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600} color="#00796b" textAlign="center">
                Total Calls
              </Typography>
              <Typography variant="h2" align="center" fontWeight={700} color="#004d40" sx={{ userSelect: 'none' }}>
                {calls.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
