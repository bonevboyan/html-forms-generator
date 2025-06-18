import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
} from '@mui/material';
import SchemaBuilder from './components/SchemaBuilder';
import GeneratedForm from './components/GeneratedForm';

function App() {
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
            <SchemaBuilder 
              onFormGenerated={setGeneratedHtml}
              onLoadingChange={setLoading}
              onErrorChange={setError}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <GeneratedForm
              generatedHtml={generatedHtml}
              loading={loading}
              error={error}
              onReset={handleReset}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
