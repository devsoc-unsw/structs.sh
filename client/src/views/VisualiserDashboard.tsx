import { LineLoader } from 'components/Loader';
import { Visualiser } from 'components/Visualiser';
import { VisualiserDashboardLayout } from 'layout';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopic, Topic } from 'utils/apiRequests';
import Notification from 'utils/Notification';
import { urlToTitle } from 'utils/url';
import 'visualiser-src/linked-list-visualiser/styles/visualiser.css';

/**
 * Defines the layout and contents of the visualiser pages.
 * Notably, we're using a split-pane layout here.
 */
const VisualiserDashboard = () => {
  const [topic, setTopic] = useState<Topic>();
  const params = useParams();

  // Fetching the topic based on the URL parameter in `/visualiser/:topic`
  useEffect(() => {
    const topicTitleInUrl = params.topic;
    getTopic(urlToTitle(topicTitleInUrl))
      .then((newTopic) => {
        setTopic(newTopic);
      })
      .catch((err) => {
        Notification.error(`Couldn't find anything for topic: '${urlToTitle(topicTitleInUrl)}'`);
      });
  }, [params]);

  return topic ? (
    <VisualiserDashboardLayout topicTitle={topic.title}>
      <Visualiser topicTitle={topic.title} />
    </VisualiserDashboardLayout>
  ) : (
    <LineLoader fullViewport />
  );
};

export default VisualiserDashboard;
