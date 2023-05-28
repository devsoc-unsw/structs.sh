import React, { FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
// import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { TopNavbar } from 'components/Navbars';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const CodeEditor: FC = () => {
  const placeholder = "// Code your stuff below!";
  const [code, setCode] = React.useState(placeholder);
  const [stdout, setStdout] = React.useState('');
  const [input, setInput] = React.useState('');
  const [history, setHistory] = React.useState('');
  const [count, setCount] = React.useState(0);

  const onEditorChange = React.useCallback((value: React.SetStateAction<string>) => {
    console.log('value:', value);
    setCode(value);
  }, []);

  const onInputChange = React.useCallback((event: { target: { value: React.SetStateAction<string>; }; }) => {
    console.log('Input:', event.target.value);
    setInput(event.target.value);
  }, []);

  const runCode = ( ) => {
    console.log('codeSent:', code);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'C', code: code })
    };

    fetch('https://online-debugger-api.onrender.com/compile', requestOptions)
        .then(response => response.json())
        .then(data => {
          setStdout(data.stdout)
          setCount(count + 1)
          setHistory(`[${count}] ` + '$ \t' + data.stdout + '\n' + history)
        });
    
    console.log(stdout);
  }

	return (
		<>
      <TopNavbar/>
      <div style={{marginTop: '5rem', marginLeft: '1rem', marginRight: '1rem'}}>
        <CodeMirror
          value={placeholder}
          height='200px'
          extensions={[cpp()]}
          onChange={onEditorChange}
        />
        <Button onClick={runCode} variant='contained' endIcon={<SendIcon />} style={{marginTop: '1rem'}}>
          Run Code
        </Button>

        <TextField
          fullWidth
          label='Input'
          multiline
          rows={4}
          placeholder='Type your input here..'
          style={{display: 'block', marginTop: '3rem'}}
          onChange={onInputChange}
          value={input}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              runCode();
            }
          }}
        />
        <Box
          component="div"
          sx={{
            whiteSpace: 'pre-wrap',
            overflowX: 'auto',
            height: '10rem',
            my: 2,
            p: 1,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#101010' : '#61729F',
              // theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.300' : '#FFFFFF',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',
          }}
        >
          Output: {'\n'}
          {history}
        </Box>
      </div>
		</>
	);
};

export default CodeEditor;
