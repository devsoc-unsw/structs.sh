import React from 'react';
import YouTube from 'react-youtube';

// Documentation for react-youtube: https://www.npmjs.com/package/react-youtube
const EmbeddedVideoPlayer = ({ videoID }) => {
    const opts = {
        // height: '390',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    const onReady = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    };

    return <YouTube videoId={videoID} opts={opts} onReady={onReady} />;
};

export default EmbeddedVideoPlayer;
