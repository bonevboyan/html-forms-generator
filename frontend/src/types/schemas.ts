export interface SelectOption {
  value: string | number;
  label: string;
}

export interface BaseSchemaEntry {
  type: string;
  label?: string;
  hint?: string;
  position: number;
  [key: string]: any;
}

export interface SelectSchemaEntry extends BaseSchemaEntry {
  type: 'select';
  options: SelectOption[];
  placeholder?: string;
}

export interface SchemaSchemaEntry extends BaseSchemaEntry {
  type: 'schema';
  schema: Schema;
}

export type SchemaEntry = BaseSchemaEntry | SelectSchemaEntry | SchemaSchemaEntry;

export interface Schema {
  [key: string]: SchemaEntry;
} 