import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import SchemaBuilder from './components/SchemaBuilder';
import axios from 'axios';
import { Schema } from './types';

function App() {
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState<boolean>(false);

  const handleSubmit = async (schema: Schema) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<string>('http://localhost:3001/generate-form', schema);
      setGeneratedHtml(response.data);
    } catch (error) {
      console.error('Error generating form:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate form');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generatedHtml);
    setShowCopied(true);
  };

  const handleReset = () => {
    setGeneratedHtml('');
    setError(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          HTML Form Generator
        </Typography>

        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <SchemaBuilder onSubmit={handleSubmit} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, position: 'relative' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                  Generated Form
                </Typography>
                <Box>
                  {generatedHtml && (
                    <>
                      <Tooltip title="Copy HTML">
                        <IconButton onClick={handleCopyHtml} color="primary">
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reset">
                        <IconButton onClick={handleReset} color="secondary">
                          <RefreshIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Box>
              </Box>

              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {!loading && generatedHtml && (
                <Box
                  sx={{
                    '& label': { display: 'block', mb: 1 },
                    '& input, & select, & textarea': {
                      width: '100%',
                      mb: 2,
                      p: 1,
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      '&:focus': {
                        outline: 'none',
                        borderColor: 'primary.main',
                      },
                    },
                    '& fieldset': {
                      border: '1px solid #ccc',
                      p: 2,
                      mb: 2,
                      borderRadius: '4px',
                    },
                    '& legend': {
                      px: 1,
                      color: 'text.secondary',
                    },
                    '& div[class*="hint"]': {
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      mt: -1,
                      mb: 2,
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: generatedHtml }}
                />
              )}

              {!loading && !generatedHtml && !error && (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <Typography>
                    Build your form schema on the left and click "Generate Form" to see the result here.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={showCopied}
        autoHideDuration={3000}
        onClose={() => setShowCopied(false)}
        message="HTML copied to clipboard"
      />
    </Container>
  );
}

export default App;
