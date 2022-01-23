import React, { FC } from 'react';
import YouTube from 'react-youtube';
import { extractQueryParameter } from 'utils/url';

interface Props {
  videoUrl: string;
}

// Documentation for react-youtube: https://www.npmjs.com/package/react-youtube
const EmbeddedVideoPlayer: FC<Props> = ({ videoUrl }) => {
  const youtubeVideoId = extractQueryParameter(videoUrl, 'v');

  const opts = {
    width: '100%',
  };

  const onReady = (event) => {
    event.target.pauseVideo();
  };

  return <YouTube videoId={youtubeVideoId} opts={opts} onReady={onReady} />;
};

export default EmbeddedVideoPlayer;
