import { Box, Paper, Stack, Typography } from '@mui/material';
import { HorizontalRule } from 'components/HorizontalRule';
import { EmbeddedVideoPlayer } from 'components/Video';
import React, { FC } from 'react';
import { Topic } from 'utils/apiRequests';
import styles from './Videos.module.scss';

interface Props {
    topic: Topic;
}

const VideoTab: FC<Props> = ({ topic }) => {
    return (
        <Stack direction="column">
            {topic.videos.map((videoUrl) => (
                <Paper className={styles.videoCard} elevation={3}>
                    <EmbeddedVideoPlayer videoUrl={videoUrl} />
                </Paper>
            ))}
        </Stack>
    );
};

export default VideoTab;
