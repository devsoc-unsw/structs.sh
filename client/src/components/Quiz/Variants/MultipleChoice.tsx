import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  Theme,
  useTheme,
} from '@mui/material';
import React, { FC, useCallback, useState } from 'react';
import { MultipleChoiceQuiz } from 'utils/apiRequests';
import Notification from 'utils/Notification';
import BaseQuiz from '../BaseQuiz';

interface Props {
  quiz: MultipleChoiceQuiz;
  questionNumber?: number;
  disabled?: boolean;

  showAnswers?: boolean;
}

const MultipleChoice: FC<Props> = ({
  quiz, questionNumber, disabled, showAnswers,
}) => {
  const {
    choices, answers, maxSelections, correctMessage, incorrectMessage, explanation,
  } = quiz;

  const theme: Theme = useTheme();
  const [responses, setResponses] = useState<boolean[]>(
    Array((choices && choices.length) || 0).fill(false),
  );
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<'incorrect' | 'correct' | 'partial'>();

  // Determines the number of responses the user has selected so far
  const getNumSelected = useCallback(
    () => Number(
      responses
                    && responses.reduce(
                      (numSelected, currIsSelected) => numSelected + Number(currIsSelected ? 1 : 0),
                      0,
                    ),
    ),
    [responses],
  );

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
    [responses],
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
        'Mismatch between choices/responses and answers. Please report this issue',
      );
    }

    setSubmitted(true);

    console.log('Answers', answers);
    console.log('Responses', responses);

    // Compare `responses` and `answers` array
    for (let i = 0; i < answers.length; i += 1) {
      if (responses[i] !== answers[i]) {
        Notification.error('Incorrect');
        setResult('incorrect');
        return;
      }
    }

    Notification.success('Well done!');
    setResult('correct');
  }, [responses, answers, getNumSelected, maxSelections]);

  return (
    <BaseQuiz quiz={quiz} questionNumber={questionNumber}>
      <FormControl>
        <FormLabel>
          {maxSelections === 1
            ? 'Select one response'
            : `Select up to ${maxSelections} responses`}
        </FormLabel>
        {choices
        && choices.map((choice, i) => (
          <FormControlLabel
            key={i}
            value={i}
            disabled={
              disabled
              || submitted
              || (getNumSelected() >= maxSelections && !responses[i])
            }
            sx={{
              background:
                (showAnswers || submitted)
                && (answers[i]
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
        ))}
      </FormControl>

      <Box sx={{ mb: 1 }}>
        {submitted && (
        <>
          {result === 'correct' && (
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
          )}
          {result === 'incorrect' && (
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
        </>
        )}
        {(submitted || showAnswers) && (
        <Alert
          severity="info"
          sx={{
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          {explanation}
        </Alert>
        )}
      </Box>

      {!submitted && !disabled && (
        <Box>
          <Button variant="contained" color="primary" onClick={() => submitQuestion()}>
            Submit
          </Button>
        </Box>
      )}
    </BaseQuiz>
  );
};

export default MultipleChoice;
