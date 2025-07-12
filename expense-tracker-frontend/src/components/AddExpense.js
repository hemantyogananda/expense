import React, { useState } from "react";
import { Paper, Typography, Box, TextField, Button, MenuItem, Grid } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";

function AddExpense({ categories, refresh, totalExpenses, availableBalance }) {
  const [form, setForm] = useState({ title: "", amount: "", date: "", category: "" });
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/expenses", form).then(() => {
      setForm({ title: "", amount: "", date: "", category: "" });
      refresh();
      enqueueSnackbar("Expense added!", { variant: "success" });
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1">Total Expenses</Typography>
          <Typography variant="h6" color="primary">${totalExpenses.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1">Available Balance</Typography>
          <Typography variant="h6" color={availableBalance < 0 ? "error" : "success.main"}>
            ${availableBalance.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              required
              size="small"
              inputProps={{ min: 0, step: "0.01" }}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              size="small"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" color="primary" size="small">
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AddExpense;