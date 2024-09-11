// DynamicBox.tsx
import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface DynamicBoxProps {
  children: ReactNode;
  sx?: object;
}

const DynamicBox: React.FC<DynamicBoxProps> = ({ children, sx }) => {
  return <Box sx={{ border: '1px solid black', padding: '8px', ...sx }}>{children}</Box>;
};

export default DynamicBox;
