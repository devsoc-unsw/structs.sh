import React, { FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
// import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import StackInspector from './StackInspector';

// replace with websocket data once backend up and running
const sampleData = [
  {
    name: 'a',
    type: 'int',
    value: '3',
  },
  {
    name: 'c',
    type: 'int',
    value: '104',
  },
  {
    name: 'b',
    type: 'int [4]',
    value: '{9, 6, 3, 2}',
  },
  {
    name: 'foo',
    type: 'int *',
    value: '0x5555555592a0',
  },
  {
    name: 'z',
    type: 'int',
    value: '0',
  },
];

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
		<>
			<div>Hello, world!</div>
			<CodeMirror
        value={placeholder}
        height="200px"
        extensions={[cpp()]}
        onChange={onChange}
      />
      <Button onClick={sendCode} variant="contained" endIcon={<SendIcon />}>
        Send Code
      </Button>
      <StackInspector debuggerData={sampleData} />
		</>
	);
}

export default CodeEditor;
