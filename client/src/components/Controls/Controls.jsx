import React from 'react';
import styles from './Control.module.scss';
import { IconButton } from '@mui/material';
import playIcon from 'assets/img/play.png';
import pauseIcon from 'assets/img/pause.png';
import replayIcon from 'assets/img/replay.png';
import fastfoward from 'assets/img/fastforward.png';
import fastrewind from 'assets/img/fastrewind.png';
import ProgressBar from './ProgressBar';

const Controls = () => {
    const [play, setPlay] = React.useState(true);
    // const initColors = {
    //   rewind: { color: 'black' },
    //   play: { color: 'black' },
    //   replay: { color: 'black' },
    //   pause: { color: 'black' },
    // };
    // const [color, setColor] = React.useState(initColors)
    const [replay, setReplay] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const pauseAndPlay = () => {
        setPlay(!play);
    };

    const playAndReplay = () => {
        setReplay(false);
    };

    // const handleColorChange = (target) => {
    //   const newColor = color;
    //   newColor[target] = { color: 'red' };
    //   setColor(newColor);
    // }
    React.useEffect(() => {
        setTimeout(() => {
            setReplay(true);
        }, 5000);

        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                const newProgress = oldProgress + 10;

                if (newProgress === 100) {
                    clearInterval(interval);
                }

                return newProgress;
            });
        }, 1000);
    }, []);

    const updateProgress = () => {
        setInterval(() => {
            if (progress <= 90) {
                setProgress(progress + 10);
            }
        }, 100);
    };
    return (
        <div className={styles.root}>
            <IconButton>
                <img
                    src={fastrewind}
                    alt="fastrewind icon"
                    className={styles.play}
                    onClick={updateProgress}
                />
            </IconButton>
            {replay ? (
                <IconButton>
                    <img
                        src={replayIcon}
                        alt="replay icon"
                        className={styles.play}
                        onClick={playAndReplay}
                    />
                </IconButton>
            ) : (
                <IconButton>
                    {play ? (
                        <img
                            src={playIcon}
                            alt="play icon"
                            className={styles.play}
                            onClick={pauseAndPlay}
                        />
                    ) : (
                        <img
                            src={pauseIcon}
                            alt="pause icon"
                            className={styles.play}
                            onClick={pauseAndPlay}
                        />
                    )}
                </IconButton>
            )}
            <IconButton>
                <img src={fastfoward} alt="fastfoward icon" className={styles.play} />
            </IconButton>
            <ProgressBar progress={progress} />
        </div>
    );
};

export default Controls;
