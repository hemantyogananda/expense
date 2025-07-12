import React, { useState, useEffect } from "react";
import { Paper, Typography, Box, TextField, Button, MenuItem, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";

function ForecastForm({ categories, refresh }) {
  const [form, setForm] = useState({ title: "", amount: "", date: "", category: "" });
  const [forecasts, setForecasts] = useState([]);
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const fetchForecasts = () => {
    axios.get("http://localhost:5000/api/forecasts").then(res => setForecasts(res.data));
  };

  useEffect(() => {
    fetchForecasts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (moment(form.date).isBefore(moment(), "day")) {
      setError("Cannot set forecast for past date.");
      enqueueSnackbar("Cannot set forecast for past date.", { variant: "error" });
      return;
    }
    axios.post("http://localhost:5000/api/forecasts", form)
      .then(() => {
        setForm({ title: "", amount: "", date: "", category: "" });
        fetchForecasts();
        enqueueSnackbar("Forecast added!", { variant: "success" });
      })
      .catch(err => {
        setError(err.response?.data?.error || "Error adding forecast");
        enqueueSnackbar(err.response?.data?.error || "Error adding forecast", { variant: "error" });
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/forecasts/${id}`).then(() => {
      fetchForecasts();
      enqueueSnackbar("Forecast deleted.", { variant: "info" });
    });
  };

  // Reminder logic (for demonstration, just show a message if due in 24h)
  const reminders = forecasts.filter(f =>
    moment(f.date).diff(moment(), "hours") <= 24 &&
    moment(f.date).diff(moment(), "hours") > 0
  );

  useEffect(() => {
    if (reminders.length > 0) {
      enqueueSnackbar("You have forecast expenses due within 24 hours!", { variant: "warning" });
    }
    // eslint-disable-next-line
  }, [reminders.length]);

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Forecast Expenses
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Title" name="title" value={form.title} onChange={handleChange} required />
        <TextField label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} required />
        <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
        <TextField select label="Category" name="category" value={form.category} onChange={handleChange} required>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary">Add Forecast</Button>
      </Box>
      <Typography variant="subtitle1" sx={{ mt: 3 }}>Upcoming Forecasts</Typography>
      <List>
        {forecasts.map(f => (
          <ListItem key={f.id}
            secondaryAction={
              <IconButton onClick={() => handleDelete(f.id)}><DeleteIcon /></IconButton>
            }
          >
            <ListItemText
              primary={`${f.title} - $${f.amount} on ${f.date}`}
              secondary={categories.find(c => c.id === f.category)?.name}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default ForecastForm;