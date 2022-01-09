import { LineLoader } from 'components/Loader';
import { Pane } from 'components/Panes';
import Tabs from 'components/Tabs/Tabs';
import { Visualiser } from 'components/Visualiser';
import { VisualiserDashboardLayout } from 'layout';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopic, Topic } from 'utils/apiRequests';
import { Notification } from 'utils/Notification';
import { urlToTitle } from 'utils/url';
import 'visualiser-src/linked-list-visualiser/styles/visualiser.css';

interface Props {}

const Dashboard: FC<Props> = () => {
    const [topic, setTopic] = useState<Topic>();
    const params = useParams();

    // Fetching the topic based on the URL parameter in `/visualiser/:topic`
    useEffect(() => {
        const topicTitleInUrl = params.topic;
        getTopic(urlToTitle(topicTitleInUrl))
            .then((topic) => setTopic(topic))
            .catch(() =>
                Notification.error(
                    `Couldn't find anything for topic: '${urlToTitle(topicTitleInUrl)}'`
                )
            );
    }, [params]);

    // Note: hacky way of removing scrollability outside of the panes
    useEffect(() => {
        document.querySelector('html').style.overflow = 'hidden';
        return () => {
            document.querySelector('html').style.overflow = 'auto';
        };
    });

    return topic ? (
        <VisualiserDashboardLayout topic={topic}>
            <Pane orientation="vertical" minSize={340} hasTopGutter>
                <Visualiser topicTitle={topic.title} />
                <Tabs topic={topic}></Tabs>
            </Pane>
        </VisualiserDashboardLayout>
    ) : (
        <LineLoader fullViewport />
    );
};

export default Dashboard;
