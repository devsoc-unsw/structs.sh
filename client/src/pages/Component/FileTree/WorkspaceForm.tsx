import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { style } from 'd3';

function WorkspaceForm() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    console.log(isDropdownOpen)
  };

  const buttonStyle = {
    minWidth: '20px',
    minHeight: '20px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 0 5px 1px rgba(0, 0, 0, 0.15)',
    height: '20px',
    width: '20px',
    top: '6px',
  }

  const dropDownDivStyle = {
    top: '120px',
    minHeight: '63px',
    minWidth: '200px',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 0 5px 1px rgba(0, 0, 0, 0.2)'
  }

  const dropdownStyle = {
    height: '25px',
    width: '200px',
    borderRadius: '10px',
    boxShadow: '0 0 10px 1px rgba(0, 0, 0, 0.15)'
  }

  const dropDownTextStyle = {
    backgroundColor: '#FFFFFF',
    height: '25px',
    width: '190px',
    borderRadius: '5px',
    paddingLeft: '10px',
    color: '#544B8C'
  }

  const createButtonStyle = {
    backgroundColor: '#FFFFFF',
    color: '#544B8C',
    boxShadow: '0 0 5px 1px rgba(0, 0, 0, 0.15)',
    fontSize: '12px',
    width: '200px',
    top: '10px',
    height: '25px',
  }


  return (
    <Box>
      <Button onClick={toggleDropdown} style={buttonStyle} variant="text" size="small" color="primary">
        +
      </Button>
      {isDropdownOpen ?
        <Box style= {dropDownDivStyle}  sx={{ position: 'absolute'}}>
            <Paper style={dropdownStyle} elevation={3} sx={{ position: 'absolute'}}>
            <input style={dropDownTextStyle} placeholder='Enter Workspace Name'></input>
            <Button style={createButtonStyle} variant="contained" >
                Create Workspace
            </Button>
            </Paper>
        </Box>
      : ''}
    </Box>
  );
}
export default WorkspaceForm;