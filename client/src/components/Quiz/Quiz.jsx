import React, { useState } from 'react';
import { Grid } from '@material-ui/core';

import SingleChoiceQuestion from './SingleChoiceQuestion'
import MultiChoiceQuestion from './MultiChoiceQuestion'
import OpenResponseQuestion from './OpenResponseQuestion'
import './Quiz.scss';

import { quiz } from './QuizQuestions'

function ChooseQuestionType(props) {
  if (props.info.questionType === "single") {
    return(
      <SingleChoiceQuestion {...props}/>
    );
  } else if (props.info.questionType === "multiple") {
    return(
      <MultiChoiceQuestion {...props}/>
    );
  } else if (props.info.questionType === "open") {
    return(
      <OpenResponseQuestion {...props}/>
    );
  } else {
    return(<></>);
  }
}

const Quiz = (props) => {
  const [answered, setAnswered] = useState({});

  return (
  <div className="spacing">
    <h1>Quiz</h1>
    <h2>{quiz.quizTitle}</h2>
    <p>{quiz.quizSummary}</p>
    <Grid container direction="column" justifyContent="felx-start" alignItems="stretch" spacing={4}>
      {quiz.questions.map((info,idx)=>{ return(
        <Grid item id={idx}>
          <ChooseQuestionType
            info={info}
            responses={answered}
            setResponse={setAnswered}
          />
        </Grid>
      );
      })}
    </Grid>
    <br />
  </div>
  );
};

export default Quiz;
