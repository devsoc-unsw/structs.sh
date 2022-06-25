import React from 'react';
import { LineLoader } from 'components/Loader';
import { getTopics } from '../../visualiser-src/common/helpers';
import TopicCard from './TopicCard';

interface Props {}

const Topics: React.FC<Props> = () => {
  const topics = getTopics();
  return topics && topics.length > 0 ? (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '5%',
        gap: '20px 50px',
      }}
    >
      {topics.map((topic, idx) => (
        <TopicCard topic={topic} index={idx} key={idx} />
      ))}
    </div>
  ) : (
    <LineLoader />
  );
};

export default Topics;
