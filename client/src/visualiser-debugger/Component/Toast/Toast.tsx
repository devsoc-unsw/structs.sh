import React, { useEffect } from 'react';
import { Alert, AlertProps } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStateStore } from '../../Store/toastStateStore';

const Toast: React.FC = () => {
  const currentMessage = useToastStateStore((state) => state.currentToastMessage);
  const clearMessage = useToastStateStore((state) => state.clearToastMessage);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentMessage) {
      timer = setTimeout(() => {
        clearMessage();
      }, currentMessage.durationMs);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentMessage, clearMessage]);

  const getSeverity = (colorTheme: string): AlertProps['severity'] | undefined => {
    switch (colorTheme) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return undefined; // No severity for custom colors
    }
  };

  return (
    <AnimatePresence>
      {currentMessage && (
        <motion.div
          style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <Alert
            severity={getSeverity(currentMessage.colorTheme)}
            onClose={clearMessage}
            style={{
              backgroundColor:
                typeof currentMessage.colorTheme === 'string' &&
                !['info', 'warning', 'error'].includes(currentMessage.colorTheme)
                  ? currentMessage.colorTheme
                  : undefined,
            }}
          >
            {currentMessage.content}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
