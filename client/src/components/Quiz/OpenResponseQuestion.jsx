import React, { useState } from 'react';
import { Card, TextField, Grid } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import { yellow } from '@material-ui/core/colors';
import './Quiz.scss';

function CheckCorrect(props) {
  if (props.submitted) {
    return(<>
      <ErrorIcon style={{ color: yellow[800] }} />
      {/* <br /> <br /> */}
      <Grid container spacing={1} alignItems="center">
        <Grid item className="centering"><ErrorIcon style={{ color: yellow[800] }} className="centering" /></Grid>
        <Grid item><h4><i>{props.info.answerMessage}</i></h4></Grid>
      </Grid>
      <h4><i>{props.info.explanation}</i></h4>
    </>);
  } else {
    return(<></>);
  }
}

const OpenResponseQuestion = (props) => {
  return (
  <div>
    <Card raised className="card-spacing">
      <h1><strong>{props.info.question}</strong></h1>
      {props.info.code.map((line)=>{ return (
          <pre className='No-spacing'><code>{line}</code></pre>
      )})}
      <br />
      <TextField multiline fullWidth disabled={props.submitted} rows={3} maxRows={8} variant="outlined" label="Enter response"/>
      
      <CheckCorrect submitted={props.submitted} info={props.info}/>
    </Card>
  </div>
  );
};

export default OpenResponseQuestion;