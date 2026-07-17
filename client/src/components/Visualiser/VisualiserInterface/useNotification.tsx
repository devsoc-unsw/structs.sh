import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';

export function useNotification() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  const showNotification = (newMessage: string, newSeverity: 'success' | 'error') => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  };

  const Notification = () => (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      onClose={() => setOpen(false)}
      autoHideDuration={1500}
    >
      <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );

  return { showNotification, Notification };
}
