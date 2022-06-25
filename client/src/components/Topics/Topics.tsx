import { LineLoader } from 'components/Loader';
import React, { useEffect, useState } from 'react';
import { getTopics, Topic } from 'utils/apiRequests';
import Notification from 'utils/Notification';
import TopicCard from './TopicCard';

interface Props {}

const Topics: React.FC<Props> = () => {

  const [topics, setTopics] = useState<Topic[]>([]);
  
  useEffect(() => {
    getTopics().then(setTopics).catch(Notification.error);
  }, []);

  return topics && topics.length > 0 ? (
    <div
      style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', marginTop: '5%', gap: '20px 50px'}}>
      {topics.map((topic, idx) => (
        <div
          key={idx}
        >
          <TopicCard topic={topic} index={idx} />
        </div>
      ))}
    </div>
  ) : (
    <LineLoader />
  );
};

export default Topics;
