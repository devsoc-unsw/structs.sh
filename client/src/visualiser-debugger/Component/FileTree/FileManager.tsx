import React, { useState } from 'react';
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
import Folder from './Folder';
import './css/WorkspaceSelector.css';
import { useUserFsStateStore } from '../../Store/userFsStateStore';
import { IFileDirNode, IFileFileNode, IFileType } from './FS/IFileSystem';

const WorkspaceSelector = () => {
  const { fileSystem, currFocusDirPath } = useUserFsStateStore.getState();
  const [open, setOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [type, setType] = useState<IFileType | null>(null);

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

  return (
    <Box>
      <Box className="root-container">
        <Box sx={{ flexGrow: 1 }}>Root</Box>
        <Box>
          <Button onClick={() => handleClickOpen('File')} className="icon-button">
            <AddIcon style={{ fontSize: '20px' }} />
          </Button>
          <Button onClick={() => handleClickOpen('Folder')} className="icon-button">
            <CreateNewFolderIcon style={{ fontSize: '20px' }} />
          </Button>
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
