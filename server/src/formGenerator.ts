import { Schema, SchemaEntry } from './types'

function generateLabel(name: string, label?: string): string {
  const fieldName = name.split('[').pop()?.replace(']', '') || name
  const labelText = label || fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
  return `<label for="${name}">${labelText}</label>`
}

function generateHint(hint: string): string {
  return `<div style="margin-top: -0.5rem; margin-bottom: 1rem; font-style: italic; color: #666;">Hint: ${hint}</div>`
}

function generateInput(name: string, entry: SchemaEntry): string {
  const { type, label, hint, ...attributes } = entry
  const attrs = Object.entries(attributes)
    .filter(([key]) => !['schema', 'options', 'placeholder'].includes(key))
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

  let input = ''
  switch (type) {
    case 'select':
      const selectEntry = entry as any
      const options = selectEntry.options.map((opt: any) => {
        // Handle both old tuple format and new SelectOption format
        if (Array.isArray(opt)) {
          return `<option value="${opt[0]}">${opt[1]}</option>`
        }
        return `<option value="${opt.value}">${opt.label}</option>`
      }).join('')
      const placeholder = selectEntry.placeholder ? 
        `<option value="">${selectEntry.placeholder}</option>` : ''
      input = `<select name="${name}" id="${name}" ${attrs} style="max-width: 400px;">${placeholder}${options}</select>`
      break
    case 'textarea':
      input = `<textarea name="${name}" id="${name}" ${attrs} style="max-width: 400px;"></textarea>`
      break
    default:
      input = `<input type="${type}" name="${name}" id="${name}" ${attrs} style="max-width: 400px;">`
  }

  return `
    <div>
      ${generateLabel(name, label)}
      ${input}
      ${hint ? generateHint(hint) : ''}
    </div>
  `
}

function generateFieldset(name: string, schema: Schema): string {
  const legend = name.charAt(0).toUpperCase() + name.slice(1)
  const fields = Object.entries(schema)
    .map(([fieldName, entry]) => generateFormField(`${name}[${fieldName}]`, entry))
    .join('\n')

  return `
    <fieldset>
      <legend>${legend}</legend>
      ${fields}
    </fieldset>
  `
}

function generateFormField(name: string, entry: SchemaEntry): string {
  if (entry.type === 'schema') {
    return generateFieldset(name, (entry as any).schema)
  }
  return generateInput(name, entry)
}

export function generateForm(schema: Schema): string {
  return Object.entries(schema)
    .map(([name, entry]) => generateFormField(name, entry))
    .join('\n')
} 