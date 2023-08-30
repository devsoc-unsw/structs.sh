import React, { FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
// import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import 'styles/CodeEditor.css';

const CodeEditor: FC = () => {
  const placeholder = "// Code your stuff below!";
  const [code, setCode] = React.useState(placeholder);

  const onChange = React.useCallback((value) => {
    console.log('value:', value);
    setCode(value);
  }, []);

  const sendCode = ( ) => {
    console.log('codeSent:', code);
  }

  return (
    <CodeMirror
      value={placeholder}
      height="100%"
      extensions={[cpp()]}
      onChange={onChange}
      theme="dark"
    />
  );
};

export default CodeEditor;
