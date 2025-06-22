import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { useFormsApi } from '../hooks/useFormsApi';

interface Response {
  id: string;
  formId: string;
  response: Record<string, any>;
  createdAt: string;
}

const FormResponses: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [form, setForm] = useState<any>(null);
  const { getForm, getResponses } = useFormsApi();

  useEffect(() => {
    let mounted = true;

    const fetchResponses = async () => {
      if (!formId) return;

      try {
        setLoading(true);
        // Fetch form details and responses in parallel for better performance
        const [formData, responsesData] = await Promise.all([
          getForm(formId),
          getResponses(formId)
        ]);
        
        if (!mounted) return;
        
        setForm(formData);
        setResponses(responsesData);
      } catch (err) {
        console.error('Error fetching responses:', err);
        if (mounted) {
          setError('Failed to load responses');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchResponses();

    return () => {
      mounted = false;
    };
  }, [formId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  // Get all unique fields from responses
  const fields = new Set<string>();
  responses.forEach(response => {
    Object.keys(response.response).forEach(key => fields.add(key));
  });
  const fieldArray = Array.from(fields);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>{form?.title || 'Form Responses'}</Typography>
      
      <Card sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Response Summary</Typography>
          <Typography variant="h3">{responses.length}</Typography>
          <Typography>Total Responses</Typography>
        </CardContent>
      </Card>

      {responses.length === 0 ? (
        <Alert severity="info">No responses yet</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Submission Date</TableCell>
                {fieldArray.map(field => (
                  <TableCell key={field}>{field}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {responses.map(response => (
                <TableRow key={response.id}>
                  <TableCell>
                    {new Date(response.createdAt).toLocaleDateString()}
                  </TableCell>
                  {fieldArray.map(field => (
                    <TableCell key={field}>
                      {response.response[field] || ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FormResponses;
