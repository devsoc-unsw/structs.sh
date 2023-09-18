import React, { FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
// import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { socket } from 'utils/socket';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';
import 'styles/CodeEditor.css';

const CodeEditor: FC = () => {
  const placeholder = '// Code your stuff below!';
  const [code, setCode] = React.useState(placeholder);

  const onChange = React.useCallback((value) => {
    setCode(value);
  }, []);

  const sendCode = () => {
    socket.send('mainDebug', code);
  };

  return (
    <>
      <CodeMirror
        value={placeholder}
        height="100%"
        extensions={[cpp()]}
        onChange={onChange}
        theme="light"
      />
      <Button onClick={sendCode} variant="contained" endIcon={<UploadIcon />}>
        Run
      </Button>
    </>
  );
};

export default CodeEditor;
