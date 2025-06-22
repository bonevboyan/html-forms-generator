import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { API_URL } from '../config';

interface FormData {
  id: string;
  title: string;
  publicId: string;
  html: string;
}

const SharedForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Fetch the form data
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get<FormData>(`${API_URL}/forms/public/${formId}`);
        setFormData(response.data);
      } catch (err) {
        console.error('Error fetching form:', err);
        setError('Form not found or could not be loaded');
      } finally {
        setLoading(false);
      }
    };

    if (formId) {
      fetchForm();
    }
  }, [formId]);

  // Add event handlers once when HTML is rendered
  useEffect(() => {
    if (formData?.html && formContainerRef.current) {
      // First render the HTML
      formContainerRef.current.innerHTML = formData.html;

      // Then attach event handlers to all form inputs
      const inputs = formContainerRef.current.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const handleChange = (e: Event) => {
          const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
          console.log('Input change:', { name: target.name, value: target.value });
          setFormValues(prev => ({
            ...prev,
            [target.name]: target.value
          }));
        };

        input.addEventListener('change', handleChange);
        input.addEventListener('input', handleChange);
      });
    }
  }, [formData?.html]); // Only run when HTML changes

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData) return;

    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await axios.post(`${API_URL}/forms/public/${formData.publicId}/submit`, {
        response: formValues
      });
      setSubmitSuccess(true);
      setSubmitted(true);
      setFormValues({});
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitError('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ my: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading form...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Go Home
        </Button>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="body1" paragraph>
            Your response has been successfully submitted.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
            >
              Return Home
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {formData?.title || 'Shared Form'}
        </Typography>
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>{submitError}</Alert>
        )}
        
        <form id="shared-form" onSubmit={handleSubmit}>
          <Box sx={{ 
            '& .form-group': { mb: 3 },
            '& label': { 
              display: 'block', 
              mb: 1, 
              fontWeight: 'medium' 
            },
            '& .form-control': { 
              width: '100%', 
              p: 1.5, 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '1rem'
            },
            '& .form-hint': { 
              mt: 0.5, 
              fontSize: '0.875rem', 
              color: 'text.secondary', 
              fontStyle: 'italic' 
            } 
          }}>
            <div ref={formContainerRef} />
          </Box>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={submitSuccess}
        autoHideDuration={6000}
        onClose={() => setSubmitSuccess(false)}
        message="Form submitted successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default SharedForm;
