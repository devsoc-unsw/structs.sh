import React from 'react';
import { Quiz } from "react-quizzes";

const QuizDisplay = (props) => {
  let quiz_data = props.getData();
  return <div>
    <Quiz
        data={quiz_data}
        onSubmit={(values) => console.log("form submit values", values)}
      />
  </div>;
};

export default QuizDisplay;
