import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Alert,
  Tooltip,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';
import SortableFieldsContainer from './SortableFieldsContainer';
import { validateSchema } from '../utils/schemaValidation';
import { useSchemaManager } from '../hooks/useSchemaManager';

interface SchemaBuilderProps {
  onFormGenerated: (html: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ 
  onFormGenerated, 
  onLoadingChange
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


  const handleSubmit = async () => {
    const schemaCopy = JSON.parse(JSON.stringify(schema));
    let optionsError: string | null = null;
    function processSchema(s: any, path: string[] = []) {
      for (const [key, fieldRaw] of Object.entries(s)) {
        const field = fieldRaw as any;
        const currentPath = [...path, key];
        if (field.type === 'select') {
          if (typeof field.optionsRaw === 'string') {
            const lines = field.optionsRaw.split('\n').filter(Boolean);
            const options = [];
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              const parts = line.split(',');
              if (parts.length !== 2) {
                optionsError = `Select field "${currentPath.join('.')}" has invalid option format on line ${i + 1}: "${line}". Each line must be value,label.`;
                break;
              }
              options.push({ value: parts[0].trim(), label: parts[1].trim() });
            }
            if (optionsError) break;
            field.options = options;
          }
        }
        if (field.type === 'schema' && field.schema) {
          processSchema(field.schema, currentPath);
        }
      }
    }
    processSchema(schemaCopy);
    if (optionsError) {
      setError(optionsError);
      return;
    }
    const validation = validateSchema(schemaCopy);
    if (validation.isValid) {
      setError(null);
      onLoadingChange(true);
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://html-forms-generator.onrender.com';
        const response = await axios.post<string>(`${backendUrl}/generate-form`, schemaCopy);
        onFormGenerated(response.data);
      } catch (error) {
        console.error('Error generating form:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate form';
        setError(errorMessage);
      } finally {
        onLoadingChange(false);
      }
    } else {
      setError(validation.error);
    }
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
        onAddField={addField}
        onDragEnd={handleDragEnd}
      />
    </Box>
  );
};

export default SchemaBuilder; 