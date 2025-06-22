import { Schema } from '../types/schemas';

export const getNestedSchema = (schema: Schema, path: string[]): Schema => {
  let current: any = schema;
  for (const key of path) {
    if (!current[key] || !current[key].schema) {
      return {};
    }
    current = current[key].schema;
  }
  return current;
};

export const updateNestedSchema = (schema: Schema, path: string[], newSchema: Schema): Schema => {
  if (path.length === 0) return newSchema;

  const current = { ...schema };
  let currentLevel: any = current;

  for (const key of path.slice(0, -1)) {
    if (!currentLevel[key]) {
      currentLevel[key] = { type: 'schema', schema: {} };
    }
    currentLevel = currentLevel[key].schema;
  }

  const lastKey = path[path.length - 1];
  if (!currentLevel[lastKey]) {
    currentLevel[lastKey] = { type: 'schema', schema: {} };
  }
  currentLevel[lastKey].schema = newSchema;

  return current;
};

export const generateUniqueFieldName = (parentSchema: Schema): string => {
  const existingFields = Object.keys(parentSchema);
  let counter = 1;
  let newName = `field${counter}`;
  
  while (existingFields.includes(newName)) {
    counter++;
    newName = `field${counter}`;
  }
  
  return newName;
};

export const reorderFields = (schema: Schema, parentPath: string[], oldIndex: number, newIndex: number): Schema => {
  const parentSchema = getNestedSchema(schema, parentPath);
  const fieldEntries = Object.entries(parentSchema);

  // Sort entries by current position before reordering
  fieldEntries.sort((a, b) => (a[1].position ?? 0) - (b[1].position ?? 0));

  // Move the entry from oldIndex to newIndex
  const [movedEntry] = fieldEntries.splice(oldIndex, 1);
  fieldEntries.splice(newIndex, 0, movedEntry);

  // Update positions for all fields
  const reorderedEntries = fieldEntries.map(([key, value], index) => [
    key,
    { ...value, position: index }
  ]);

  const newSchema = Object.fromEntries(reorderedEntries);
  return updateNestedSchema(schema, parentPath, newSchema);
}; 