import { ImageListItem, ImageListItemBar } from '@mui/material';
import React from 'react';
import { Topic } from 'utils/apiRequests';
import { toTitleCase } from 'utils/url';
import styles from './TopicCard.module.scss';

interface Props {
  topic: Topic;
  isActive: boolean;
}

const TopicCard: React.FC<Props> = ({ topic, isActive }) => (
  <ImageListItem className={`${styles.card} ${isActive && styles.activeCard}`}>
    <img src={topic.image} style={{ height: '200px', borderRadius: '13px' }} alt="topic card" />
    <ImageListItemBar
      title={topic.title}
      sx={{ borderBottomLeftRadius: '13px', borderBottomRightRadius: '13px' }}
    />
  </ImageListItem>
);

export default TopicCard;
