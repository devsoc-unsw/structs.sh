import React, { FC } from 'react';
import AceEditor from "react-ace";
import { socket } from 'utils/socket';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';
import 'styles/CodeEditor.css';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-github'

const CodeEditor: FC = () => {
  const placeholder = '// Code your stuff below!';
  const [code, setCode] = React.useState(localStorage.getItem("code") || placeholder);

  const handleChange = (newCode: string) => {
    localStorage.setItem("code", newCode)
    setCode(newCode);
  }

  const sendCode = () => {
    socket.emit('mainDebug', code);
  };

  return (
    <>
      <AceEditor value={code} onChange={handleChange} height="100%" width="100%" mode="c_cpp" theme="github"/>
      {/* <CodeMirror */}
      {/*   value={code} */}
      {/*   height="100%" */}
      {/*   extensions={[cpp()]} */}
      {/*   onChange={onChange} */}
      {/*   theme="light" */}
      {/* /> */}
      <Button onClick={sendCode} variant="contained" endIcon={<UploadIcon />}>
        Run
      </Button>
    </>
  );
};

export default CodeEditor;
