import {
    Button,
    Card,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    RadioGroup,
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './Quiz.scss';

function CheckCorrect(props) {
    // Check if all correct
    let correct = true;
    props.info.correctAnswers.forEach((ans) => {
        if (!props.selectedAnswers.includes(ans.toString())) {
            correct = false;
        }
    });
    props.selectedAnswers.forEach((ans) => {
        if (!props.info.correctAnswers.includes(parseInt(ans))) {
            correct = false;
        }
    });

    if (props.submitted && correct) {
        return (
            <>
                <CheckCircleIcon style={{ color: green[500] }} />
                <br /> <br />
                <i>
                    <h4>{props.info.correctAnswerMessage}</h4>
                    <h4>
                        <i></i>
                        {props.info.explanation}
                    </h4>
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

const MultiChoiceQuestion = (props) => {
    const [value, setValue] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        console.log(event.target.id);
        console.log(event.target.checked);

        if (submitted === false) {
            if (event.target.checked) {
                if (value.includes(event.target.id)) return;
                let newResponses = value;
                newResponses.push(event.target.id);
                setValue(newResponses);
            } else {
                if (!value.includes(event.target.id)) return;
                let newResponses = value;
                newResponses.splice(newResponses.indexOf(event.target.id), 1);
                setValue(newResponses);
            }
            console.log(value);
        }
    };

    return (
        <div>
            <Card raised className="card-spacing">
                <h2>
                    <strong>{props.info.question}</strong>
                </h2>
                <DisplayCode code={props.info.code} />
                <br />
                <FormControl>
                    <FormLabel>Choose multiple</FormLabel>
                    <RadioGroup value={value}>
                        {props.info.answers.map((answer, idx) => {
                            return (
                                <FormControlLabel
                                    value={(idx + 1).toString()}
                                    disabled={submitted}
                                    control={
                                        <Checkbox
                                            id={(idx + 1).toString()}
                                            onChange={handleChange}
                                        />
                                    }
                                    label={answer}
                                />
                            );
                        })}
                    </RadioGroup>
                </FormControl>
                <CheckCorrect submitted={submitted} selectedAnswers={value} info={props.info} />
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

export default MultiChoiceQuestion;
