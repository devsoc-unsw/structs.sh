import React, { FC } from 'react';
import { CodeTab } from 'components/Code';
import { LessonContent } from 'components/Lesson';
import { VideosTab } from 'components/Video';
import { Topic } from 'utils/apiRequests';
import { Alert } from '@mui/material';

interface Props {
    tab: string;
    topic?: Topic;
}

const TabRenderer: FC<Props> = ({ tab, topic }) => {
    switch (tab) {
        case 'Lesson':
            return <LessonContent topic={topic} />;
        case 'Code':
            return <CodeTab topic={topic} />;
        case 'Videos':
            return <VideosTab topic={topic} />;
        default:
            return <Alert severity="error">Invalid tab: '{tab}'</Alert>;
    }
};

export default TabRenderer;
