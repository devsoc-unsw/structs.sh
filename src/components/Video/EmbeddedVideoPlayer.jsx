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

    return <YouTube videoId={videoID} opts={opts} />;
};

export default EmbeddedVideoPlayer;
