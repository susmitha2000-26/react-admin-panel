import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const API_URL = 'http://localhost:4000/leads';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await axios.get(API_URL);
        setLeads(res.data);
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      }
      setLoading(false);
    }
    fetchLeads();
  }, []);

  const getCounts = (field) => {
    return leads.reduce((acc, lead) => {
      acc[lead[field]] = (acc[lead[field]] || 0) + 1;
      return acc;
    }, {});
  };

  const leadsByStatus = getCounts('status');
  const leadsBySource = getCounts('source');

  const leadsOverTime = leads.reduce((acc, lead) => {
    const date = new Date(lead.createdAt || lead.id).toISOString().slice(0, 10);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const sortedDates = Object.keys(leadsOverTime).sort();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>CRM Dashboard</Typography>

      {loading ? <CircularProgress /> : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Leads</Typography>
                <Typography variant="h4">{leads.length}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Leads by Source</Typography>
                <Pie data={{
                  labels: Object.keys(leadsBySource),
                  datasets: [{
                    label: '# of Leads',
                    data: Object.values(leadsBySource),
                    backgroundColor: ['#1976d2', '#0288d1', '#7b1fa2', '#c62828']
                  }]
                }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Leads by Status</Typography>
                <Bar data={{
                  labels: Object.keys(leadsByStatus),
                  datasets: [{
                    label: '# of Leads',
                    data: Object.values(leadsByStatus),
                    backgroundColor: '#4caf50'
                  }]
                }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Leads Over Time</Typography>
                <Line data={{
                  labels: sortedDates,
                  datasets: [{
                    label: 'Leads Added',
                    data: sortedDates.map(date => leadsOverTime[date]),
                    fill: false,
                    borderColor: '#ff9800'
                  }]
                }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
