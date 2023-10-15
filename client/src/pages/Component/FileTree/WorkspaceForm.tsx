import { useState } from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { dropDownDivStyle, dropDownTextStyle, buttonStyle, dropdownStyle, createButtonStyle } from './WorkspaceStyles';
import { SERVER_URL } from 'utils/constants';
import axios from 'axios';

function WorkspaceForm() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [createButtonClicked, setCreateButtonClicked] = useState(false);
  const [workspaceInput, setWorkspaceInput] = useState('');

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
    setButtonClicked(!buttonClicked);
  };

  const toggleCreateWorkspace = (event) => {
    event.preventDefault();
    setCreateButtonClicked(!createButtonClicked);
    console.log(workspaceInput)

    const data = {
      username: 'benp123',
      workspaceName: workspaceInput
    };

    axios.post(SERVER_URL + '/api/saveWorkspace', data).then((respsonse) => {
      console.log(respsonse.data)
    });
  }

  const handleInputChange = (event) => {
    setWorkspaceInput(event.target.value);
  }

  return (
    <Box>
      <Button onClick={toggleDropdown} style={buttonStyle} variant="text" size="small" color="primary">+</Button>
      {isDropdownOpen ?
        <Box style= {dropDownDivStyle}  sx={{ position: 'absolute'}}>
            <Paper style={dropdownStyle} elevation={3} sx={{ position: 'absolute'}}>
            <form onSubmit={toggleCreateWorkspace}>
              <input style={dropDownTextStyle} placeholder='Enter Workspace Name' value={workspaceInput} onChange={handleInputChange}></input>
            </form>
            <Button onClick={toggleCreateWorkspace} style={createButtonStyle} variant="contained" >
                Create Workspace
            </Button>
            </Paper>
        </Box>
      : ''}
    </Box>
  );
}
export default WorkspaceForm;