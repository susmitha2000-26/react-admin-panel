import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

const API_URL = 'http://localhost:4000/leads';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

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
    const dateStr = lead.createdAt;
    if (!dateStr) return acc;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return acc;

    const key = date.toISOString().slice(0, 10);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(leadsOverTime).sort();

  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        CRM Dashboard
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Total Leads */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: 3,
                  boxShadow: 3,
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography variant="h6">Total Leads</Typography>
                  <Typography variant="h3" fontWeight="bold">
                    {leads.length}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Leads by Source */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Leads by Source
                  </Typography>
                  <Pie
                    data={{
                      labels: Object.keys(leadsBySource),
                      datasets: [
                        {
                          label: '# of Leads',
                          data: Object.values(leadsBySource),
                          backgroundColor: [
                            theme.palette.primary.main,
                            theme.palette.secondary.main,
                            '#ff7043',
                            '#ab47bc',
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Leads by Status */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Leads by Status
                  </Typography>
                  <Bar
                    data={{
                      labels: Object.keys(leadsByStatus),
                      datasets: [
                        {
                          label: 'Leads',
                          data: Object.values(leadsByStatus),
                          backgroundColor: '#66bb6a',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Leads Over Time */}
          <Grid item xs={12}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Leads Over Time
                  </Typography>
                  <Line
                    data={{
                      labels: sortedDates,
                      datasets: [
                        {
                          label: 'Leads Added',
                          data: sortedDates.map((date) => leadsOverTime[date]),
                          borderColor: '#ffa726',
                          backgroundColor: 'rgba(255,167,38,0.2)',
                          tension: 0.3,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: 'bottom' } },
                      scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: '#e0e0e0' } },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
