import { LineLoader } from 'components/Loader';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopics, Topic } from 'utils/apiRequests';
import Notification from 'utils/Notification';
import { titleToUrl } from 'utils/url';
import TopicCard from './TopicCard';

interface Props {}

const Topics: React.FC<Props> = () => {

  const [topics, setTopics] = useState<Topic[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTopics().then(setTopics).catch(Notification.error);
  }, []);

  const handleClick = (topic: Topic) => {
    navigate(`/visualiser/${titleToUrl(topic.title)}`);
  };

  return topics && topics.length > 0 ? (
    <div
      style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', marginTop: '5%', gap: '20px 50px'}}>
      {topics.map((topic, idx) => (
        <div
          key={idx}
          onClick={() => handleClick(topic)}
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
