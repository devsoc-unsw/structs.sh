import { Grid } from '@mui/material';
import { FC, useState } from 'react';
import TabRenderer from './TabRenderer';
import './Tabs.scss';

interface Props {
    topic?: string;
    tabs?: string[];
}

const Tabs: FC<Props> = ({
    topic,
    tabs = ['Lesson', 'Additional Resources', 'Quiz', 'Code', 'Videos'],
}) => {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <div>
            <Grid container>
                <Grid item container className="Tab-Group" direction="row" spacing={0}>
                    {tabs.map((label, idx) => (
                        <Grid item key={label}>
                            <button
                                type="button"
                                onClick={() => setTabIndex(idx)}
                                className={tabIndex === idx ? 'Tab-Selected' : 'Tab'}
                            >
                                {label}
                            </button>
                        </Grid>
                    ))}
                </Grid>
                <Grid item style={{ margin: '0px 10px 0px 10px', width: '100%' }}>
                    <TabRenderer topic={topic} tab={tabs[tabIndex]} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Tabs;
