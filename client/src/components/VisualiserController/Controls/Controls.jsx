import React, { useEffect } from 'react';
import styles from './Control.module.scss';
import { Box, IconButton, useTheme } from '@mui/material';
import playIcon from 'assets/img/play.png';
import pauseIcon from 'assets/img/pause.png';
import replayIcon from 'assets/img/replay.png';
import fastfoward from 'assets/img/fastforward.png';
import fastrewind from 'assets/img/fastrewind.png';
import ProgressBar from './ProgressBar';
import Slider from '@mui/material/Slider';
import ModeSwitch from '../GUIMode/ModeSwitch';

import PlayIcon from '@mui/icons-material/PlayCircleOutline';
import PauseIcon from '@mui/icons-material/PauseCircleOutline';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';

const Controls = ({ terminalMode, setTerminalMode }) => {
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
    const theme = useTheme();

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
    useEffect(() => {
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
                {/* <img
                    src={fastrewind}
                    alt="fastrewind icon"
                    className={styles.play}
                    onClick={updateProgress}
                /> */}
                <SkipPreviousIcon sx={{ fill: theme.palette.text.primary }} />
            </IconButton>
            {play ? (
                <IconButton>
                    {/* <img
                        //     src={playIcon}
                        //     alt="play icon"
                        //     className={styles.play}
                        //     onClick={pauseAndPlay}
                        /> */}
                    <PlayIcon sx={{ fill: theme.palette.text.primary }} />
                </IconButton>
            ) : (
                <IconButton>
                    {/* <img
                        src={pauseIcon}
                        alt="pause icon"
                        className={styles.play}
                        onClick={pauseAndPlay}
                    /> */}
                    <PauseIcon sx={{ fill: theme.palette.text.primary }} />
                </IconButton>
            )}
            <IconButton>
                {/* <img src={fastfoward} alt="fastfoward icon" className={styles.play} /> */}
                <SkipNextIcon sx={{ fill: theme.palette.text.primary }} />
            </IconButton>

            <Box className={styles.sliderContainer}>
                <Slider className={styles.slider} color="info" defaultValue={30} />
            </Box>

            <Box className={styles.modeSwitchContainer}>
                <ModeSwitch switchMode={terminalMode} setSwitchMode={setTerminalMode} />
            </Box>

            {/* <ProgressBar progress={progress} /> */}
        </div>
    );
};

export default Controls;
