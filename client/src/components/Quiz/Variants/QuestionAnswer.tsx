import {
  Alert, Box, Button, TextField, Theme,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import React, { FC, useCallback, useState } from 'react';
import { QuestionAnswerQuiz } from 'utils/apiRequests';
import Notification from 'utils/Notification';
import BaseQuiz from '../BaseQuiz';

interface Props {
  quiz: QuestionAnswerQuiz;
  questionNumber?: number;
  disabled?: boolean;
  showAnswers?: boolean;
}

const QuestionAnswer: FC<Props> = ({
  quiz, questionNumber, disabled, showAnswers,
}) => {
  const { explanation } = quiz;
  const theme: Theme = useTheme();
  const [response, setResponse] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const submitQuestion = useCallback(() => {
    // Responses that only contain whitespace characters should be treated as empty
    if (!response || !/\S/.test(response)) {
      Notification.error('Please write something in your response');
      return;
    }

    setSubmitted(true);
  }, [response]);

  return (
    <BaseQuiz quiz={quiz} questionNumber={questionNumber}>
      <TextField
        multiline
        fullWidth
        disabled={disabled || submitted}
        rows={3}
        maxRows={8}
        variant="outlined"
        label="Enter response"
        onChange={(e) => setResponse(String(e.target.value))}
        sx={{ mb: 2, mt: 2 }}
      />
      {(submitted || showAnswers) && (
        <Box>
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
      {!submitted && !disabled && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => submitQuestion()}
          className="button-spacing"
        >
          Submit
        </Button>
      )}
    </BaseQuiz>
  );
};

export default QuestionAnswer;
