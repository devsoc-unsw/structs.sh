import { Paper, Stack } from '@mui/material';
import { EmbeddedVideoPlayer } from 'components/Video';
import React, { FC } from 'react';
import { Topic } from 'utils/apiRequests';
import styles from './Videos.module.scss';

interface Props {
  topic: Topic;
}

const VideoTab: FC<Props> = ({ topic }) => (
  <Stack direction="column">
    {topic.videos.map((videoUrl, idx) => (
      <Paper key={idx} className={styles.videoCard} elevation={3}>
        <EmbeddedVideoPlayer videoUrl={videoUrl} />
      </Paper>
    ))}
  </Stack>
);

export default VideoTab;
