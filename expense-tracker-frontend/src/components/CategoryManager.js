import React, { useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText, IconButton, TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";

function CategoryManager({ categories, refresh }) {
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");

  const startEdit = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = () => {
    axios.put(`http://localhost:5000/api/categories/${editId}`, { name: editName }).then(() => {
      setEditId(null);
      setEditName("");
      refresh();
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/categories/${id}`).then(refresh);
  };

  const addCategory = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    axios.post("http://localhost:5000/api/categories", { name: newName }).then(() => {
      setNewName("");
      refresh();
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Manage Categories
      </Typography>
      <form onSubmit={addCategory} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TextField
          label="New Category"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          size="small"
        />
        <Button type="submit" variant="contained">Add</Button>
      </form>
      <List>
        {categories.map((cat) =>
          editId === cat.id ? (
            <ListItem key={cat.id}>
              <TextField value={editName} onChange={e => setEditName(e.target.value)} size="small" />
              <IconButton onClick={saveEdit}><SaveIcon /></IconButton>
              <IconButton onClick={cancelEdit}><CancelIcon /></IconButton>
            </ListItem>
          ) : (
            <ListItem key={cat.id}
              secondaryAction={
                <>
                  <IconButton onClick={() => startEdit(cat)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(cat.id)}><DeleteIcon /></IconButton>
                </>
              }
            >
              <ListItemText primary={cat.name} />
            </ListItem>
          )
        )}
      </List>
    </Paper>
  );
}

export default CategoryManager;