import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import { useItems } from './hooks/useItems';
import SortableItem from './components/SortableItem';

function App() {
  const { items, loading, error, addItem, editItem, deleteItem, reorderItems } = useItems();
  const [newItem, setNewItem] = useState('');

  const sensors = useSensors(useSensor(PointerSensor));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    await addItem(newItem.trim());
    setNewItem('');
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      reorderItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            To Do App
          </Typography>
          <Typography variant="body2">Keep track of your tasks</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Item
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter item name"
              size="small"
              fullWidth
              inputProps={{ 'aria-label': 'new task name' }}
            />
            <Button variant="contained" type="submit">
              Add Item
            </Button>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Items from Database
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <List disablePadding>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <SortableItem
                        key={item.id}
                        item={item}
                        onEdit={editItem}
                        onDelete={deleteItem}
                      />
                    ))
                  ) : (
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      No items found. Add some!
                    </Typography>
                  )}
                </List>
              </SortableContext>
            </DndContext>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;