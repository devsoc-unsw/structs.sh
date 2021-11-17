import React, { useState } from 'react';
import { Card, TextField, Button } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import { yellow } from '@material-ui/core/colors';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './Quiz.scss';

function CheckCorrect(props) {
    if (props.submitted) {
        return (
            <>
                <br />
                <ErrorIcon style={{ color: yellow[800] }} />
                <h4>
                    <i>{props.info.answerMessage}</i>
                </h4>
                <h4>
                    <i>{props.info.explanation}</i>
                </h4>
            </>
        );
    } else {
        return <></>;
    }
}

function DisplayCode(props) {
    let codeString = '';
    props.code.forEach((line, idx) => {
        if (idx === 0) {
            codeString = '';
        }
        if (idx === props.info.code.length - 1) {
            codeString += line;
        } else {
            codeString += line + '\n';
        }
    });

    if (codeString === '') {
        return <></>;
    } else {
        return (
            <SyntaxHighlighter language="c" style={docco} showLineNumbers={true} wrapLines={true}>
                {codeString}
            </SyntaxHighlighter>
        );
    }
}

const OpenResponseQuestion = (props) => {
    const [submitted, setSubmitted] = useState(false);

    return (
        <div>
            <Card raised className="card-spacing">
                <h2>
                    <strong>{props.info.question}</strong>
                </h2>
                <DisplayCode code={props.info.code} />
                <br />
                <TextField
                    multiline
                    fullWidth
                    disabled={submitted}
                    rows={3}
                    maxRows={8}
                    variant="outlined"
                    label="Enter response"
                />
                <br />
                <CheckCorrect submitted={submitted} info={props.info} />
                <br />
                <Button
                    variant="contained"
                    color={'primary'}
                    onClick={() => setSubmitted(true)}
                    className="button-spacing"
                >
                    Check
                </Button>
            </Card>
        </div>
    );
};

export default OpenResponseQuestion;
