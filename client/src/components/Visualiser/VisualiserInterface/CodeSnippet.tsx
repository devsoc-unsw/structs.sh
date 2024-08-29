import { FC, useContext } from 'react';
import { Box } from '@mui/material';
import FloatingWindow from 'components/FloatingWindow';
import VisualiserContext from './VisualiserContext';

interface CodeSnippetProps {
  isCodeSnippetExpanded: boolean;
  handleSetCodeSnippetExpansion: (val: boolean) => void;
}

/**
 * The floating window where all animation related code snippets are displayed
 */
const CodeSnippet = ({
  isCodeSnippetExpanded,
  handleSetCodeSnippetExpansion,
}: CodeSnippetProps) => {
  // const {
  //   codeSnippet: { isCodeSnippetExpanded, handleSetCodeSnippetExpansion },
  // } = useContext(VisualiserContext);
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
