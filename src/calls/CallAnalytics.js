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
    return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        📞 Call Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Calls Over Time</Typography>
              <Line
                data={{
                  labels: sortedDates,
                  datasets: [{
                    label: 'Daily Calls',
                    data: sortedDates.map(d => callsOverTime[d]),
                    borderColor: '#1976d2',
                    tension: 0.2
                  }]
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Calls Per Lead</Typography>
              <Bar
                data={{
                  labels: leadNames,
                  datasets: [{
                    label: 'Call Count',
                    data: callCounts,
                    backgroundColor: '#4caf50'
                  }]
                }}
                options={{ indexAxis: 'y' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Duration (mins) by Lead</Typography>
              <Bar
                data={{
                  labels: leadNames,
                  datasets: [{
                    label: 'Avg Duration',
                    data: avgDurations,
                    backgroundColor: '#ff9800'
                  }]
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Calls</Typography>
              <Typography variant="h3" align="center">{calls.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
