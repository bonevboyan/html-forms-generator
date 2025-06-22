import { useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { Schema, SchemaEntry } from '../types/schemas';
import { 
  getNestedSchema, 
  updateNestedSchema, 
  generateUniqueFieldName,
  reorderFields 
} from '../utils/schemaOperations';

export const useSchemaManager = () => {
  const [schema, setSchema] = useState<Schema>({});

  const addField = (parentPath: string[] = []) => {
    const newField: SchemaEntry = {
      type: 'text',
      label: '',
    };

    const parentSchema = getNestedSchema(schema, parentPath);
    const newName = generateUniqueFieldName(parentSchema);
    newField.label = newName.charAt(0).toUpperCase() + newName.slice(1);

    const newSchema = {
      [newName]: newField,
      ...parentSchema
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
      ...restSchema,
      [newName]: field
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

  return {
    schema,
    addField,
    updateField,
    deleteField,
    renameField,
    handleDragEnd,
    setSchema,
  };
}; 