import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { testCaseFeedback } from './APIcaller'

// Import required Ace modules / themes
import 'ace-builds/src-noconflict/mode-javascript'; // language mode for JavaScript
import 'ace-builds/src-noconflict/theme-monokai'; // theme
import "ace-builds/src-noconflict/ext-language_tools";



type TestCase = {
    input: any;
    expectedOutput: any;
};

type TestResult = {
    input: any;
    expected: any;
    actual: any;
    passed: boolean;
};

//  a type for the result state
type ResultState = {
    testResults?: Array<{
        input: any;
        expected: any;
        actual: any;
        passed: boolean;
    }>;
    globalError?: string | null;
    feedback?: string;
};


const executeCode = (code:string, testCases: TestCase[]) => {
    let results:any = [];
    let globalError = null;

  
    testCases.forEach(testCase => {
        try {
            const fullCode = `${code}\nreturn myQuizFunction(${JSON.stringify(testCase.input)});`;
            const myQuizFunction = new Function(fullCode);
            const result = myQuizFunction();

            if (JSON.stringify(result) === JSON.stringify(testCase.expectedOutput)) {
                results.push({ input: testCase.input, expected: testCase.expectedOutput, actual: result, passed: true });
            } else {
                results.push({ input: testCase.input, expected: testCase.expectedOutput, actual: result, passed: false });
            }
        } catch (err) {
            if (err instanceof Error) {
                globalError = err.message;
                results.push({ input: testCase.input, expected: testCase.expectedOutput, actual: 'Error: ' + err.message, passed: false });
            } else {
                globalError = 'An unknown error occurred';
                results.push({ input: testCase.input, expected: testCase.expectedOutput, actual: 'Unknown Error', passed: false });
            }
        }
    });
  
    return { results, globalError };
};

const CodeEditor = ({ questionText, onCodeSubmit, testCases }: { questionText: string, onCodeSubmit: (code: string, testCases: TestCase[]) => void, testCases: TestCase[] }) => {
    const [code, setCode] = useState('');
    const [result, setResult] = useState<ResultState | null>(null);
  
    const handleCodeChange = (newValue: string) => {
      setCode(newValue);
    };
  
    const handleSubmit = async () => {
        const { results, globalError } = executeCode(code, testCases);
        let failedTest = results.find((test:TestResult) => !test.passed);
    
        if (failedTest) {
            const feedback = await testCaseFeedback(questionText, code, testCases);
            setResult({ testResults: results, globalError, feedback });
        } else if (globalError) {
            setResult({ globalError });
        } else {
            setResult({ testResults: results });
        }
    
        onCodeSubmit(code, testCases);
    };
    
  
    return (
        <div>
            <AceEditor
                mode="javascript"
                theme="monokai"
                name="codeEditor"
                onChange={handleCodeChange}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={code}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
            <button onClick={handleSubmit}>Submit</button>
            {result && (
                <div>
                    {result.globalError ? (
                        <p>Error: {result.globalError}</p>
                    ) : (
                        <div>
                            {result.testResults?.map((testResult, index) => (
                                <p key={index}>
                                    Test {index + 1} ({JSON.stringify(testResult.input)}): {testResult.passed ? 'Passed' : 'Failed - Expected: ' + JSON.stringify(testResult.expected) + ', Got: ' + JSON.stringify(testResult.actual)}
                                </p>
                            ))}
                        </div>
                    )}
                    {result.feedback && (
                        <div>
                            <h3>AI-generated Feedback for Failed Test Case:</h3>
                            <p>{result.feedback}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
    
};

export default CodeEditor;
