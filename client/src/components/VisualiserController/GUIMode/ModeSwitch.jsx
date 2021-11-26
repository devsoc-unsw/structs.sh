import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import PropTypes from 'prop-types';
import styles from '../VisualiserController.module.scss';
import { Box, Typography, useTheme } from '@mui/material';

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
                    <strong>GUI Mode</strong>
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
