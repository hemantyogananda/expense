const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// File paths for local "database"
const categoriesFile = path.join(__dirname, 'categories.json');
const expensesFile = path.join(__dirname, 'expenses.json');
const forecastsFile = path.join(__dirname, 'forecasts.json');

// Helper functions
function readData(file, fallback) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
  return JSON.parse(fs.readFileSync(file));
}
function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Helper for forecasts
function readForecasts() {
  return readData(forecastsFile, []);
}
function writeForecasts(data) {
  writeData(forecastsFile, data);
}

// --- Category CRUD ---
app.get('/api/categories', (req, res) => {
  const categories = readData(categoriesFile, [
    { id: 1, name: "Groceries" },
    { id: 2, name: "Utilities" },
    { id: 3, name: "Transport" },
    { id: 4, name: "Coffee" },
    { id: 5, name: "Shopping" },
    { id: 6, name: "Other" }
  ]);
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  const categories = readData(categoriesFile, []);
  const newCategory = { id: categories.length ? categories[categories.length - 1].id + 1 : 1, name };
  categories.push(newCategory);
  writeData(categoriesFile, categories);
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const categories = readData(categoriesFile, []);
  const cat = categories.find(c => c.id === id);
  if (!cat) return res.status(404).json({ error: "Category not found" });
  cat.name = name;
  writeData(categoriesFile, categories);
  res.json(cat);
});

app.delete('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let categories = readData(categoriesFile, []);
  let expenses = readData(expensesFile, []);
  const idx = categories.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Category not found" });
  // Remove category from expenses as well
  expenses = expenses.map(exp => exp.category === id ? { ...exp, category: null } : exp);
  categories.splice(idx, 1);
  writeData(categoriesFile, categories);
  writeData(expensesFile, expenses);
  res.json({ success: true });
});

// --- Expense CRUD ---
app.get('/api/expenses', (req, res) => {
  const expenses = readData(expensesFile, [
    { id: 1, title: "Groceries", amount: 50, date: "2024-06-01", category: 1 },
    { id: 2, title: "Internet Bill", amount: 30, date: "2024-06-03", category: 2 },
    { id: 3, title: "Coffee", amount: 5, date: "2024-06-04", category: 4 }
  ]);
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const { title, amount, date, category } = req.body;
  const expenses = readData(expensesFile, []);
  const newExpense = {
    id: expenses.length ? expenses[expenses.length - 1].id + 1 : 1,
    title,
    amount,
    date,
    category: parseInt(category)
  };
  expenses.push(newExpense);
  writeData(expensesFile, expenses);
  res.status(201).json(newExpense);
});

app.delete('/api/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let expenses = readData(expensesFile, []);
  const index = expenses.findIndex(exp => exp.id === id);
  if (index === -1) return res.status(404).json({ error: "Expense not found" });
  expenses.splice(index, 1);
  writeData(expensesFile, expenses);
  res.json({ success: true });
});

app.put('/api/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, amount, date, category } = req.body;
  const expenses = readData(expensesFile, []);
  const expense = expenses.find(exp => exp.id === id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });
  expense.title = title;
  expense.amount = amount;
  expense.date = date;
  expense.category = parseInt(category);
  writeData(expensesFile, expenses);
  res.json(expense);
});

// Get all forecasts
app.get('/api/forecasts', (req, res) => {
  res.json(readForecasts());
});

// Add a forecast
app.post('/api/forecasts', (req, res) => {
  const { title, amount, date, category } = req.body;
  if (new Date(date) < new Date(new Date().toISOString().slice(0,10))) {
    return res.status(400).json({ error: "Cannot set forecast for past date." });
  }
  const forecasts = readForecasts();
  const newForecast = {
    id: forecasts.length ? forecasts[forecasts.length - 1].id + 1 : 1,
    title,
    amount,
    date,
    category: parseInt(category)
  };
  forecasts.push(newForecast);
  writeForecasts(forecasts);
  res.status(201).json(newForecast);
});

// Delete a forecast
app.delete('/api/forecasts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let forecasts = readForecasts();
  forecasts = forecasts.filter(f => f.id !== id);
  writeForecasts(forecasts);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});