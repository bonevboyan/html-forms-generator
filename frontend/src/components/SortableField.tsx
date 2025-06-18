import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  DndContext,
  closestCenter,
} from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SchemaEntry } from '../types';

interface SortableFieldProps {
  id: string;
  field: SchemaEntry;
  path: string[];
  onUpdateField: (path: string[], value: Partial<SchemaEntry>) => void;
  onDeleteField: (path: string[]) => void;
  onRenameField: (oldPath: string[], newName: string) => void;
  editingField: string | null;
  editingValue: string;
  onFieldNameChange: (path: string[], newName: string) => void;
  onFieldNameBlur: (path: string[]) => void;
  onFieldNameKeyDown: (e: React.KeyboardEvent, path: string[]) => void;
  onSetEditingField: (key: string) => void;
  onSetEditingValue: (value: string) => void;
  onAddField: (parentPath: string[]) => void;
  sensors: any;
  onDragEnd: (event: any, parentPath: string[]) => void;
}

const SortableField: React.FC<SortableFieldProps> = ({
  id,
  field,
  path,
  onUpdateField,
  onDeleteField,
  onRenameField,
  editingField,
  editingValue,
  onFieldNameChange,
  onFieldNameBlur,
  onFieldNameKeyDown,
  onSetEditingField,
  onSetEditingValue,
  onAddField,
  sensors,
  onDragEnd,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const currentPath = [...path, id];
  const fullKey = currentPath.join('.');
  const isEditing = editingField === fullKey;

  return (
    <Paper 
      ref={setNodeRef} 
      style={style} 
      sx={{ p: 2, mb: 2, cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <IconButton
          {...attributes}
          {...listeners}
          size="small"
          sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
        >
          <DragIndicatorIcon />
        </IconButton>
        <TextField
          label="Field Name"
          value={isEditing ? editingValue : id}
          onChange={(e) => onFieldNameChange(currentPath, e.target.value)}
          onBlur={() => onFieldNameBlur(currentPath)}
          onKeyDown={(e) => onFieldNameKeyDown(e, currentPath)}
          onFocus={() => {
            onSetEditingField(fullKey);
            onSetEditingValue(id);
          }}
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <Tooltip title="Delete field">
          <IconButton onClick={() => onDeleteField(currentPath)} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={field.type}
          label="Type"
          onChange={(e) => onUpdateField(currentPath, { type: e.target.value })}
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="select">Select</MenuItem>
          <MenuItem value="textarea">Textarea</MenuItem>
          <MenuItem value="schema">Schema</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Label"
        value={field.label || ''}
        onChange={(e) => onUpdateField(currentPath, { label: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            // Focus the next field
            const form = e.currentTarget.closest('form');
            if (form) {
              const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
              const currentIndex = inputs.indexOf(e.currentTarget);
              const nextInput = inputs[currentIndex + 1] as HTMLElement;
              if (nextInput) {
                nextInput.focus();
              }
            }
          }
        }}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Hint"
        value={field.hint || ''}
        onChange={(e) => onUpdateField(currentPath, { hint: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            // Focus the next field
            const form = e.currentTarget.closest('form');
            if (form) {
              const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
              const currentIndex = inputs.indexOf(e.currentTarget);
              const nextInput = inputs[currentIndex + 1] as HTMLElement;
              if (nextInput) {
                nextInput.focus();
              }
            }
          }
        }}
        sx={{ mb: 2 }}
      />

      {field.type === 'select' && (
        <TextField
          fullWidth
          label="Options (one per line, format: value,label)"
          multiline
          rows={4}
          value={(field as any).options?.map((opt: any) => {
            // Handle both old tuple format and new SelectOption format
            if (Array.isArray(opt)) {
              return `${opt[0]},${opt[1]}`;
            }
            return `${opt.value},${opt.label}`;
          }).join('\n') || ''}
          onChange={(e) => {
            const options = e.target.value
              .split('\n')
              .filter(Boolean)
              .map(line => {
                const [value, label] = line.split(',').map(s => s.trim());
                return { value, label };
              });
            onUpdateField(currentPath, { options });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              // Focus the next field or submit
              const form = e.currentTarget.closest('form');
              if (form) {
                const inputs = Array.from(form.querySelectorAll('input, textarea, select'));
                const currentIndex = inputs.indexOf(e.currentTarget);
                const nextInput = inputs[currentIndex + 1] as HTMLElement;
                if (nextInput) {
                  nextInput.focus();
                }
              }
            }
          }}
          sx={{ mb: 2 }}
          helperText="Enter each option on a new line in the format: value,label. Press Enter to move to next field."
        />
      )}

      {field.type === 'schema' && (
        <Box sx={{ pl: 2, borderLeft: '2px solid #ccc' }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => onDragEnd(event, currentPath)}
          >
            <SortableContext
              items={Object.keys((field as any).schema || {}).map(key => key)}
              strategy={verticalListSortingStrategy}
            >
              {Object.entries((field as any).schema || {}).map(([subKey, subField]) => (
                <SortableField
                  key={`${fullKey}.${subKey}`}
                  id={subKey}
                  field={subField as SchemaEntry}
                  path={currentPath}
                  onUpdateField={onUpdateField}
                  onDeleteField={onDeleteField}
                  onRenameField={onRenameField}
                  editingField={editingField}
                  editingValue={editingValue}
                  onFieldNameChange={onFieldNameChange}
                  onFieldNameBlur={onFieldNameBlur}
                  onFieldNameKeyDown={onFieldNameKeyDown}
                  onSetEditingField={onSetEditingField}
                  onSetEditingValue={onSetEditingValue}
                  onAddField={onAddField}
                  sensors={sensors}
                  onDragEnd={onDragEnd}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button
            startIcon={<AddIcon />}
            onClick={() => onAddField(currentPath)}
            sx={{ mt: 2 }}
            variant="outlined"
          >
            Add Field
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default SortableField; 