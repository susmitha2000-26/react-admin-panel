import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, TextField, MenuItem, Paper,
  CircularProgress, FormControl, InputLabel, Select
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import dayjs from 'dayjs';
import axios from 'axios';

const API_OPPS = 'http://localhost:4000/opportunities';
const REPS = ['All', 'Alice', 'Bob', 'Carol'];
const STATUSES = ['All', 'Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'];

export default function ReportsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repFilter, setRepFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day'));
  const [endDate, setEndDate] = useState(dayjs());

  useEffect(() => {
    loadData();
  }, [repFilter, statusFilter, startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_OPPS);
      const filtered = res.data.filter(o => {
        const matchRep = repFilter === 'All' || o.rep === repFilter;
        const matchStatus = statusFilter === 'All' || o.status === statusFilter;
        const date = dayjs(o.closeDate);
        const matchDate = date.isAfter(startDate.subtract(1, 'day')) && date.isBefore(endDate.add(1, 'day'));
        return matchRep && matchStatus && matchDate;
      });
      setData(filtered);
    } catch (err) {
      console.error('Failed to load report data', err);
    }
    setLoading(false);
  };

  const groupBy = (arr, key) =>
    arr.reduce((acc, item) => {
      const group = item[key] || 'Unknown';
      acc[group] = acc[group] || [];
      acc[group].push(item);
      return acc;
    }, {});

  const totalValue = data.reduce((sum, o) => sum + +o.value, 0);

  const valueByRep = groupBy(data, 'rep');
  const barChartData = {
    labels: Object.keys(valueByRep),
    datasets: [{
      label: 'Opportunity Value ($)',
      data: Object.values(valueByRep).map(v => v.reduce((sum, o) => sum + +o.value, 0)),
      backgroundColor: '#42a5f5'
    }]
  };

  const valueByStatus = groupBy(data, 'status');
  const pieChartData = {
    labels: Object.keys(valueByStatus),
    datasets: [{
      label: 'Deals by Status',
      data: Object.values(valueByStatus).map(v => v.length),
      backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#ec407a', '#ab47bc', '#ff7043']
    }]
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={2}>
        <Typography variant="h4" mb={2}>CRM Reports</Typography>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Rep</InputLabel>
              <Select value={repFilter} onChange={e => setRepFilter(e.target.value)} label="Rep">
                {REPS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} label="Status">
                {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Box textAlign="center"><CircularProgress /></Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Opportunity Value by Rep</Typography>
                <Bar data={barChartData} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Deals by Status</Typography>
                <Pie data={pieChartData} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Summary</Typography>
                <Typography>Total Opportunities: {data.length}</Typography>
                <Typography>Total Value: ${totalValue.toLocaleString()}</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </LocalizationProvider>
  );
}
