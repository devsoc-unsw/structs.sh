import React, { FC, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  code: string[];
  currentLine: number;
}
  
const CodeSnippet: FC<Props> = ({code, currentLine}) => {
  useEffect(() => {
    console.log("rerender");
  }, [currentLine]);

  return (
    <div key={currentLine}>
      <Box sx={{ padding: 2 }}>
        {code.map((line, i) => {
          if (i === currentLine) {
            return <Typography color="textPrimary" sx={{ 'white-space': 'pre-wrap', fontFamily: 'CodeText', 'background-color': '#4beb9b' }}>{line}</Typography>
          }

          return <Typography color="textPrimary" sx={{ 'white-space': 'pre-wrap', fontFamily: 'CodeText' }}>{line}</Typography>
          
        })}
      </Box>
    </div>
  );
};

export default CodeSnippet;