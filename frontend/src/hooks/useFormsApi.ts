import { useAuth } from './useAuth';
import { API_URL } from '../config';

export const useFormsApi = () => {
  const { token } = useAuth();

  const getForms = async () => {
    const res = await fetch(`${API_URL}/forms`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };

  const createForm = async (title: string, schema: any) => {
    const res = await fetch(`${API_URL}/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, schema }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to create form');
    return res.json();
  };

  const updateForm = async (id: string, title: string, schema: any) => {
    const res = await fetch(`${API_URL}/forms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, schema }),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to update form');
    return res.json();
  };

  const deleteForm = async (id: string) => {
    const res = await fetch(`${API_URL}/forms/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete form');
    return res.json();
  };

  const generateForm = async (schema: any) => {
    const res = await fetch(`${API_URL}/forms/generate-form`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(schema),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to generate form');
    return res.text();
  };

  return { getForms, createForm, updateForm, deleteForm, generateForm };
}; 