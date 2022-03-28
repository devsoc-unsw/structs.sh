import React, { FC, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  code: string[];
  currentLine: number;
}
  
const CodeSnippet: FC<Props> = ({code, currentLine}) => {
  return (
    <div
      id="code-canvas"
      style={{ height: '100%', width: '100%', background: 'rgba(235, 235, 235)' }}
    />
  );
};

export default CodeSnippet;