import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Schema, SchemaEntry } from '../types';
import SortableField from './SortableField';

interface SortableFieldsContainerProps {
  schema: Schema;
  parentPath: string[];
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
  onDragEnd: (event: DragEndEvent, parentPath: string[]) => void;
}

const SortableFieldsContainer: React.FC<SortableFieldsContainerProps> = ({
  schema,
  parentPath,
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
  onDragEnd,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fieldEntries = Object.entries(schema);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => onDragEnd(event, parentPath)}
    >
      <SortableContext
        items={fieldEntries.map(([key]) => key)}
        strategy={verticalListSortingStrategy}
      >
        {fieldEntries.map(([key, field]) => (
          <SortableField
            key={parentPath.length > 0 ? `${parentPath.join('.')}.${key}` : key}
            id={key}
            field={field}
            path={parentPath}
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
  );
};

export default SortableFieldsContainer; 