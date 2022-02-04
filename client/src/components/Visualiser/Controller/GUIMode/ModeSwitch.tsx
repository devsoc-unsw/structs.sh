import { Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import React from 'react';
import styles from '../Control.module.scss';

const ModeSwitch = ({ switchMode, setSwitchMode }) => (
  <FormControlLabel
    className={styles.switch}
    control={(
      <Switch
        color="secondary"
        checked={!switchMode}
        onChange={() => setSwitchMode(!switchMode)}
        name="mode switch"
      />
      )}
    color="textPrimary"
    label={(
      <Typography color="textPrimary" className={styles.label}>
        <strong>GUI</strong>
      </Typography>
      )}
  />
);

export default ModeSwitch;
