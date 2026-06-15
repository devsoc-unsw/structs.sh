// DynamicTab.tsx
import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface DynamicTabProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

const DynamicTab: React.FC<DynamicTabProps> = ({ children, style }) => (
  <Box sx={{ border: '1px solid black', padding: '8px' }} style={style}>
    {children}
  </Box>
);

export default DynamicTab;
