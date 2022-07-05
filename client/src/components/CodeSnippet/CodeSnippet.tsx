import React, { FC, useState } from 'react';
import { Box, Collapse, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FloatingWindow from 'components/FloatingWindow/FloatingWindow';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface Props {}

const CodeSnippet: FC<Props> = () => (
  <FloatingWindow flexDirection="row-reverse" height="40vh">
    <Box id="code-container">
      <svg id="code-canvas" />
    </Box>
  </FloatingWindow>
);

export default CodeSnippet;
