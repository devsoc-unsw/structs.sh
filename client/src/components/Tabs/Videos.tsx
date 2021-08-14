import { Paper } from '@material-ui/core';
import { EmbeddedVideoPlayer } from 'components/Video';
import React from 'react';
import styles from './Videos.module.scss';

const VideoTab = () => {
    return (
        <div>
            <Paper className={styles.videoCard} elevation={10}>
                <h3>Hackerrank Intro</h3>
                <EmbeddedVideoPlayer videoID="njTh_OwMljA" />
            </Paper>
            <Paper className={styles.videoCard} elevation={10}>
                <h3>Richard Buckland Intro</h3>
                <EmbeddedVideoPlayer videoID="qHIflU8C0WY" />
            </Paper>
            <Paper className={styles.videoCard} elevation={10}>
                <h3>CSDojo</h3>
                <EmbeddedVideoPlayer videoID="WwfhLC16bis" />
            </Paper>
        </div>
    );
};

export default VideoTab;
