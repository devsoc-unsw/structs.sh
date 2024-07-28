import React, { useEffect, useState, useReducer } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Folder from './Folder';
import './css/WorkspaceSelector.css';
import { useUserFsStateStore } from '../../Store/userFsStateStore';
import { IFileDirNode, IFileFileNode, IFileType } from './FS/IFileSystem';
import { Tooltip } from '@mui/material';

const WorkspaceSelector = () => {
  let { fileSystem, currFocusDirPath, currFocusFilePath } = useUserFsStateStore.getState();
  let currFocus = currFocusFilePath || currFocusDirPath;
  
  const [open, setOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [type, setType] = useState<IFileType | null>(null);
  
  const [, forceRerender] = useReducer(x => x + 1, 0);
  const fileButtonStyle = {
    maxWidth: '30px',
    maxHeight: '30px',
    minWidth: '30px',
    minHeight: '30px'
  }

    const handleClickOpen = (buttonType: IFileType) => {
      setType(buttonType);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setNewItemName(''); // Reset the input name after closing the dialog
    };

  const handleCreate = () => {
    const parentDir = fileSystem.getDirFromPath(currFocusDirPath);
    if (!parentDir) {
      alert('No directory selected or directory does not exist.');
      return;
    }
    const newPath = `${currFocusDirPath}/${newItemName}`;
    if (type === 'File') {
      const newFile: IFileFileNode = {
        name: newItemName,
        path: newPath,
        type: 'file',
        data: '',
        parentPath: currFocusDirPath,
      };
      if (!fileSystem.addFile(newFile)) {
        alert('File already exists.');
      }
    } else if (type === 'Folder') {
      const newFolder: IFileDirNode = {
        name: newItemName,
        path: newPath,
        type: 'dir',
        children: {},
        parentPath: currFocusDirPath,
      };
      if (!fileSystem.addDir(newFolder)) {
        alert('Folder already exists.');
      }
    }

    fileSystem.saveChanges();
    handleClose();
  };

  const handleDelete = () => {
    const dirToDelete= fileSystem.getDirFromPath(currFocus);
    const fileToDelete = fileSystem.getFileFromPath(currFocus);
    if (!dirToDelete && !fileToDelete) {
      alert('No folder selected or folder does not exist');
      return;
    }
    if (fileToDelete) {
      fileSystem.deleteFile(fileToDelete);
    } else {
      fileSystem.deleteFile(dirToDelete);
    }
    fileSystem.saveChanges();
    forceRerender();
    currFocus = "root"
    return;
  }

  return (
    <Box>
      <Box className="root-container">
        <Box sx={{ flexGrow: 1, flexShrink: 2 }}>Root</Box>
        <Box style={{ display: 'flex' }}>
          <Tooltip title="Create new file">
            <Button onClick={() => handleClickOpen('File')} className="icon-button" style={fileButtonStyle}>
              <AddIcon style={{ fontSize: '20px' }} />
            </Button>
          </Tooltip>
          <Tooltip title="Create new folder">
            <Button onClick={() => handleClickOpen('Folder')} className="icon-button" style={fileButtonStyle}>
              <CreateNewFolderIcon style={{ fontSize: '20px' }} />
            </Button>
          </Tooltip>
          <Tooltip title="Delete this file">
            <Button onClick={() => handleDelete()} className="icon-button" style={fileButtonStyle}>
              <RemoveCircleOutlineIcon style={{ fontSize: '20px' }} />
            </Button>
          </Tooltip>
        </Box>
      </Box>
      {fileSystem ? (
        <Folder folder={fileSystem.getRootDirectory()} depth={0} />
      ) : (
        <div>Loading...</div>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'white',
            color: 'black',
          },
        }}
      >
        <DialogTitle>Create New {type}</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the name for the new {type}:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            sx={{
              '& input': {
                // Targeting the input element inside the TextField
                color: 'black', // Ensuring the text is black
              },
              '& label': {
                // Targeting the label element inside the TextField
                color: 'black', // Ensuring the label text is black
              },
              '& .MuiOutlinedInput-root': {
                // Targeting the root of the input element for focus color
                '& fieldset': {
                  borderColor: 'black', // Ensuring the border color is black
                },
                '&:hover fieldset': {
                  borderColor: 'black', // Ensuring the hover border color is black
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black', // Ensuring the focused border color is black
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!newItemName.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkspaceSelector;
