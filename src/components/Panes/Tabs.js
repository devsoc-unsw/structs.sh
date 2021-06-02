import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';

export default function Tabs(props) {
  const tabs = ["Info", "Pseudocode", "Videos"]
  const [Tab, setTab] = useState(0);

  return (
    <div>
        <Grid container>
            <Grid item container direction="row" spacing={2}>
                {tabs.map((x, idx)=>(
                  <Grid item>
                    <button type="button" onClick={()=>setTab(idx)}>{x}</button>
                    <Button onClick={()=>setTab(idx)}>{x}</Button>
                  </Grid>
                ))}
            </Grid>
            <Grid item>
                <p>The pages will go here</p>
                {tabs[Tab]}
            </Grid>
        </Grid>
      </div>
  );
}

// class Tabs extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { page: "" };
//   }

//   render () {
//     const {  } = this.props;
//     return (
//       <div>
//         <Grid container>
//             <Grid item>
//                 The tabs will go here
//             </Grid>
//             <Grid item>
//                 The pages will go here
//             </Grid>
//         </Grid>
//       </div>
//     );
//   }
// }

// export default Tabs