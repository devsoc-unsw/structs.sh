import React from 'react';
import Quiz from 'react-quiz-component';

import { quiz } from './QuizQuestions'

// Currently used: https://www.npmjs.com/package/react-quiz-component
// For quiz creation: https://www.npmjs.com/package/react-quizzes

const QuizContainer = (props) => {
  return <div>
    <Quiz quiz={quiz} showInstantFeedback={true}/>
  </div>;
    
};

export default QuizContainer;
