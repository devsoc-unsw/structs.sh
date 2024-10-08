// DynamicBox.tsx
import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface DynamicTabProps {
  children: ReactNode;
  sx?: object;
}

const DynamicTab: React.FC<DynamicTabProps> = ({ children, sx }) => {
  return <Box sx={{ border: '1px solid black', padding: '8px', ...sx }}>{children}</Box>;
};

export default DynamicTab;
