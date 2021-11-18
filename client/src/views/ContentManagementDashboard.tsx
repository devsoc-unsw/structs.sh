import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { ApiConstants } from 'constants/api';
import React, { useEffect, useState } from 'react';
import { Notification } from 'utils/Notification';

interface Lesson {
    topicId: string;
    title: string;
    rawMarkdown: string;
    creatorId: string;
    quizzes: string[];
}

const ContentManagementDashboard = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);

    useEffect(() => {
        axios
            .get(`${ApiConstants.URL}/api/lessons`)
            .then((res) => {
                Notification.success('Successfully loaded lessons');
                console.log(res);
                setLessons(res.data.lessons);
            })
            .catch((err) => {
                Notification.error(`Failed to load lessons. Reason: ${err.message}`);
            });
    }, []);

    return (
        <div>
            <h1>Content management</h1>
            {lessons &&
                lessons.map((lesson) => (
                    <Card sx={{ maxWidth: 345 }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image="https://miro.medium.com/max/1200/1*KpDOKMFAgDWaGTQHL0r70g.png"
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {lesson.title}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Share</Button>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                ))}
        </div>
    );
};

export default ContentManagementDashboard;
