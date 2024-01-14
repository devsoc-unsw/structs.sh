import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface Props {
  fullViewport?: boolean;
}

const LineLoader: React.FC<Props> = ({ fullViewport = false }) => (
  <Box
    position="relative"
    height={fullViewport ? '100vh' : '100%'}
    width={fullViewport ? '100vw' : '100%'}
  >
    <LinearProgress
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        margin: '0 auto',
      }}
    />
  </Box>
);

export default LineLoader;
