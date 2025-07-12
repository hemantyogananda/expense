import React, { useMemo } from "react";
import { Paper, Typography, Grid, Box } from "@mui/material";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, LineChart, Line
} from "recharts";
import moment from "moment";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF69B4", "#B8860B"];

function Dashboard({ expenses, forecasts, categories }) {
  // Combine actual and forecast for some charts
  const allDates = [
    ...expenses.map(e => e.date),
    ...forecasts.map(f => f.date)
  ];
  const uniqueDates = Array.from(new Set(allDates)).sort();

  // Total
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const forecastTotal = forecasts.reduce((sum, f) => sum + Number(f.amount), 0);

  // By category (actual)
  const byCategory = categories.map((cat) => ({
    name: cat.name,
    value: expenses.filter((e) => e.category === cat.id).reduce((sum, e) => sum + Number(e.amount), 0),
    forecast: forecasts.filter((f) => f.category === cat.id).reduce((sum, f) => sum + Number(f.amount), 0),
  })).filter((c) => c.value > 0 || c.forecast > 0);

  // By date (actual and forecast)
  const byDate = uniqueDates.map(date => ({
    date,
    actual: expenses.filter(e => e.date === date).reduce((sum, e) => sum + Number(e.amount), 0),
    forecast: forecasts.filter(f => f.date === date).reduce((sum, f) => sum + Number(f.amount), 0),
  }));

  // By month (actual and forecast)
  const byMonth = useMemo(() => {
    const months = {};
    expenses.forEach(e => {
      const m = moment(e.date).format("YYYY-MM");
      months[m] = months[m] || { month: m, actual: 0, forecast: 0 };
      months[m].actual += Number(e.amount);
    });
    forecasts.forEach(f => {
      const m = moment(f.date).format("YYYY-MM");
      months[m] = months[m] || { month: m, actual: 0, forecast: 0 };
      months[m].forecast += Number(f.amount);
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, [expenses, forecasts]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">Total Expenses</Typography>
          <Typography variant="h4" color="primary">${total.toFixed(2)}</Typography>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>Forecast Expenses</Typography>
          <Typography variant="h5" color="warning.main">${forecastTotal.toFixed(2)}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" align="center">By Category</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: $${value}`}
              >
                {byCategory.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              By Category: Actual Expenses
            </Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" align="center">Expenses Over Time</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={byDate}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#1976d2" name="Actual" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="forecast" stroke="#FFBB28" name="Forecast" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" align="center">Monthly Actual vs Forecast</Typography>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="actual" fill="#1976d2" name="Actual" />
              <Bar dataKey="forecast" fill="#FFBB28" name="Forecast" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Dashboard;