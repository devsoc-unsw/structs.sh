import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Theme,
  useTheme,
} from '@mui/material';
import React, { FC, useCallback, useState } from 'react';
import { TrueFalseQuiz } from 'utils/apiRequests';
import Notification from 'utils/Notification';
import BaseQuiz from '../BaseQuiz';

interface Props {
  quiz: TrueFalseQuiz;
  questionNumber?: number;
  disabled?: boolean;
  showAnswers?: boolean;
}

const TrueFalse: FC<Props> = ({
  quiz, questionNumber, disabled, showAnswers,
}) => {
  const {
    isTrue, correctMessage, incorrectMessage, explanation,
  } = quiz;
  const theme: Theme = useTheme();
  // 3-state boolean where 0 is indeterminate, 1 is true, 2 is false
  const [response, setResponse] = useState<0 | 1 | 2>(0);
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
  }, [response, isTrue]);

  return (
    <BaseQuiz quiz={quiz} questionNumber={questionNumber}>
      <FormControl>
        <FormLabel>Choose one</FormLabel>
        <RadioGroup>
          <FormControlLabel
            disabled={submitted}
            control={<Radio />}
            label="True"
            checked={response === 1}
            onClick={() => setResponse(1)}
          />
          <FormControlLabel
            disabled={submitted}
            control={<Radio />}
            label="False"
            checked={response === 2}
            onClick={() => setResponse(2)}
          />
        </RadioGroup>
      </FormControl>
      <Box>
        {submitted
                    && (answeredCorrect ? (
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
                    ))}
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
          <Button
            variant="contained"
            color="primary"
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
