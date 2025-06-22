import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Paper, Tooltip, CircularProgress, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import { useFormsApi } from '../hooks/useFormsApi';

const MyForms: React.FC = () => {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const { getForms, deleteForm } = useFormsApi();

  const fetchForms = async () => {
    setLoading(true);
    const data = await getForms();
    setForms(data);
    setLoading(false);
  };

  useEffect(() => { 
    fetchForms(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this form?')) return;
    await deleteForm(id);
    setSnackbar('Form deleted');
    fetchForms();
  };

  const handleShare = (publicId: string) => {
    const url = `${window.location.origin}/form/${publicId}`;
    navigator.clipboard.writeText(url);
    setSnackbar('Share link copied!');
  };

  if (loading) return <Box sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" mb={2}>My Forms</Typography>
      {forms.length === 0 && <Typography>No forms yet.</Typography>}
      {forms.map(form => (
        <Paper key={form.id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography fontWeight={600}>{form.title}</Typography>
            <Typography variant="body2" color="text.secondary">ID: {form.id}</Typography>
          </Box>
          <Box>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleDelete(form.id)}><DeleteIcon /></IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton onClick={() => handleShare(form.publicId)}><ShareIcon /></IconButton>
            </Tooltip>
          </Box>
        </Paper>
      ))}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={2000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </Box>
  );
};

export default MyForms;