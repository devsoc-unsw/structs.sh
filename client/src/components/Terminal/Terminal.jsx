import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Terminal.module.scss';
import Prompt from './Prompt';
import ModeSwitch from 'components/GUIMode/modeSwitch';

// Pretty cool demo: https://codepen.io/spkml/pen/dgBqRm

const Terminal = ({ switchMode, setSwitchMode, executeCommand }) => {
    const [debugOutput, setDebugOutput] = useState('');

    const processCommand = (line) => {
        const tokens = line.split(/\s+/);
        // Command is always the first token
        const command = tokens[0];
        const args = tokens.slice(1);

        // Determine which command is to be run
        const response = executeCommand(command, args);

        setDebugOutput(`
            Running command:\t${command}\n
            Args:\t\t${args}\n
            Message:\t\t${response}\n
        `);
    };

    return (
        <div className={styles.terminalContainer}>
            <pre className={styles.output}>
                {/* TODO: get rid of this */}
                Try typing: <strong>append 2</strong>
            </pre>
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
