import { useState } from 'react';
import { Grid } from '@material-ui/core';

import './Tabs.scss';

export default function Tabs(props) {
  const tabs = ["Lesson", "Additional Resources", "Quiz"]
  const [Tab, setTab] = useState(0);

  return (
    <div>
        <Grid container>
            <Grid item container key='Tab-Group' direction="row" spacing={0}>
                {tabs.map((x, idx)=>(
                  <Grid item key={x}>
                    <button type="button" onClick={()=>setTab(idx)} selected className={Tab===idx ? 'Tab-Selected' : 'Tab'}>{x}</button>
                  </Grid>
                ))}
            </Grid>
            <Grid item>
              <br/>
              <p>The <i>{tabs[Tab]}</i> page for <i>{props.topic}</i> will go here</p>
            </Grid>
        </Grid>
      </div>
  );
}
