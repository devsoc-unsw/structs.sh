import { Button, useTheme } from '@mui/material';
import Editor, { loader } from '@monaco-editor/react';
import monokai from 'monaco-themes/themes/Monokai.json';
import githubDark from 'monaco-themes/themes/GitHub Dark.json';
import { Box } from '@mui/system';
import Console from './Console';
import BuildIcon from '@mui/icons-material/Build';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const Debugger = () => {
  const theme = useTheme();
  loader.init().then((monaco) => {
    monaco.editor.defineTheme('monokai', monokai);
    monaco.editor.defineTheme('githubDark', githubDark);
  });
  return (
    <Box
      // position="absolute"
      // width="40vw"
      // height="100vh"
      // right={0}
      // top={0}
      width="40vw"
      height="100vh"
      bgcolor={theme.palette.background.default}
      zIndex="1000"
    >
      <Box display="flex" gap={2} paddingLeft={2} paddingBottom={1} paddingTop={1}>
        <Button variant="contained">
          <BuildIcon />
          Compile
        </Button>
        <Button variant="contained">
          <PlayArrowIcon />
          Visualise
        </Button>
      </Box>
      <Box display="flex" flexDirection="column">
        <Editor language="c" theme="githubDark" height="60vh" />
        <Console />
      </Box>
    </Box>
  );
};

export default Debugger;
