import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PropTypes from 'prop-types';

const ModeSwitch = ({ switchMode, setSwitchMode }) => {
    return (
        <>
            <div className="switch pull-right">
                <FormControlLabel
                    control={
                        <Switch
                            color="secondary"
                            checked={!switchMode}
                            onChange={e => setSwitchMode(!switchMode)}
                            name="mode switch"
                        />
                    }
                    label="GUI"
                />
            </div>
        </>
    );
};

ModeSwitch.propTypes = {
    switchMode: PropTypes.bool,
    setSwitchMode: PropTypes.func
};

export default ModeSwitch;