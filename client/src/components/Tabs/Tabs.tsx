import { Box, Grid, Tab, Tabs, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import { FC, useState } from 'react';
import TabRenderer from './TabRenderer';
import './Tabs.scss';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

interface Props {
    topic?: string;
    tabs?: string[];
}

const ContentTabs: FC<Props> = ({ topic, tabs = ['Lesson', 'Code', 'Videos'] }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const theme: Theme = useTheme();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box>
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    background: theme.palette.background.paper,
                }}
            >
                <Tabs
                    value={tabIndex}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    textColor="secondary"
                    indicatorColor="secondary"
                >
                    {tabs.map((label, i) => (
                        <Tab label={label} />
                    ))}
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}>
                Item One
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                Item Three
            </TabPanel>
        </Box>
        // <Grid container>
        //     <Grid item container className="Tab-Group" direction="row" spacing={0}>
        //         {tabs.map((label, idx) => (
        //             <Grid item key={label}>
        //                 <button
        //                     type="button"
        //                     onClick={() => setTabIndex(idx)}
        //                     className={tabIndex === idx ? 'Tab-Selected' : 'Tab'}
        //                 >
        //                     {label}
        //                 </button>
        //             </Grid>
        //         ))}
        //     </Grid>
        //     <Grid item style={{ margin: '24px 12px 16px 12px', width: '100%' }}>
        //         <TabRenderer topic={topic} tab={tabs[tabIndex]} />
        //     </Grid>
        // </Grid>
    );
};

export default ContentTabs;
