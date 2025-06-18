import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  IconButton,
  Alert,
  Tooltip,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Schema, SchemaEntry } from '../types';

interface SchemaBuilderProps {
  onSubmit: (schema: Schema) => void;
}

const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ onSubmit }) => {
  const [schema, setSchema] = useState<Schema>({});
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  // Helper function to get a nested schema by path
  const getNestedSchema = (path: string[]): Schema => {
    let current: any = schema;
    for (const key of path) {
      if (!current[key] || !current[key].schema) {
        return {};
      }
      current = current[key].schema;
    }
    return current;
  };

  // Helper function to update a nested schema
  const updateNestedSchema = (path: string[], newSchema: Schema): Schema => {
    if (path.length === 0) return newSchema;

    const [currentKey, ...remainingPath] = path;
    const current = { ...schema };
    let currentLevel: any = current;

    // Navigate to the correct level
    for (const key of path.slice(0, -1)) {
      if (!currentLevel[key]) {
        currentLevel[key] = { type: 'schema', schema: {} };
      }
      currentLevel = currentLevel[key].schema;
    }

    // Update the final level
    const lastKey = path[path.length - 1];
    if (!currentLevel[lastKey]) {
      currentLevel[lastKey] = { type: 'schema', schema: {} };
    }
    currentLevel[lastKey].schema = newSchema;

    return current;
  };

  const generateUniqueFieldName = (parentSchema: Schema = schema): string => {
    const existingFields = Object.keys(parentSchema);
    let counter = 1;
    let newName = `field${counter}`;
    
    while (existingFields.includes(newName)) {
      counter++;
      newName = `field${counter}`;
    }
    
    return newName;
  };

  const addField = (parentPath: string[] = []) => {
    const newField: SchemaEntry = {
      type: 'text',
      label: '',
    };

    const parentSchema = getNestedSchema(parentPath);
    const newName = generateUniqueFieldName(parentSchema);
    newField.label = newName.charAt(0).toUpperCase() + newName.slice(1);

    // Create new schema with the field at the top
    const newSchema = {
      [newName]: newField,
      ...parentSchema
    };

    // Update the schema at the correct level
    const updatedSchema = updateNestedSchema(parentPath, newSchema);
    setSchema(updatedSchema);
  };

  const updateField = (path: string[], value: Partial<SchemaEntry>) => {
    const [fieldKey, ...parentPath] = path.reverse();
    const parentSchema = getNestedSchema(parentPath);
    
    // Initialize schema if changing to schema type
    if (value.type === 'schema' && !value.schema) {
      value.schema = {};
    }

    const updatedField = {
      ...parentSchema[fieldKey],
      ...value
    };

    const newSchema = {
      ...parentSchema,
      [fieldKey]: updatedField
    };

    const updatedSchema = updateNestedSchema(parentPath, newSchema);
    setSchema(updatedSchema);
  };

  const deleteField = (path: string[]) => {
    const [fieldKey, ...parentPath] = path.reverse();
    const parentSchema = getNestedSchema(parentPath);
    
    const { [fieldKey]: _, ...restSchema } = parentSchema;
    const updatedSchema = updateNestedSchema(parentPath, restSchema);
    setSchema(updatedSchema);
  };

  const renameField = (oldPath: string[], newName: string) => {
    const [oldKey, ...parentPath] = oldPath.reverse();
    const parentSchema = getNestedSchema(parentPath);
    
    // Check if the new name already exists
    if (parentSchema[newName]) {
      setError(`Field name "${newName}" already exists at this level`);
      return;
    }

    // Create new schema with renamed field
    const { [oldKey]: field, ...restSchema } = parentSchema;
    const newSchema = {
      ...restSchema,
      [newName]: field
    };

    const updatedSchema = updateNestedSchema(parentPath, newSchema);
    setSchema(updatedSchema);
  };

  const validateSchema = (schema: Schema, path: string[] = []): boolean => {
    if (Object.keys(schema).length === 0) {
      setError(`Schema at ${path.join('.')} is empty`);
      return false;
    }

    for (const [key, field] of Object.entries(schema)) {
      const currentPath = [...path, key];
      
      if (!field.type) {
        setError(`Field "${currentPath.join('.')}" is missing a type`);
        return false;
      }

      if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        setError(`Select field "${currentPath.join('.')}" must have at least one option`);
        return false;
      }

      if (field.type === 'schema') {
        if (!field.schema) {
          setError(`Schema field "${currentPath.join('.')}" has no schema defined`);
          return false;
        }
        if (!validateSchema(field.schema, currentPath)) {
          return false;
        }
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = () => {
    if (validateSchema(schema)) {
      onSubmit(schema);
    }
  };

  const handleFieldNameChange = (path: string[], newName: string) => {
    setEditingValue(newName);
  };

  const handleFieldNameBlur = (path: string[]) => {
    const newName = editingValue.trim();
    if (newName && newName !== path[path.length - 1]) {
      renameField(path, newName);
    }
    setEditingField(null);
    setEditingValue('');
  };

  const handleFieldNameKeyDown = (e: React.KeyboardEvent, path: string[]) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFieldNameBlur(path);
    } else if (e.key === 'Escape') {
      setEditingField(null);
      setEditingValue('');
    }
  };

  const renderField = (key: string, field: SchemaEntry, path: string[] = []) => {
    const currentPath = [...path, key];
    const fullKey = currentPath.join('.');
    const isEditing = editingField === fullKey;

    return (
      <Paper key={fullKey} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
          <TextField
            label="Field Name"
            value={isEditing ? editingValue : key}
            onChange={(e) => handleFieldNameChange(currentPath, e.target.value)}
            onBlur={() => handleFieldNameBlur(currentPath)}
            onKeyDown={(e) => handleFieldNameKeyDown(e, currentPath)}
            onFocus={() => {
              setEditingField(fullKey);
              setEditingValue(key);
            }}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <Tooltip title="Delete field">
            <IconButton onClick={() => deleteField(currentPath)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={field.type}
            label="Type"
            onChange={(e) => updateField(currentPath, { type: e.target.value })}
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
          onChange={(e) => updateField(currentPath, { label: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Hint"
          value={field.hint || ''}
          onChange={(e) => updateField(currentPath, { hint: e.target.value })}
          sx={{ mb: 2 }}
        />

        {field.type === 'select' && (
          <TextField
            fullWidth
            label="Options (one per line, format: value,label)"
            multiline
            rows={4}
            value={(field as any).options?.map(([v, l]: [string, string]) => `${v},${l}`).join('\n') || ''}
            onChange={(e) => {
              const options = e.target.value
                .split('\n')
                .filter(Boolean)
                .map(line => {
                  const [value, label] = line.split(',').map(s => s.trim());
                  return [value, label];
                });
              updateField(currentPath, { options });
            }}
            sx={{ mb: 2 }}
            helperText="Enter each option on a new line in the format: value,label"
          />
        )}

        {field.type === 'schema' && (
          <Box sx={{ pl: 2, borderLeft: '2px solid #ccc' }}>
            {Object.entries((field as any).schema || {}).map(([subKey, subField]) =>
              renderField(subKey, subField as SchemaEntry, currentPath)
            )}
            <Button
              startIcon={<AddIcon />}
              onClick={() => addField(currentPath)}
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Schema Builder
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {Object.entries(schema).map(([key, field]) => renderField(key, field))}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => addField()}
        >
          Add Field
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={Object.keys(schema).length === 0}
        >
          Generate Form
        </Button>
      </Box>
    </Box>
  );
};

export default SchemaBuilder; 