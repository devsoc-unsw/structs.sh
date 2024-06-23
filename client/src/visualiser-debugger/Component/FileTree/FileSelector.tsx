// TODO: Proper rework on this file => we want to re-design this anyway. I can't fix lint now because it will potentially change functioanlity of the file
import Select, { SelectItem } from 'components/Select/Select';
import { useEffect, useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import {
  buttonStyle,
  createButtonStyle,
  dropDownDivStyleFiles,
  dropDownTextStyle,
  dropdownStyle,
} from './WorkspaceStyles';
import Folder from './Folder'

// TODO: Put this in the state store
import { LocalStorageFS } from './FS/AxiosStorageFS';
import { AxiosAgent } from './FS/AxiosClient';
import { IFileDirNode } from './FS/IFileSystem';

const fs = new LocalStorageFS();
fs.initialize();
// TODO: Concretize the 'file' property definition
interface FileStub {
  name: string;
  text: string;
}

const FileSelector = ({
  onChangeProgramName,
  currWorkSpaceName,
}: {
  onChangeProgramName: (programName: String) => void;
  currWorkSpaceName: string;
  // retrieveWorkspace: (name: String) => void;
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [currFileName, setCurrFileName] = useState<string>('');
  const [files, setFiles] = useState<FileStub[]>([]);

  // Put this into state, I have defined a service directory
  const axiosAgent = new AxiosAgent();

  useEffect(() => {
    // TODO: Refactor this later
    // Fetch file objects ie "files" from the server according to work space
    if (currWorkSpaceName !== '') {
      axiosAgent.retrieveFiles(currWorkSpaceName, (filesInCallBack: FileStub[]) => {
        setFiles(filesInCallBack);
      });
    }
  }, [currWorkSpaceName]);

  const toggleDropdown = () => {
    console.log('Debug:', currWorkSpaceName, files);
    setDropdownOpen(!isDropdownOpen);
  };

  const setCurrFileNameFromInput = (event) => {
    setCurrFileName(event.target.value);
  };

  const createFile = (event) => {
    console.log('Execute until here before everything crashed event', event);
    event.preventDefault();

    // Frontend
    if (currFileName === '' || files.some((file) => file.name === currFileName)) {
      return;
    }

    setDropdownOpen(false);
    axiosAgent.saveFile(
      currWorkSpaceName,
      currFileName,
      '',
      (filesInCallBack: FileStub[]) => {

        console.log('Execute until here before everything crashed first save', filesInCallBack);
        setFiles(filesInCallBack);
      },
      () => {
        files.push({ name: currFileName, text: '' });
        setFiles((files_) => {
          console.log('Execute until here before everything crashed second save', files_);
          return [...files_, { name: currFileName, text: '' }];
        });
      }
    );

    axiosAgent.retrieveFiles(currWorkSpaceName, (filesInCallBack: FileStub[]) => {
      console.log('Execute until here before everything crashed', filesInCallBack);
      setFiles(filesInCallBack);
    });
  };

  console.log(fs.root);

  return (
    // <div style={{ paddingTop: '10px' }}>
    //   <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
    //     <div style={{ position: 'relative', top: '3px' }}>Select File</div>
    //     <Button
    //       onClick={toggleDropdown}
    //       style={buttonStyle}
    //       variant="text"
    //       size="small"
    //       color="primary"
    //     >
    //       +
    //     </Button>
    //   </div>
    //   <div style={{ paddingTop: '10px' }} />
    //   {isDropdownOpen ? (
    //     <Box style={dropDownDivStyleFiles} sx={{ position: 'absolute' }}>
    //       <Paper style={dropdownStyle} elevation={3} sx={{ position: 'absolute' }}>
    //         <form>
    //           <input
    //             style={dropDownTextStyle}
    //             placeholder="Enter File Name"
    //             value={currFileName}
    //             onChange={setCurrFileNameFromInput}
    //           />
    //         </form>
    //         <Button onClick={createFile} style={createButtonStyle} variant="contained">
    //           Create File
    //         </Button>
    //       </Paper>
    //     </Box>
    //   ) : (
    //     ''
    //   )}
    //   <Select onValueChange={onChangeProgramName} placeholder="Select File...">
    //     {files.map((file, index: number) => (
    //       <SelectItem style={{ fontSize: '13px' }} value={file.name} className="" key={index}>
    //         {file.name}
    //       </SelectItem>
    //     ))}
    //   </Select>
    // </div>

    <Folder folder={fs.root as IFileDirNode}></Folder>
  );
};

export default FileSelector;
