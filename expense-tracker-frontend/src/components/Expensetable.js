import React, { useState } from "react";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TextField, MenuItem, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import moment from "moment";
import axios from "axios";

function ExpenseTable({ expenses, categories, refresh }) {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", amount: "", date: "", category: "" });
  const [filter, setFilter] = useState({ category: "", from: "", to: "" });

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || "Uncategorized";

  const filtered = expenses.filter((e) => {
    const inCat = filter.category ? e.category === parseInt(filter.category) : true;
    const inFrom = filter.from ? moment(e.date).isSameOrAfter(filter.from) : true;
    const inTo = filter.to ? moment(e.date).isSameOrBefore(filter.to) : true;
    return inCat && inFrom && inTo;
  });

  const startEdit = (exp) => {
    setEditId(exp.id);
    setEditForm({ ...exp });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    axios.put(`http://localhost:5000/api/expenses/${editId}`, editForm).then(() => {
      setEditId(null);
      refresh();
    });
  };

  const cancelEdit = () => setEditId(null);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/expenses/${id}`).then(refresh);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <TextField
        select label="Category" name="category" value={filter.category}
        onChange={e => setFilter({ ...filter, category: e.target.value })}
        sx={{ mr: 2, minWidth: 150 }}
      >
        <MenuItem value="">All</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        type="date" label="From" name="from" value={filter.from}
        onChange={e => setFilter({ ...filter, from: e.target.value })}
        sx={{ mr: 2 }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        type="date" label="To" name="to" value={filter.to}
        onChange={e => setFilter({ ...filter, to: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((exp) =>
            editId === exp.id ? (
              <TableRow key={exp.id}>
                <TableCell>
                  <TextField name="title" value={editForm.title} onChange={handleEditChange} size="small" />
                </TableCell>
                <TableCell>
                  <TextField name="amount" type="number" value={editForm.amount} onChange={handleEditChange} size="small" />
                </TableCell>
                <TableCell>
                  <TextField name="date" type="date" value={editForm.date} onChange={handleEditChange} size="small" InputLabelProps={{ shrink: true }} />
                </TableCell>
                <TableCell>
                  <TextField select name="category" value={editForm.category} onChange={handleEditChange} size="small">
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={saveEdit}><SaveIcon /></IconButton>
                  <IconButton onClick={cancelEdit}><CancelIcon /></IconButton>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={exp.id}>
                <TableCell>{exp.title}</TableCell>
                <TableCell>${exp.amount}</TableCell>
                <TableCell>{exp.date}</TableCell>
                <TableCell>{getCategoryName(exp.category)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(exp)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(exp.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default ExpenseTable;