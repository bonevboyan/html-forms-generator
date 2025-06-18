import { Schema } from '../types/schemas';

export const validateSchema = (schema: Schema, path: string[] = []): { isValid: boolean; error: string | null } => {
  if (Object.keys(schema).length === 0) {
    return {
      isValid: false,
      error: `Schema at ${path.join('.')} is empty`
    };
  }

  for (const [key, field] of Object.entries(schema)) {
    const currentPath = [...path, key];
    
    if (!field.type) {
      return {
        isValid: false,
        error: `Field "${currentPath.join('.')}" is missing a type`
      };
    }

    if (field.type === 'select' && (!field.options || field.options.length === 0)) {
      return {
        isValid: false,
        error: `Select field "${currentPath.join('.')}" must have at least one option`
      };
    }

    if (field.type === 'schema') {
      if (!field.schema) {
        return {
          isValid: false,
          error: `Schema field "${currentPath.join('.')}" has no schema defined`
        };
      }
      const nestedValidation = validateSchema(field.schema, currentPath);
      if (!nestedValidation.isValid) {
        return nestedValidation;
      }
    }
  }

  return {
    isValid: true,
    error: null
  };
}; 