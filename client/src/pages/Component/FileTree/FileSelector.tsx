import Select, { SelectItem } from 'components/Select/Select';
import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { buttonStyle, buttonStyleFiles, createButtonStyle, dropDownDivStyle, dropDownDivStyleFiles, dropDownTextStyle, dropdownStyle } from './WorkspaceStyles';
import { Box, Button, Paper } from '@mui/material';
import { PLACEHOLDER_USERNAME } from './util';
import { SERVER_URL } from 'utils/constants';
import axios from 'axios';

const FileSelector = ({
  onChangeProgramName,
  getCurrentWorkspaceName,
  retrieveWorkspace
}: {
  onChangeProgramName: (programName: String) => void;
  getCurrentWorkspaceName: () => String;
  retrieveWorkspace: (name: String) => void;
}) => {

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [fileInput, setFileInput] = useState('');
  const [files, setFiles] = useState([]);

  const workspaceName = getCurrentWorkspaceName();
  if (workspaceName != ''){
    axios.get(SERVER_URL + '/api/retrieveFilesInWorkspace', { params: {
      username: PLACEHOLDER_USERNAME,
      workspaceName: workspaceName
    } }).then((response) => {
      if (!response.data.hasOwnProperty('error')) {
        const newFiles = response.data.files;
        setFiles(newFiles);
      } else {
        console.log(response.data)
      }
    });
  }

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleInputChange = (event) => {
    setFileInput(event.target.value);
  }

  const createFile = (event) => {
    event.preventDefault();
    if (fileInput == '' || (files.some(file => file.name == fileInput))) {
      return;
    }

    const currentWorkspace = getCurrentWorkspaceName();
    let data = {
      username: PLACEHOLDER_USERNAME,
      workspace: currentWorkspace,
      filename: fileInput,
      fileData: ''
    };

    axios.post(SERVER_URL + '/api/saveFile', data).then((response) => {
      console.log(response.data)
      if (!response.data.hasOwnProperty('error')) {
        files.push({name: fileInput, text: ''})
      }
    });

    setDropdownOpen(false)

    axios.get(SERVER_URL + '/api/retrieveFilesInWorkspace', { params: {
      username: PLACEHOLDER_USERNAME,
      workspaceName: currentWorkspace
    } }).then((response) => {
      const newFiles = response.data.files;
      setFiles(newFiles);
    });
  }

  const FileMenu = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: 'center';
  `
  return (
      <div style={{paddingTop: '10px'}}>
        <FileMenu>
          <div>Select File</div>
          <Button onClick={toggleDropdown} style={buttonStyleFiles} variant="text" size="small" color="primary">+</Button>
        </FileMenu>
        <div style={{paddingTop: '10px'}}></div>
        {isDropdownOpen ?
    <Box style= {dropDownDivStyleFiles}  sx={{ position: 'absolute'}}>
        <Paper style={dropdownStyle} elevation={3} sx={{ position: 'absolute'}}>
        <form onSubmit={createFile}>
          <input style={dropDownTextStyle} placeholder='Enter File Name' value={fileInput} onChange={handleInputChange}></input>
        </form>
        <Button onClick={createFile} style={createButtonStyle} variant="contained">
            Create File
        </Button>
        </Paper>
    </Box>
  : ''}
        <Select
          onValueChange={onChangeProgramName}
          placeholder={"Select File..."}
        >
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
