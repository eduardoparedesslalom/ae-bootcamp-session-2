import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

function SortableItem({ item, onEdit, onDelete }) {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState(item.name);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? '#e3f2fd' : 'inherit',
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(item.id, editValue.trim());
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditValue(item.name);
    setEditMode(false);
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      divider
      aria-label={`Task: ${item.name}`}
      secondaryAction={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {!editMode && (
            <IconButton
              aria-label={`edit ${item.name}`}
              size="small"
              onClick={() => {
                setEditValue(item.name);
                setEditMode(true);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            aria-label={`delete ${item.name}`}
            size="small"
            onClick={() => onDelete(item.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label={`drag ${item.name}`}
            size="small"
            {...attributes}
            {...listeners}
            sx={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
        </Box>
      }
    >
      {editMode ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 14 }}>
          <TextField
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            size="small"
            autoFocus
            inputProps={{ 'aria-label': 'edit task name' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <Button variant="contained" size="small" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" size="small" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      ) : (
        <ListItemText primary={item.name} sx={{ pr: 14 }} />
      )}
    </ListItem>
  );
}

export default SortableItem;
