import React, { FC, useState, useContext } from 'react';
import { Box, Collapse, useTheme } from '@mui/material';
import FloatingWindow from 'components/FloatingWindow/FloatingWindow';
import VisualiserContext from 'components/Visualiser/VisualiserContext';

interface Props {}

const CodeSnippet: FC<Props> = () => {
  const {
    codeSnippet: { isCodeSnippetExpanded, handleSetCodeSnippetExpansion },
  } = useContext(VisualiserContext);
  const handleToggleExpansion = () => {
    handleSetCodeSnippetExpansion(!isCodeSnippetExpanded);
  };
  return (
    <FloatingWindow
      flexDirection="row-reverse"
      minHeight="30vh"
      isExpanded={isCodeSnippetExpanded}
      handleToggleExpansion={handleToggleExpansion}
    >
      <Box id="code-container">
        <svg id="code-canvas" />
      </Box>
    </FloatingWindow>
  );
};

export default CodeSnippet;
