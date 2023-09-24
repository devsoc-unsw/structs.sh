import React, { FC } from 'react';
import AceEditor, { IMarker } from 'react-ace';
import { socket } from 'utils/socket';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';
import 'styles/CodeEditor.css';

import 'ace-builds/src-noconflict/mode-c_cpp';

const CodeEditor = ({ currLine }: { currLine: number }) => {
  const placeholder = '// Code your stuff below!';
  const [code, setCode] = React.useState(localStorage.getItem('code') || placeholder);

  const markers: IMarker[] = [
    {
      startRow: currLine - 1,
      startCol: 0,
      endRow: currLine - 1,
      endCol: 100,
      className: 'current-line-marker',
      type: 'fullLine',
    },
  ];

  const handleChange = (newCode: string) => {
    localStorage.setItem('code', newCode);
    setCode(newCode);
    console.log(currLine);
  };

  const sendCode = () => {
    socket.emit('mainDebug', code);
  };

  return (
    <>
      <AceEditor
        value={code}
        onChange={handleChange}
        height="100%"
        width="100%"
        mode="c_cpp"
        markers={markers}
      />
      <Button onClick={sendCode} variant="contained" endIcon={<UploadIcon />}>
        Run
      </Button>
    </>
  );
};

export default CodeEditor;
