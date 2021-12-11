import React from 'react';
import Alert from '@mui/material/Alert';
import { MultipleChoiceQuiz, QuestionAnswerQuiz, Quiz, TrueFalseQuiz } from 'utils/apiRequests';
import { MultipleChoice, QuestionAnswer, TrueFalse } from './Variants';

interface Props {
    quiz: Quiz;
    questionNumber: number;
}

const QuestionRenderer: React.FC<Props> = ({ quiz, questionNumber }) => {
    const { type } = quiz;

    switch (type) {
        case 'mc':
            const multipleChoiceQuizData = quiz as MultipleChoiceQuiz;
            return multipleChoiceQuizData !== null ? (
                <MultipleChoice quiz={multipleChoiceQuizData} questionNumber={questionNumber} />
            ) : (
                <Alert severity="error">This question can't be rendered, please report this!</Alert>
            );
        case 'qa':
            const questionAnswerQuizData = quiz as QuestionAnswerQuiz;
            return questionAnswerQuizData !== null ? (
                <QuestionAnswer quiz={quiz as QuestionAnswerQuiz} questionNumber={questionNumber} />
            ) : (
                <Alert severity="error">This question can't be rendered, please report this!</Alert>
            );
        case 'tf':
            const trueFalseQuizData = quiz as TrueFalseQuiz;
            return trueFalseQuizData !== null ? (
                <TrueFalse quiz={quiz as TrueFalseQuiz} questionNumber={questionNumber} />
            ) : (
                <Alert severity="error">This question can't be rendered, please report this!</Alert>
            );
        default:
            return <Alert severity="error">Invalid question type: '{type}'</Alert>;
    }
};

export default QuestionRenderer;
