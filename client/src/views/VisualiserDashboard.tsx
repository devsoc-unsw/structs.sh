import { LineLoader } from 'components/Loader';
import { Visualiser } from 'components/Visualiser';
import { VisualiserDashboardLayout } from 'layout';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTopic, Topic } from 'utils/apiRequests';
import Notification from 'utils/Notification';
import { urlToTitle } from 'utils/url';
import 'visualiser-src/linked-list-visualiser/styles/visualiser.css';

interface Props {}

/**
 * Defines the layout and contents of the visualiser pages.
 * Notably, we're using a split-pane layout here.
 */
const VisualiserDashboard: FC<Props> = () => {
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
        Notification.error(`Couldn't find anything for topic: '${urlToTitle(topicTitleInUrl)}'`)
      });
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
      <Visualiser topicTitle={topic.title} />
    </VisualiserDashboardLayout>
  ) : (
    <LineLoader fullViewport />
  );
};

export default VisualiserDashboard;
