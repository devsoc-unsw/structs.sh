import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Terminal.module.scss';
import Prompt from './Prompt';
import ModeSwitch from 'components/GUIMode/modeSwitch';

// Pretty cool demo: https://codepen.io/spkml/pen/dgBqRm

const Terminal = ({ switchMode, setSwitchMode }) => {
    const [debugOutput, setDebugOutput] = useState('');

    const processCommand = (line) => {
        const tokens = line.split(/\s+/);
        // Command is always the first token
        const command = tokens[0];
        const args = tokens.slice(1);
        setDebugOutput(`
            Running command:\t${command}\n
            Args:\t\t${args}\n
        `);

        //
    };

    return (
        <div className={styles.terminalContainer}>
            <ModeSwitch switchMode={switchMode} setSwitchMode={setSwitchMode} />
            <Prompt username={'username'} path={'~'} processCommand={processCommand}></Prompt>
            <pre className={styles.output}>Debug output: {debugOutput}</pre>
        </div>
    );
};

Terminal.propTypes = {
    switchMode: PropTypes.bool,
    setSwitchMode: PropTypes.func,
};

export default Terminal;
