import { Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import PropTypes from 'prop-types';
import React from 'react';
import styles from '../Controls/Control.module.scss';

const ModeSwitch = ({ switchMode, setSwitchMode }) => {
    return (
        <FormControlLabel
            className={styles.switch}
            control={
                <Switch
                    color="secondary"
                    checked={!switchMode}
                    onChange={(e) => setSwitchMode(!switchMode)}
                    name="mode switch"
                />
            }
            color={'textPrimary'}
            label={
                <Typography color="textPrimary" className={styles.label}>
                    <strong>GUI</strong>
                </Typography>
            }
        />
    );
};

ModeSwitch.propTypes = {
    switchMode: PropTypes.bool,
    setSwitchMode: PropTypes.func,
};

export default ModeSwitch;
