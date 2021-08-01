import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';

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
  const [submitted, setSubmitted] = useState(false);

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
            submitted={submitted}
          />
        </Grid>
      );
      })}
    </Grid>
    <br />
    <Button
      variant="contained"
      color="primary"
      onClick={()=>setSubmitted(true)}
      className="button-spacing"
    >Submit</Button>
  </div>
  );
};

export default Quiz;
