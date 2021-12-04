import React, { useState } from 'react';
import {
    Card,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { red, green } from '@mui/material/colors';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import './Quiz.scss';

function CheckCorrect(props) {
    if (props.submitted && props.info.correctAnswer.includes(parseInt(props.selectedAnswer))) {
        return (
            <>
                <CheckCircleIcon style={{ color: green[500] }} />
                <br /> <br />
                <i>
                    <h4>{props.info.correctAnswerMessage}</h4>
                    <h4>{props.info.explanation}</h4>
                </i>
            </>
        );
    } else if (props.submitted) {
        return (
            <>
                <CancelIcon style={{ color: red[500] }} />
                <br /> <br />
                <i>
                    <h4>{props.info.incorrectAnswerMessage}</h4>
                    <h4>{props.info.explanation}</h4>
                </i>
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
        if (idx === props.code.length - 1) {
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

const SingleChoiceQuestion = ({ responses, info, setResponse }) => {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        if (submitted === false) {
            setValue(event.target.value);
            let newResponses = responses;
            newResponses[info.questionNum] = event.target.value;
            setResponse(newResponses);
        }
    };

    return (
        <div>
            <Card raised className="card-spacing">
                <h2>
                    <strong>{info.question}</strong>
                </h2>
                <DisplayCode code={info.code} />
                <br />
                <FormControl>
                    <FormLabel>Choose one</FormLabel>
                    <RadioGroup value={value} onChange={handleChange}>
                        {info.answers.map((answer, idx) => {
                            return (
                                <FormControlLabel
                                    value={(idx + 1).toString()}
                                    disabled={submitted}
                                    control={<Radio />}
                                    label={answer}
                                />
                            );
                        })}
                    </RadioGroup>
                </FormControl>
                <CheckCorrect submitted={submitted} selectedAnswer={value} info={info} />
                <br />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSubmitted(true)}
                    className="button-spacing"
                >
                    Check
                </Button>
            </Card>
        </div>
    );
};

export default SingleChoiceQuestion;
