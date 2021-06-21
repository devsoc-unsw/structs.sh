import { useState } from 'react';
import { Grid } from '@material-ui/core';

import { Lesson } from '../Lesson'
import './Tabs.scss';

function TabSelector (props) {
  switch (props.tab) {
    case "Lesson": return (<Lesson {...props} />);
    case "Additional Resources": return (<div>Additional Resources</div>);
    case "Quiz": return (<div>Quiz</div>);
    default: return (<div>"Tab not made"</div>);
  }
}

export default function Tabs (props) {
  const tabs = ["Lesson", "Additional Resources", "Quiz"]
  const [Tab, setTab] = useState(0);

  return (
    <div >
        <Grid container>
            <Grid item container className='Tab-Group' direction="row" spacing={0}>
                {tabs.map((label, idx)=>(
                  <Grid item key={label}>
                    <button
                      type="button"
                      onClick={()=>setTab(idx)}
                      selected
                      className={Tab===idx ? 'Tab-Selected' : 'Tab'
                    }>{label}</button>
                  </Grid>
                ))}
            </Grid>
            <Grid item style={{margin:"0px 10px 0px 10px"}}>
              <br/>
              <p>The <i>{tabs[Tab]}</i> page for <i>{props.topic}</i> will go here</p>
              <TabSelector topic={props.topic} tab={tabs[Tab]}/>
            </Grid>
        </Grid>
      </div>
  );
}
