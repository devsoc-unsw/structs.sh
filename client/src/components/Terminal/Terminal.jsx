import React from 'react';
import PropTypes from 'prop-types';
import styles from './Terminal.module.scss';
import Prompt from './Prompt';
import ModeSwitch from 'components/GUIMode/modeSwitch';

const Terminal = ({switchMode, setSwitchMode}) => {
    return (
        <div className={styles.terminalContainer}>
            <ModeSwitch switchMode={switchMode} setSwitchMode={setSwitchMode}/>
            <Prompt username={'username'}></Prompt>
        </div>
    );
};

Terminal.propTypes = {
    switchMode: PropTypes.bool,
    setSwitchMode: PropTypes.func,
};

export default Terminal;
