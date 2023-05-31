import React, { FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
// import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import StackInspector from './StackInspector';

import dummyData from './dummyData.json';

const sampleData = dummyData;

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
