import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Alert,
  Tooltip,
  Divider,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';
import SortableFieldsContainer from './SortableFieldsContainer';
import { validateSchema } from '../utils/schemaValidation';
import { useSchemaManager } from '../hooks/useSchemaManager';
import { useFieldEditing } from '../hooks/useFieldEditing';
import { Schema } from '../types/schemas';

interface SchemaBuilderProps {
  onFormGenerated: (html: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onErrorChange: (error: string | null) => void;
}

const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ 
  onFormGenerated, 
  onLoadingChange, 
  onErrorChange 
}) => {
  const [error, setError] = useState<string | null>(null);
  
  const {
    schema,
    addField,
    updateField,
    deleteField,
    renameField,
    handleDragEnd,
  } = useSchemaManager();

  const {
    editingField,
    editingValue,
    setEditingField,
    setEditingValue,
    handleFieldNameChange,
    handleFieldNameBlur,
    handleFieldNameKeyDown,
  } = useFieldEditing();

  const handleSubmit = async () => {
    const validation = validateSchema(schema);
    if (validation.isValid) {
      setError(null);
      onErrorChange(null);
      onLoadingChange(true);
      
      try {
        const response = await axios.post<string>('http://localhost:3001/generate-form', schema);
        onFormGenerated(response.data);
      } catch (error) {
        console.error('Error generating form:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate form';
        onErrorChange(errorMessage);
      } finally {
        onLoadingChange(false);
      }
    } else {
      setError(validation.error);
      onErrorChange(validation.error);
    }
  };

  const handleFieldNameBlurWithRename = (path: string[]) => {
    handleFieldNameBlur(path, renameField);
  };

  const handleFieldNameKeyDownWithRename = (e: React.KeyboardEvent, path: string[]) => {
    handleFieldNameKeyDown(e, path, renameField);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Schema Builder
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Add Field">
            <IconButton
              onClick={() => addField()}
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Generate Form">
            <IconButton
              onClick={handleSubmit}
              disabled={Object.keys(schema).length === 0}
              color="primary"
            >
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {Object.keys(schema).length === 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <Typography>
              Press the plus icon to add your first field.
              To generate your form, press the play button.
            </Typography>
          </Box>
        </Paper>
      )}

      <SortableFieldsContainer
        schema={schema}
        parentPath={[]}
        onUpdateField={updateField}
        onDeleteField={deleteField}
        onRenameField={renameField}
        editingField={editingField}
        editingValue={editingValue}
        onFieldNameChange={handleFieldNameChange}
        onFieldNameBlur={handleFieldNameBlurWithRename}
        onFieldNameKeyDown={handleFieldNameKeyDownWithRename}
        onSetEditingField={setEditingField}
        onSetEditingValue={setEditingValue}
        onAddField={addField}
        onDragEnd={handleDragEnd}
      />
    </Box>
  );
};

export default SchemaBuilder; 