import React, { FC, useState } from 'react';
import { Box, Collapse, useTheme } from '@mui/material';
import FloatingWindow from 'components/FloatingWindow/FloatingWindow';

interface Props {}

const CodeSnippet: FC<Props> = () => (
  <FloatingWindow flexDirection="row-reverse" minHeight="30vh">
    <Box id="code-container">
      <svg id="code-canvas" />
    </Box>
  </FloatingWindow>
);

export default CodeSnippet;
