import React, { FC } from 'react';
import { Box } from '@mui/material';

interface Props {}

const CodeSnippet: FC<Props> = () => (
  <Box
    sx={{
      background: '#14113C',
      overflowY: 'scroll',
      position: 'absolute',
      right: '0',
      height: '40%',
      bottom: '10vh',
      padding: 2,
      width: '30vw',
    }}
  >
    <svg id="code-canvas" />
  </Box>
);

export default CodeSnippet;
