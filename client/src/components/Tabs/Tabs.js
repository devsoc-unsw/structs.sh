import { useState } from 'react';
import { Grid } from '@material-ui/core';
import './Tabs.scss';
import { Videos, AdditionalResources, Lesson, Code } from 'components/Tabs';
import { QuizContainer } from 'components/Quiz'
import { QuizDisplay, QuizEdit } from 'components/Quiz-Editable'

var quizData = [];

function saveQuizData(data) {
  console.log(data);
  quizData = data;
}

function getQuizData() {
  return quizData;
}

function TabSelector(props) {
  switch (props.tab) {
    case "Lesson": return (<Lesson {...props} />);
    case "Additional Resources": return (<div><AdditionalResources /></div>);
    case "Quiz": return (<div><QuizContainer /></div>);
    case "Quiz2": return (<div><QuizDisplay  getData={getQuizData} saveData={saveQuizData}/></div>);
    case "Quiz-Editor": return (<div><QuizEdit getData={getQuizData} saveData={saveQuizData}/></div>);
    case "Code": return (<div><Code /></div>);
    case "Videos": return (<Videos />);
    default: return (<div>"Tab not made"</div>);
  }
}

export default function Tabs(props) {
  const tabs = ["Lesson", "Additional Resources", "Quiz", "Quiz2", "Code", "Videos", "Quiz-Editor"]
  const [Tab, setTab] = useState(0);

  return (
    <div >
      <Grid container>
        <Grid item container className='Tab-Group' direction="row" spacing={0}>
          {tabs.map((label, idx) => (
            <Grid item key={label}>
              <button
                type="button"
                onClick={() => setTab(idx)}
                selected
                className={Tab === idx ? 'Tab-Selected' : 'Tab'
                }>{label}</button>
            </Grid>
          ))}
        </Grid>
        <Grid item style={{ margin: "0px 10px 0px 10px", width: '100%' }}>
          <br />
          {/* <p>The <i>{tabs[Tab]}</i> page for <i>{props.topic}</i> will go here</p> */}
          <TabSelector topic={props.topic} tab={tabs[Tab]} />
        </Grid>
      </Grid>
    </div>
  );
}
