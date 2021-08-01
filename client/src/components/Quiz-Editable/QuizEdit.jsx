import React from 'react';
// import { QuizzBuilder } from "react-quizzes";
import { QuizzBuilder } from "react-quizzes";

// Currently used: https://www.npmjs.com/package/react-quiz-component
// For quiz creation: https://www.npmjs.com/package/react-quizzes

const QuizEdit = (props) => {
  let quiz_data = props.getData();
//   console.log(quiz_data);
//   props.saveData("New Data");
//   quiz_data = props.getData();
//   console.log(quiz_data);
  return <div>
    <QuizzBuilder
        initialValue={quiz_data}
        onChange={(values) => props.saveData(values)}
        language="en"
      />
  </div>;
};

export default QuizEdit;
