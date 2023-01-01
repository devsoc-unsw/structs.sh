import React, { FC, useState, useContext } from 'react';
import { Box, Collapse, useTheme } from '@mui/material';
import FloatingWindow from 'components/FloatingWindow';
import VisualiserContext from './VisualiserContext';

interface Props {}

/**
 * The floating window where all animation related code snippets are displayed
 */
const CodeSnippet: FC<Props> = () => {
  const {
    codeSnippet: { isCodeSnippetExpanded, handleSetCodeSnippetExpansion },
  } = useContext(VisualiserContext);
  const handleToggleExpansion = () => {
    handleSetCodeSnippetExpansion(!isCodeSnippetExpanded);
  };
  return (
    <Box id="code-container">
      <svg id="code-canvas" />
    </Box>
  );
};

export default CodeSnippet;
