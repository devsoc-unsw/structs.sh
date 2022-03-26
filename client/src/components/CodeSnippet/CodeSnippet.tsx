import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  code: string[];
}
  
const CodeSnippet: FC<Props> = ({code}) => {
  return (
    <Box sx={{ padding: 2 }}>
      {code.map((line, i) => {
        return <Typography color="textPrimary" sx={{ 'white-space': 'pre-wrap', fontFamily: 'CodeText' }}>{line}</Typography>
      })}
    </Box>
  );
};

export default CodeSnippet;