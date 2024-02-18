import Select, { SelectItem } from 'components/Select/Select';
import { useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import { SERVER_URL } from 'utils/constants';
import axios from 'axios';
import { PLACEHOLDER_USERNAME } from './Util/util';
import {
  buttonStyle,
  createButtonStyle,
  dropDownDivStyleFiles,
  dropDownTextStyle,
  dropdownStyle,
} from './WorkspaceStyles';

const FileSelector = ({
  onChangeProgramName,
  getCurrentWorkspaceName,
}: {
  onChangeProgramName: (programName: String) => void;
  getCurrentWorkspaceName: () => String;
  retrieveWorkspace: (name: String) => void;
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [fileInput, setFileInput] = useState('');
  const [files, setFiles] = useState([]);

  const workspaceName = getCurrentWorkspaceName();
  if (workspaceName !== '') {
    axios
      .get(`${SERVER_URL}/api/retrieveFilesInWorkspace`, {
        params: {
          username: PLACEHOLDER_USERNAME,
          workspaceName,
        },
      })
      .then((response) => {
        if (!Object.prototype.hasOwnProperty.call(response.data, 'error')) {
          const newFiles = response.data.files;
          setFiles(newFiles);
        } else {
          console.log(response.data);
        }
      });
  }

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleInputChange = (event) => {
    setFileInput(event.target.value);
  };

  const createFile = (event) => {
    event.preventDefault();
    if (fileInput === '' || files.some((file) => file.name === fileInput)) {
      return;
    }

    const currentWorkspace = getCurrentWorkspaceName();
    const data = {
      username: PLACEHOLDER_USERNAME,
      workspace: currentWorkspace,
      filename: fileInput,
      fileData: '',
    };

    axios.post(`${SERVER_URL}/api/saveFile`, data).then((response) => {
      console.log(response.data);
      if (!Object.prototype.hasOwnProperty.call(response.data, 'error')) {
        files.push({ name: fileInput, text: '' });
      }
    });

    setDropdownOpen(false);

    axios
      .get(`${SERVER_URL}/api/retrieveFilesInWorkspace`, {
        params: {
          username: PLACEHOLDER_USERNAME,
          workspaceName: currentWorkspace,
        },
      })
      .then((response) => {
        const newFiles = response.data.files;
        setFiles(newFiles);
      });
  };

  return (
    <div style={{ paddingTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <div style={{ position: 'relative', top: '3px' }}>Select File</div>
        <Button
          onClick={toggleDropdown}
          style={buttonStyle}
          variant="text"
          size="small"
          color="primary"
        >
          +
        </Button>
      </div>
      <div style={{ paddingTop: '10px' }} />
      {isDropdownOpen ? (
        <Box style={dropDownDivStyleFiles} sx={{ position: 'absolute' }}>
          <Paper style={dropdownStyle} elevation={3} sx={{ position: 'absolute' }}>
            <form onSubmit={createFile}>
              <input
                style={dropDownTextStyle}
                placeholder="Enter File Name"
                value={fileInput}
                onChange={handleInputChange}
              />
            </form>
            <Button onClick={createFile} style={createButtonStyle} variant="contained">
              Create File
            </Button>
          </Paper>
        </Box>
      ) : (
        ''
      )}
      <Select onValueChange={onChangeProgramName} placeholder="Select File...">
        {files.map((file, index: number) => (
          <SelectItem style={{ fontSize: '13px' }} value={file.name} className="" key={index}>
            {file.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default FileSelector;
