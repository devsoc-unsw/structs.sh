import { Button } from '@mui/material';
import React from 'react';
import { Topic } from 'utils/apiRequests';
import styles from './TopicCard.module.scss';
import binary from './topic-images/binary-search-tree-nobg.png'
import linked from './topic-images/linked-list-nobg.png';
import graph from './topic-images/graph-nobg.png';

interface Props {
  topic: Topic;
  index: number;
}

const images = [linked, binary, graph, binary];
const colours = ['rgba(248, 79, 121, 1)', 'rgba(20, 201, 150, 1)', 'rgba(120, 110, 243, 1)', 'rgba(76, 201, 240, 1)'];
const coloursFaded = ['rgba(248, 79, 121, 0.8)', 'rgba(20, 201, 150, 0.8)', 'rgba(120, 110, 243, 0.8)', 'rgba(76, 201, 240, 0.8)'];

const TopicCard: React.FC<Props> = ({ topic, index }) => (

  <div
    className={`${styles.card}`}
    style={{
      background: `linear-gradient(to bottom right, ${colours[index]}, ${coloursFaded[index]})`,
    }}
  >
    <div>
      <img 
        src={`${images[index]}`} 
        alt="Tree" 
        style={{height: '100px', objectFit: 'contain'}}
      />
    </div>
    <div>
      <Button
        className={`${styles.button}`}
        variant="contained"
      >
        {topic.title}
      </Button>
    </div>
  </div>
);

export default TopicCard;
