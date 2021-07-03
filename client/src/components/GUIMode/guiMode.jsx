import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Operations from '../Operations/operations';
import ModeSwitch from './modeSwitch';
import { useParams } from 'react-router-dom';

const GUIMode = ({ switchMode, setSwitchMode, executeCommand }) => {
    const { topic } = useParams();

    return (
        <div>
            <ModeSwitch switchMode={switchMode} setSwitchMode={setSwitchMode} />
            <Operations topic={topic} executeCommand={executeCommand} />
        </div>
    );
};

GUIMode.propTypes = {
    switchMode: PropTypes.bool,
    setSwitchMode: PropTypes.func,
};

export default GUIMode;
