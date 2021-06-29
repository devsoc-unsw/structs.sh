import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Operations from '../Operations/operations';
import ModeSwitch from './modeSwitch';
import {useParams} from "react-router-dom";

const GUIMode = ({ switchMode, setSwitchMode }) => {
    const { topic } = useParams();

    return (
        <div>
            <ModeSwitch switchMode={switchMode} setSwitchMode={setSwitchMode}/>
            <Operations topic={topic}/>
        </div>
    );
};

GUIMode.propTypes = {
    switchMode: PropTypes.bool,
    setSwitchMode: PropTypes.func,
};

export default GUIMode