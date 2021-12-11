import BaseQuiz from '../BaseQuiz';
import {
    Alert,
    Box,
    Button,
    Card,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Theme,
    Typography,
    useTheme,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React, { FC, useCallback, useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { MultipleChoiceQuiz, Quiz } from 'utils/apiRequests';
import { HorizontalRule } from 'components/HorizontalRule';
import { MarkdownEditor } from 'components/MarkdownEditor';
import { Notification } from 'utils/Notification';

interface Props {
    quiz: MultipleChoiceQuiz;
    questionNumber: number;
}

const MultiChoiceQuestion: FC<Props> = ({ quiz, questionNumber }) => {
    const {
        question,
        description,
        choices,
        answers,
        maxSelections,
        correctMessage,
        incorrectMessage,
        explanation,
    } = quiz;

    const theme: Theme = useTheme();
    const [responses, setResponses] = useState<boolean[]>(Array(choices.length).fill(false));
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [result, setResult] = useState<'incorrect' | 'correct' | 'partial'>();

    const toggleChoice = useCallback(
        (i: number) => {
            if (!(i >= 0 && i < responses.length)) {
                Notification.error('Invalid choice');
                return;
            }
            const responsesCopy = [...responses];
            responsesCopy[i] = !responsesCopy[i];
            setResponses(responsesCopy);
        },
        [responses]
    );

    const submitQuestion = useCallback(() => {
        if (getNumSelected() > maxSelections) {
            Notification.error('Too many selections');
            return;
        }
        if (getNumSelected() <= 0) {
            Notification.error('Please select at least 1 choice');
            return;
        }
        if (responses.length !== answers.length) {
            Notification.error(
                'Mismatch between choices/responses and answers. Please report this issue'
            );
        }

        setSubmitted(true);

        // Compare `responses` and `answers` array
        for (let i = 0; i < answers.length; ++i) {
            if (responses[i] !== answers[i]) {
                Notification.error('Incorrect');
                setResult('incorrect');
            }
        }

        Notification.success('Well done!');
        setResult('correct');
    }, [responses]);

    // Determines the number of responses the user has selected so far
    const getNumSelected = useCallback(
        () =>
            Number(
                responses &&
                    responses.reduce(
                        (numSelected, currIsSelected) =>
                            numSelected + Number(currIsSelected ? 1 : 0),
                        0
                    )
            ),
        [responses]
    );

    return (
        <BaseQuiz quiz={quiz} questionNumber={questionNumber}>
            <FormControl>
                <FormLabel>
                    {maxSelections === 1
                        ? 'Select one response'
                        : `Select up to ${maxSelections} responses`}
                </FormLabel>
                {choices.map((choice, i) => {
                    return (
                        <FormControlLabel
                            value={i}
                            disabled={
                                submitted || (getNumSelected() >= maxSelections && !responses[i])
                            }
                            sx={{
                                background:
                                    submitted &&
                                    (answers[i]
                                        ? 'rgba(0, 255, 59, 0.55)'
                                        : 'rgba(252, 113, 122, 0.55)'),
                                borderRadius: '20px',
                                mt: 1,
                                mb: 1,
                                pr: 2,
                                transition: '0.4s all ease-in-out',
                            }}
                            checked={responses[i]}
                            label={choice}
                            control={<Radio onClick={() => toggleChoice(i)} />}
                        />
                    );
                })}
            </FormControl>
            {submitted && (
                <Box sx={{ mb: 1 }}>
                    {result === 'correct' && (
                        <>
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
                        </>
                    )}
                    {result === 'incorrect' && (
                        <>
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
                        </>
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
                    <Button variant="contained" color="primary" onClick={() => submitQuestion()}>
                        Submit
                    </Button>
                </Box>
            )}
        </BaseQuiz>
    );
};

export default MultiChoiceQuestion;
