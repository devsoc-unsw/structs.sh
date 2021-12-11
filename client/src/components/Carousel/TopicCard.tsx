import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import { Topic } from 'utils/apiRequests';
import styles from './TopicCard.module.scss';

interface Props {
    topic: Topic;
    isActive: boolean;
}

const TopicCard: React.FC<Props> = ({ topic, isActive }) => {
    return (
        <Card
            className={`${styles.card} ${isActive && styles.activeCard}`}
            sx={{
                width: 300,
                height: '220px',
                zIndex: 0,
                background: `url(${topic.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                position: 'relative',
            }}
        >
            <CardContent className={styles.content}>
                <Typography gutterBottom variant="h5" component="div">
                    {topic.title}
                </Typography>
                <Typography className={styles.text} variant="body2">
                    {topic.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default TopicCard;

// <Box
//     sx={{
//         background: theme.palette.background.paper,
//         border: '1px solid black',
//         height: '150px',
//         width: '200px',
//     }}
// ></Box>
