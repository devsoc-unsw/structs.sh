import { ImageListItem, ImageListItemBar } from '@mui/material';
import React from 'react';
import { Topic } from 'utils/apiRequests';
import styles from './TopicCard.module.scss';

interface Props {
    topic: Topic;
    isActive: boolean;
}

const TopicCard: React.FC<Props> = ({ topic, isActive }) => {
    return (
        <ImageListItem
            className={`${styles.card} ${isActive && styles.activeCard}`}
            // sx={{
            //     width: 300,
            //     height: '220px',
            //     zIndex: 0,
            //     background: `url(${topic.image})`,
            //     backgroundSize: 'cover',
            //     backgroundPosition: 'center center',
            //     position: 'relative',
            // }}
        >
            <img
                src={topic.image}
                style={{ height: '200px', borderRadius: '13px' }}
                alt="topic card"
            />
            <ImageListItemBar
                title={topic.title}
                sx={{ borderBottomLeftRadius: '13px', borderBottomRightRadius: '13px' }}
            ></ImageListItemBar>
        </ImageListItem>
    );
};

export default TopicCard;
