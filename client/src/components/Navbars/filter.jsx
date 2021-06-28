import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles({
    root: {
        width: 200,
        marginLeft: 35,
    },
    filterType: {
        color: 'black',

    }
});

const Filter = () => {
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleFilter = () => {
        
    }
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {/* <Typography id="discrete-slider-restrict" gutterBottom className={classes.filterType}>
                Filter by course code
            </Typography>
            <Slider
                value={code}
                getAriaValueText={valuetext}
                valueLabelFormat={valueLabelFormat}
                aria-labelledby="discrete-slider-restrict"
                step={null}
                valueLabelDisplay="auto"
                marks={codes}
                onChange={(e, val) => setCode(val)}
            /> */}
            <FormControl component="fieldset">
                <FormLabel component="legend">Filter by course code</FormLabel>
                <RadioGroup
                    aria-label="course-code"
                    name="course code"
                    value={value}
                    onChange={handleChange}
                    row
                >
                    <FormControlLabel value="comp1511" control={<Radio />} label="COMP1511" />
                    <FormControlLabel value="comp1521" control={<Radio />} label="COMP1521" />
                </RadioGroup>
                <Button variant="contained" color="primary" onClick={handleFilter}>
                    Filter
                </Button>
            </FormControl>
        </div>
    );
};

export default Filter;