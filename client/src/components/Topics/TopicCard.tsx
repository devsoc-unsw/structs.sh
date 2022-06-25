import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { titleToUrl } from 'utils/url';
import styles from './TopicCard.module.scss';
import binary from './topic-images/binary-search-tree-nobg.png';
import linked from './topic-images/linked-list-nobg.png';
import graph from './topic-images/graph-nobg.png';
import sort from './topic-images/sorting-nobg.png';

interface Props {
  topic: string;
  index: number;
}

const images = [linked, binary, sort, binary];
const colours = [
  'rgba(248, 79, 121, 1)',
  'rgba(20, 201, 150, 1)',
  'rgba(120, 110, 243, 1)',
  'rgba(76, 201, 240, 1)',
];
const coloursFaded = [
  'rgba(248, 79, 121, 0.8)',
  'rgba(20, 201, 150, 0.8)',
  'rgba(120, 110, 243, 0.8)',
  'rgba(76, 201, 240, 0.8)',
];

const TopicCard: React.FC<Props> = ({ topic, index }) => {
  const navigate = useNavigate();

  const handleClick = (top: string) => {
    navigate(`/visualiser/${titleToUrl(top)}`);
  };

  return (
    <div
      className={`${styles.card}`}
      style={{
        background: `linear-gradient(to bottom right, ${colours[index]}, ${coloursFaded[index]})`,
      }}
      role="button"
      tabIndex={index}
      onClick={() => handleClick(topic)}
      onKeyDown={() => handleClick(topic)}
    >
      <img
        src={`${images[index]}`}
        alt={`${topic} svg snapshot`}
        style={{ height: '100px', objectFit: 'contain' }}
      />
      <Button className={`${styles.button}`} id={styles[`button${index}`]} variant="contained">
        {topic}
      </Button>
    </div>
  );
};

export default TopicCard;
