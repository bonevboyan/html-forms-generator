import { useState } from 'react';

export const useFieldEditing = () => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const handleFieldNameChange = (path: string[], newName: string) => {
    setEditingValue(newName);
  };

  const handleFieldNameBlur = (path: string[], onRenameField: (oldPath: string[], newName: string) => void) => {
    const newName = editingValue.trim();
    if (newName && newName !== path[path.length - 1]) {
      try {
        onRenameField(path, newName);
      } catch (error) {
        console.error('Failed to rename field:', error);
      }
    }
    setEditingField(null);
    setEditingValue('');
  };

  const handleFieldNameKeyDown = (e: React.KeyboardEvent, path: string[], onRenameField: (oldPath: string[], newName: string) => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFieldNameBlur(path, onRenameField);
    } else if (e.key === 'Escape') {
      setEditingField(null);
      setEditingValue('');
    }
  };

  return {
    editingField,
    editingValue,
    setEditingField,
    setEditingValue,
    handleFieldNameChange,
    handleFieldNameBlur,
    handleFieldNameKeyDown,
  };
}; 