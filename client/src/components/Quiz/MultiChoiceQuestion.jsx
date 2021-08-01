import React, { useState } from 'react';
import { Card, Checkbox, RadioGroup, FormControlLabel, FormControl, FormLabel, Grid } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { red, green } from '@material-ui/core/colors';
import './Quiz.scss';

function CheckCorrect(props) {
  // Check if all correct
  let correct = true;
  props.info.correctAnswers.map((ans)=>{
    if (!props.selectedAnswers.includes(ans.toString())) {correct = false;}
  });
  props.selectedAnswers.map((ans)=>{
    if (!props.info.correctAnswers.includes(parseInt(ans))) {correct = false;}
  });

  if (props.submitted && correct) {
    return(<>
      <CheckCircleIcon style={{ color: green[500] }} />
      <br /> <br />
      <Grid container spacing={1} alignItems="center">
        <Grid item><CheckCircleIcon style={{ color: green[500] }} /></Grid>
        <Grid item><h4>{props.info.correctAnswerMessage}</h4></Grid>
      </Grid>
      <i>
        <h4>{props.info.correctAnswerMessage}</h4>
        <h4><i></i>{props.info.explanation}</h4>
      </i>
    </>);
  } else if (props.submitted) {
    return (<>
      <CancelIcon style={{ color: red[500] }} />
      <br /> <br />
      <Grid container spacing={1} alignItems="center">
        <Grid item><CheckCircleIcon style={{ color: green[500] }} /></Grid>
        <Grid item><h4>{props.info.incorrectAnswerMessage}</h4></Grid>
      </Grid>
      <i>
        <h4>{props.info.incorrectAnswerMessage}</h4>
        <h4>{props.info.explanation}</h4>
      </i>
    </>);
  } else {
    return(<></>);
  }
}

const MultiChoiceQuestion = (props) => {
  const [value, setValue] = React.useState([]);

  const handleChange = (event) => {
    console.log(event.target.id);
    console.log(event.target.checked);

    if (props.submitted===false) {
      if (event.target.checked) {
        if (value.includes(event.target.id)) return;
        let newResponses = value;
        newResponses.push(event.target.id);
        setValue(newResponses);
      } else {
        if (!value.includes(event.target.id)) return;
        let newResponses = value;
        newResponses.splice(newResponses.indexOf(event.target.id), 1);
        setValue(newResponses);
      }
      console.log(value);
    }
  };

  return (
  <div>
    <Card raised className="card-spacing">
      <h1><strong>{props.info.question}</strong></h1>
      {props.info.code.map((line)=>{ return (
          <pre className='No-spacing'><code>{line}</code></pre>
      )})}
      <br />
      <FormControl>
        <FormLabel>Choose multiple</FormLabel>
        <RadioGroup value={value}>
            {props.info.answers.map((answer, idx)=>{return (
              <FormControlLabel value={(idx+1).toString()} disabled={props.submitted} control={<Checkbox id={(idx+1).toString()} onChange={handleChange}/>} label={answer} />
            );})}
        </RadioGroup>
      </FormControl>
      <CheckCorrect submitted={props.submitted} selectedAnswers={value} info={props.info}/>
    </Card>
  </div>
  );
};

export default MultiChoiceQuestion;