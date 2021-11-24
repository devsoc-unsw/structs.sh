/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import styles from './SplashScreen.module.scss';
import { motion } from 'framer-motion';
import SplashScreenTitle from './SplashScreenTitle';
import SplashScreenLogo from './SplashScreenLogo';
import { useCookies } from 'react-cookie';

interface Props {
    stillDuration?: number;
    disappearDuration?: number;
    waitIntervalMinutes?: number;
}

const SPLASH_SCREEN_LAST_PLAYED = 'splash-screen-last-shown';

const SplashScreen: React.FC<Props> = ({
    stillDuration = 2,
    disappearDuration = 0.5,
    waitIntervalMinutes = 60,
}) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [cookies, setCookie] = useCookies([SPLASH_SCREEN_LAST_PLAYED]);

    useEffect(() => {
        const currTimestampInS: number = +new Date() / 1000;
        const timeLastPlayed: number = Number(cookies['splash-screen-last-shown']) || 0;

        // Play the splash screen only after `waitIntervalMinutes` has elapsed since it was last played
        if (currTimestampInS > timeLastPlayed + waitIntervalMinutes * 60) {
            setCookie('splash-screen-last-shown', currTimestampInS);
            setIsActive(true);

            setTimeout(() => {
                setIsActive(false);
            }, (stillDuration + disappearDuration) * 1000);
        } else {
            setIsActive(false);
        }
    }, [stillDuration, disappearDuration, waitIntervalMinutes, cookies, setCookie]);

    return isActive ? (
        <motion.div
            initial={{
                opacity: 1,
            }}
            animate={{
                opacity: 0,
            }}
            transition={{
                delay: stillDuration,
                duration: disappearDuration,
            }}
            className={styles.splashScreen}
        >
            <div className={styles.splashContents}>
                <SplashScreenLogo />
                <SplashScreenTitle speedModifier={1} />
            </div>
        </motion.div>
    ) : null;
};

export default SplashScreen;
