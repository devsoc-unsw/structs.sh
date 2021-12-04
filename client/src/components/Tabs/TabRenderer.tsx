import { CodeSnippet } from 'components/CodeSnippet';
import { Quiz } from 'components/Quiz';
import { Lesson, AdditionalResources } from 'components/Lesson';
import { Videos } from 'components/Video';
import React, { FC } from 'react';
import { Topic } from 'utils/apiRequests';

interface Props {
    tab: string;
    topic?: Topic;
}

const TabRenderer: FC<Props> = ({ tab, topic }) => {
    switch (tab) {
        case 'Lesson':
            return <Lesson topic={topic} />;
        case 'Additional Resources':
            return <AdditionalResources />;
        case 'Quiz':
            return <Quiz />;
        case 'Code':
            return <CodeSnippet />;
        case 'Videos':
            return <Videos />;
        default:
            return <p>Invalid tab: '{tab}'</p>;
    }
};

export default TabRenderer;
