import React from 'react';
import Alert from '@mui/material/Alert';
import {
  MultipleChoiceQuiz, QuestionAnswerQuiz, Quiz, TrueFalseQuiz,
} from 'utils/apiRequests';
import { MultipleChoice, QuestionAnswer, TrueFalse } from './Variants';

interface Props {
  quiz: Quiz;
  questionNumber?: number;
  disabled?: boolean;
  showAnswers?: boolean;
}

const QuestionRenderer: React.FC<Props> = ({
  quiz,
  questionNumber,
  disabled = false,
  showAnswers = false,
}) => {
  const { type } = quiz;

  switch (type) {
    case 'mc':
      return quiz as MultipleChoiceQuiz !== null ? (
        <MultipleChoice
          quiz={quiz as MultipleChoiceQuiz}
          questionNumber={questionNumber}
          disabled={disabled}
          showAnswers={showAnswers}
        />
      ) : (
        <Alert severity="error">This question can&apost be rendered, please report this!</Alert>
      );
    case 'qa':
      return quiz as QuestionAnswerQuiz !== null ? (
        <QuestionAnswer
          quiz={quiz as QuestionAnswerQuiz}
          questionNumber={questionNumber}
          disabled={disabled}
          showAnswers={showAnswers}
        />
      ) : (
        <Alert severity="error">This question can&apost be rendered, please report this!</Alert>
      );
    case 'tf':
      return quiz as TrueFalseQuiz !== null ? (
        <TrueFalse
          quiz={quiz as TrueFalseQuiz}
          questionNumber={questionNumber}
          disabled={disabled}
          showAnswers={showAnswers}
        />
      ) : (
        <Alert severity="error">This question can&apost be rendered, please report this!</Alert>
      );
    default:
      return (
        <Alert severity="error">
          Invalid question type: &apos
          {type}
          &apos
        </Alert>
      );
  }
};

export default QuestionRenderer;
