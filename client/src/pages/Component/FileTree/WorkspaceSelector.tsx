import { useState } from 'react';
import Select, { SelectItem } from 'components/Select/Select';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { dropDownDivStyle, dropDownTextStyle, buttonStyle, dropdownStyle, createButtonStyle } from './WorkspaceStyles';
import { SERVER_URL } from 'utils/constants';
import axios from 'axios';
import styled from '@emotion/styled';
import FileSelector from './FileSelector';
import { PLACEHOLDER_PROGRAMS } from '../../../constants';

const WorkspaceSelector = ({
  programName,
  onChangeProgramName
}: {
  programName: string;
  onChangeProgramName: (programName: string) => void;
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [workspaceInput, setWorkspaceInput] = useState('');
  const [workspaces, setWorkspaces] = useState(['PLACE_HOLDER_WORKSPACE']);
  const [filenames, setFilenames] = useState(PLACEHOLDER_PROGRAMS);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const createWorkspace = (event) => {
    event.preventDefault();
    if (workspaceInput === '' || workspaces.includes(workspaceInput)) {
      console.log('empty input');
      return;
    }

    const data = {
      username: 'benp123',
      workspaceName: workspaceInput
    };

    axios.post(SERVER_URL + '/api/saveWorkspace', data).then((respsonse) => {
      console.log("Saved workspace: ", respsonse.data)
    });

    setWorkspaces([...workspaces, workspaceInput]);
    setDropdownOpen(false);
  }

  const handleInputChange = (event) => {
    setWorkspaceInput(event.target.value);
  }

  const retrieveWorkspace = (name) => {
    const data = {
      username: 'benp123',
      workspaceName: name
    };

    axios.get(SERVER_URL + '/api/retrieveFilesInWorkspace', { params: data }).then((response) => {
      const newFiles = response.data.files;
      setFilenames(newFiles);
    })
  }

  const WorkSpaceMenu = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: 'center';
  `

  return (
    <Box>
      <WorkSpaceMenu>
        <div>Select Workspace</div>
        <Button onClick={toggleDropdown} style={buttonStyle} variant="text" size="small" color="primary">+</Button>
      </WorkSpaceMenu>
      {isDropdownOpen ?
    <Box style= {dropDownDivStyle}  sx={{ position: 'absolute'}}>
        <Paper style={dropdownStyle} elevation={3} sx={{ position: 'absolute'}}>
        <form onSubmit={createWorkspace}>
          <input style={dropDownTextStyle} placeholder='Enter Workspace Name' value={workspaceInput} onChange={handleInputChange}></input>
        </form>
        <Button onClick={createWorkspace} style={createButtonStyle} variant="contained" >
            Create Workspace
        </Button>
        </Paper>
    </Box>
  : ''}
      <div style={{paddingTop: '10px'}}>
        <Select
          onValueChange={retrieveWorkspace}
          placeholder="Select Workspace..."
        >
          {workspaces.map((workspace, index) => (
            <SelectItem style={{ fontSize: '13px' }} value={workspace} className="" key={index}>
              {workspace}
            </SelectItem>
          ))}
        </Select>
      </div>
      <FileSelector
        programName={programName}
        onChangeProgramName={onChangeProgramName}
        files={filenames}
      />
    </Box>
  );
}
export default WorkspaceSelector;