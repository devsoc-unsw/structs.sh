import React, { useCallback, useState } from 'react';
import {
    Card,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Button,
    Theme,
    useTheme,
    Box,
    Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { red, green } from '@mui/material/colors';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { TrueFalseQuiz } from 'utils/apiRequests';
import BaseQuiz from '../BaseQuiz';
import { Notification } from 'utils/Notification';

interface Props {
    quiz: TrueFalseQuiz;
    questionNumber: number;
}

const TrueFalse = ({ quiz, questionNumber }) => {
    const { isTrue, correctMessage, incorrectMessage, explanation } = quiz;
    const theme: Theme = useTheme();
    const [response, setResponse] = useState<0 | 1 | 2>(0); // 3-state boolean where 0 is indeterminate, 1 is true, 2 is false
    const [submitted, setSubmitted] = useState(false);
    const [answeredCorrect, setAnsweredCorrect] = useState(false);

    const submitQuestion = useCallback(() => {
        if (response === 0) {
            Notification.error('Please select either true or false');
            return;
        }
        setSubmitted(true);

        if ((isTrue && response === 1) || (!isTrue && response === 2)) {
            setAnsweredCorrect(true);
        } else {
            setAnsweredCorrect(false);
        }
    }, [response]);

    return (
        <BaseQuiz quiz={quiz} questionNumber={questionNumber}>
            <FormControl>
                <FormLabel>Choose one</FormLabel>
                <RadioGroup>
                    <FormControlLabel
                        disabled={submitted}
                        control={<Radio />}
                        label={'True'}
                        checked={response === 1}
                        onClick={() => setResponse(1)}
                    />
                    <FormControlLabel
                        disabled={submitted}
                        control={<Radio />}
                        label={'False'}
                        checked={response === 2}
                        onClick={() => setResponse(2)}
                    />
                </RadioGroup>
            </FormControl>
            {submitted && (
                <Box>
                    {answeredCorrect ? (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 1,
                                background: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {correctMessage}
                        </Alert>
                    ) : (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 1,
                                background: theme.palette.background.paper,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {incorrectMessage}
                        </Alert>
                    )}
                    <Alert
                        severity="info"
                        sx={{
                            background: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                        }}
                    >
                        {explanation}
                    </Alert>
                </Box>
            )}
            {!submitted && (
                <Box>
                    <Button
                        variant="contained"
                        color={'primary'}
                        onClick={() => submitQuestion()}
                        className="button-spacing"
                    >
                        Submit
                    </Button>
                </Box>
            )}
        </BaseQuiz>
    );
};

export default TrueFalse;
