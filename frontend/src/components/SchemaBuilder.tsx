import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Alert,
  Tooltip,
  Paper,
  TextField,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import SortableFieldsContainer from "./SortableFieldsContainer";
import { validateSchema } from "../utils/schemaValidation";
import { useFormsApi } from "../hooks/useFormsApi";
import { DragEndEvent } from '@dnd-kit/core';
import { Schema, SchemaEntry } from '../types/schemas';
import { 
  getNestedSchema, 
  updateNestedSchema, 
  generateUniqueFieldName,
  reorderFields 
} from '../utils/schemaOperations';

interface SchemaBuilderProps {
  onFormGenerated: (html: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onFinishEdit?: () => void;
}

const SchemaBuilder: React.FC<SchemaBuilderProps> = ({
  onFormGenerated,
  onLoadingChange,
  onFinishEdit,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [schema, setSchema] = useState<Schema>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const { createForm, generateForm } = useFormsApi();

  console.log('[SchemaBuilder] Render', { title, schema });

  const addField = (parentPath: string[] = []) => {
    const parentSchema = getNestedSchema(schema, parentPath);
    const maxPosition = Object.values(parentSchema).reduce((max, field) => 
      Math.max(max, (field.position ?? 0)), -1);
    const newName = generateUniqueFieldName(parentSchema);

    const newField: SchemaEntry = {
      type: 'text',
      label: newName.charAt(0).toUpperCase() + newName.slice(1),
      position: maxPosition + 1,
    };

    const newSchema = {
      ...parentSchema,
      [newName]: newField
    };

    const updatedSchema = updateNestedSchema(schema, parentPath, newSchema);
    setSchema(updatedSchema);
  };

  const updateField = (path: string[], value: Partial<SchemaEntry>) => {
    const [fieldKey, ...parentPath] = path.reverse();
    const parentSchema = getNestedSchema(schema, parentPath);
    
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

    const updatedSchema = updateNestedSchema(schema, parentPath, newSchema);
    setSchema(updatedSchema);
  };

  const deleteField = (path: string[]) => {
    const [fieldKey, ...parentPath] = path.reverse();
    const parentSchema = getNestedSchema(schema, parentPath);
    
    const { [fieldKey]: _, ...restSchema } = parentSchema;
    const updatedSchema = updateNestedSchema(schema, parentPath, restSchema);
    setSchema(updatedSchema);
  };

  const renameField = (oldPath: string[], newName: string) => {
    const [oldKey, ...parentPath] = oldPath.reverse();
    const parentSchema = getNestedSchema(schema, parentPath);
    
    if (parentSchema[newName]) {
      throw new Error(`Field name "${newName}" already exists at this level`);
    }

    const { [oldKey]: field, ...restSchema } = parentSchema;
    const newSchema = {
      [newName]: field,
      ...restSchema
    };

    const updatedSchema = updateNestedSchema(schema, parentPath, newSchema);
    setSchema(updatedSchema);
  };

  const handleDragEnd = (event: DragEndEvent, parentPath: string[] = []) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const parentSchema = getNestedSchema(schema, parentPath);
      const fieldEntries = Object.entries(parentSchema);
      const oldIndex = fieldEntries.findIndex(([key]) => key === active.id);
      const newIndex = fieldEntries.findIndex(([key]) => key === over?.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedSchema = reorderFields(schema, parentPath, oldIndex, newIndex);
        setSchema(updatedSchema);
      }
    }
  };

  // Helper to process and validate schema
  const processAndValidateSchema = () => {
    const schemaCopy = JSON.parse(JSON.stringify(schema));
    let optionsError: string | null = null;
    function processSchema(s: any, path: string[] = []) {
      for (const [key, fieldRaw] of Object.entries(s)) {
        const field = fieldRaw as any;
        const currentPath = [...path, key];
        if (field.type === "select") {
          if (typeof field.optionsRaw === "string") {
            const lines = field.optionsRaw.split("\n").filter(Boolean);
            const options = [];
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              const parts = line.split(",");
              if (parts.length !== 2) {
                optionsError = `Select field "${currentPath.join(
                  "."
                )}" has invalid option format on line ${
                  i + 1
                }: "${line}". Each line must be value,label.`;
                break;
              }
              options.push({ value: parts[0].trim(), label: parts[1].trim() });
            }
            if (optionsError) break;
            field.options = options;
          }
        }
        if (field.type === "schema" && field.schema) {
          processSchema(field.schema, currentPath);
        }
      }
    }
    processSchema(schemaCopy);
    if (optionsError) {
      return { valid: false, error: optionsError, schemaCopy };
    }
    const validation = validateSchema(schemaCopy);
    if (!validation.isValid) {
      return { valid: false, error: validation.error, schemaCopy };
    }
    return { valid: true, error: null, schemaCopy };
  };

  const handleSave = async () => {
    const {
      valid,
      error: validationError,
      schemaCopy,
    } = processAndValidateSchema();
    console.log('[Save] Title:', title);
    console.log('[Save] Schema:', schemaCopy);
    if (!valid) {
      console.log('[Save] Validation error:', validationError);
      setError(validationError);
      return;
    }
    if (!title.trim()) {
      console.log('[Save] Missing title');
      setError("Please enter a title for your form.");
      return;
    }
    setError(null);
    onLoadingChange(true);
    try {
      await createForm(title, schemaCopy);
      console.log('[Save] Form saved successfully');
      setShowSuccess(true);
      setTimeout(() => {
        if (onFinishEdit) onFinishEdit();
        navigate('/my-forms');
      }, 2000);
    } catch (err: any) {
      console.log('[Save] Error:', err);
      setError(err.message || "Failed to save form");
    } finally {
      onLoadingChange(false);
    }
  };

  const handleSubmit = async () => {
    const {
      valid,
      error: validationError,
      schemaCopy,
    } = processAndValidateSchema();
    console.log('[Generate] Title:', title);
    console.log('[Generate] Schema:', schemaCopy);
    if (!valid) {
      console.log('[Generate] Validation error:', validationError);
      setError(validationError);
      return;
    }
    setError(null);
    onLoadingChange(true);
    try {
      const html = await generateForm(schemaCopy);
      console.log('[Generate] HTML:', html);
      onFormGenerated(html);
    } catch (error: any) {
      console.log('[Generate] Error:', error);
      setError(error.message || "Failed to generate form");
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Schema Builder</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Tooltip title="Add Field">
            <IconButton onClick={() => addField()} color="primary">
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Generate Form">
            <span>
              <IconButton
                onClick={handleSubmit}
                disabled={Object.keys(schema).length === 0}
                color="primary"
              >
                <PlayArrowIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Save Form">
            <span>
              <IconButton
                onClick={handleSave}
                disabled={Object.keys(schema).length === 0}
                color="primary"
              >
                <SaveIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
      <TextField
        label="Form Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {Object.keys(schema).length === 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
            <Typography>
              Press the plus icon to add your first field. To generate your
              form, press the play button.
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
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Form created successfully! Redirecting to My Forms...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SchemaBuilder;
