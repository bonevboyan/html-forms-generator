import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';

interface GeneratedFormProps {
  generatedHtml: string;
  loading: boolean;
  onReset: () => void;
}

const GeneratedForm: React.FC<GeneratedFormProps> = ({
  generatedHtml,
  loading,
  onReset,
}) => {
  const [showCopied, setShowCopied] = useState<boolean>(false);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generatedHtml);
    setShowCopied(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Generated Form
        </Typography>
        <Box>
          <Tooltip title="Copy HTML">
            <IconButton 
              onClick={handleCopyHtml} 
              color="primary"
              disabled={!generatedHtml}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset">
            <IconButton 
              onClick={onReset} 
              color="secondary"
              disabled={!generatedHtml}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ p: 3, position: 'relative' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && generatedHtml && (
          <Box
            sx={{
              '& label': { display: 'block', mb: 1 },
              '& input, & select, & textarea': {
                width: 'calc(100% - 16px)',
                maxWidth: '500px',
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
                maxWidth: '500px',
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
                maxWidth: '500px',
              },
            }}
            dangerouslySetInnerHTML={{ __html: generatedHtml }}
          />
        )}

        {!loading && !generatedHtml && (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <Typography>
              Build your form schema on the left and click "Generate Form" to see the result here.
            </Typography>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={showCopied}
        autoHideDuration={3000}
        onClose={() => setShowCopied(false)}
        message="HTML copied to clipboard"
      />
    </Box>
  );
};

export default GeneratedForm; 