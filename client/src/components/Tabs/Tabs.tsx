import { Alert, Box, Tab, Tabs, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import { FC, useState } from 'react';
import { Topic } from 'utils/apiRequests';
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
    topic: Topic;
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
                    variant="fullWidth"
                >
                    {tabs.map((label, i) => (
                        <Tab label={label} />
                    ))}
                </Tabs>
            </Box>
            {/* Note: disabled temporarily for production */}
            {/* {tabs.map((tab, i) => (
                <TabPanel value={tabIndex} index={i}>
                    <TabRenderer topic={topic} tab={tab} />
                </TabPanel>
            ))} */}
        </Box>
    );
};

export default ContentTabs;
