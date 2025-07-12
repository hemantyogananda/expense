import React, { useEffect, useState, useMemo } from "react";
import { Container, Tabs, Tab, Box, Typography, IconButton } from "@mui/material";
import Dashboard from "./components/Dashboard";
import ForecastForm from "./components/ForecastForm";
import CategoryManager from "./components/CategoryManager";
import AddExpense from "./components/AddExpense";
import ExpenseTable from "./components/Expensetable";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const INITIAL_BALANCE = 10000;

function App() {
  const [tab, setTab] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [mode, setMode] = useState("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#18191A",
                  paper: "#242526",
                },
              }
            : {}),
        },
      }),
    [mode]
  );

  const fetchExpenses = () =>
    axios.get("http://localhost:5000/api/expenses").then((res) => setExpenses(res.data));
  const fetchCategories = () =>
    axios.get("http://localhost:5000/api/categories").then((res) => setCategories(res.data));
  const fetchForecasts = () =>
    axios.get("http://localhost:5000/api/forecasts").then((res) => setForecasts(res.data));

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
    fetchForecasts();
  }, []);

  const refresh = () => {
    fetchExpenses();
    fetchCategories();
    fetchForecasts();
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const availableBalance = INITIAL_BALANCE - totalExpenses;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h3" align="center" gutterBottom>
              Expense Tracker
            </Typography>
            <IconButton
              sx={{ ml: 1 }}
              onClick={() => setMode((prev) => (prev === "light" ? "dark" : "light"))}
              color="inherit"
              aria-label="toggle theme"
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
              <Tab label="Dashboard" />
              <Tab label="Expenses" />
              <Tab label="Forecast" />
              <Tab label="Categories" />
            </Tabs>
          </Box>
          <AddExpense
            categories={categories}
            refresh={refresh}
            totalExpenses={totalExpenses}
            availableBalance={availableBalance}
          />
          {tab === 0 && (
            <Dashboard expenses={expenses} forecasts={forecasts} categories={categories} />
          )}
          {tab === 1 && (
            <ExpenseTable
              expenses={expenses}
              categories={categories}
              refresh={refresh}
            />
          )}
          {tab === 2 && (
            <ForecastForm categories={categories} refresh={refresh} />
          )}
          {tab === 3 && (
            <CategoryManager categories={categories} refresh={refresh} />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;