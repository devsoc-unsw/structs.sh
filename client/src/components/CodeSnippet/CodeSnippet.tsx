import React, { FC } from 'react';
import { Box } from '@mui/material';

interface Props {}

const CodeSnippet: FC<Props> = () => (
  <Box
    sx={{
      background: '#14113C',
      overflowY: 'auto',
      position: 'absolute',
      right: '0',
      minHeight: '40vh',
      bottom: '7vh',
      padding: 2,
      minWidth: '30vw',
    }}
  >
    <svg id="code-canvas" />
  </Box>
);

export default CodeSnippet;
