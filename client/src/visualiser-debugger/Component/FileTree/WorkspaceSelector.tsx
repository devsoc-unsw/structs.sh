/* eslint-disable */
// TODO: Proper rework on this file => we want to re-design this anyway. I can't fix lint now because it will potentially change functioanlity of the file
import { useEffect, useState } from 'react';
import Select, { SelectItem } from 'components/Select/Select';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { SERVER_URL } from 'utils/constants';
import axios from 'axios';
import styled from '@emotion/styled';
import {
  dropDownDivStyle,
  dropDownTextStyle,
  buttonStyle,
  dropdownStyle,
  createButtonStyle,
} from './WorkspaceStyles';
import FileSelector from './FileSelector';
import { PLACEHOLDER_USERNAME, PLACEHOLDER_WORKSPACE, loadWorkspaces } from './Util/util';

// TODO: Unify debug mode
const DEBUG_MODE = true;

const WorkspaceSelector = ({
  programName,
  onChangeWorkspaceName,
  onChangeProgramName,
}: {
  programName: string;
  onChangeWorkspaceName: (workspaceName: string) => void;
  onChangeProgramName: (programName: string) => void;
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceInput, setWorkspaceInput] = useState('');
  const [filenames, setFilenames] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const loadWorkspaces = async () => {
      const data = {
        username: PLACEHOLDER_USERNAME,
      };

      let allWorkspaces = [];
      await axios.get(`${SERVER_URL}/api/retrieveWorkspaces`, { params: data }).then((response) => {
        if (response.data.hasOwnProperty('error')) {
          console.log(response.data);
        } else {
          allWorkspaces = response.data.workspaces;
        }
      });

      setWorkspaces(allWorkspaces);
    };

    loadWorkspaces();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const createWorkspace = (event) => {
    event.preventDefault();
    if (workspaceInput === '' || workspaces.includes(workspaceInput)) {
      console.log('error: invalid input: workspace already exists or no input given');
      setDropdownOpen(false);
      return;
    }

    const data = {
      username: PLACEHOLDER_USERNAME,
      workspaceName: workspaceInput,
    };

    let returnFlag = false;
    axios.post(`${SERVER_URL}/api/saveWorkspace`, data).then((response) => {
      if (response.data.hasOwnProperty('error')) {
        returnFlag = true;
      }
    });

    if (returnFlag) {
      setDropdownOpen(false);
      return;
    }

    setWorkspaces([...workspaces, workspaceInput]);
    setDropdownOpen(false);
  };

  const handleInputChange = (event) => {
    setWorkspaceInput(event.target.value);
  };

  const retrieveWorkspace = (name) => {
    if (name == '') {
      return;
    }

    const data = {
      username: PLACEHOLDER_USERNAME,
      workspaceName: name,
    };

    let returnFlag = false;
    axios.get(`${SERVER_URL}/api/retrieveFilesInWorkspace`, { params: data }).then((response) => {
      const newFiles = response.data.files;
      if (!response.data.hasOwnProperty('error')) {
        setFilenames(newFiles);
      } else {
        returnFlag = true;
        console.log(response);
      }
    });

    if (returnFlag) {
      return;
    }

    onChangeWorkspaceName(name);
    setWorkspaceName(name);
  };

  const getCurrentWorkspaceName = (): String => {
    return workspaceName;
  };

  const WorkSpaceMenu = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: 'center';
  `;

  return (
    <Box>
      <WorkSpaceMenu>
      <div>Select Workspace</div>
        <Button
          onClick={toggleDropdown}
          style={buttonStyle}
          variant="text"
          size="small"
          color="primary"
        >
          +
        </Button>
      </WorkSpaceMenu>
      {isDropdownOpen ? (
        <Box style={dropDownDivStyle} sx={{ position: 'absolute' }}>
          <Paper style={dropdownStyle} elevation={3} sx={{ position: 'absolute' }}>
            <form onSubmit={createWorkspace}>
              <input
                style={dropDownTextStyle}
                placeholder="Enter Workspace Name"
                value={workspaceInput}
                onChange={handleInputChange}
              />
            </form>
            <Button onClick={createWorkspace} style={createButtonStyle} variant="contained">
              Create Workspace
            </Button>
          </Paper>
        </Box>
      ) : (
        ''
      )}
      <div style={{ paddingTop: '10px' }}>
        <Select onValueChange={retrieveWorkspace} placeholder="Select Workspace...">
          {workspaces.map((workspace, index) => (
            <SelectItem style={{ fontSize: '13px' }} value={workspace} className="" key={index}>
              {workspace}
            </SelectItem>
          ))}
        </Select>
      </div>
      <FileSelector
        onChangeProgramName={onChangeProgramName}
        getCurrentWorkspaceName={getCurrentWorkspaceName}
        // retrieveWorkspace={retrieveWorkspace}
      />
    </Box>
  );
};
export default WorkspaceSelector;
