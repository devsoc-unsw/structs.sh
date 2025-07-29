import React, { useState, useReducer } from 'react';
import { Tooltip } from '@mui/material';
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
import { handleWorkspaceOpen } from 'visualiser-debugger/Store/onboardingStore';
import Folder from './Folder';
import './css/WorkspaceSelector.css';
import { useUserFsStateStore } from '../../Store/userFsStateStore';
import { IFileDirNode, IFileFileNode, IFileType } from './FS/IFileSystem';

const WorkspaceSelector = () => {
  const { fileSystem, currFocusDirPath, currFocusFilePath } = useUserFsStateStore.getState();
  let currFocus = currFocusFilePath || currFocusDirPath;
  const [open, setOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [type, setType] = useState<IFileType | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [, forceRerender] = useReducer((x) => x + 1, 0);
  const fileButtonStyle = {
    maxWidth: '30px',
    maxHeight: '30px',
    minWidth: '30px',
    minHeight: '30px',
  };

  const handleClickOpen = (buttonType: IFileType) => {
    setType(buttonType);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewItemName('');
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
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
    const dirToDelete = fileSystem.getDirFromPath(currFocus);
    const fileToDelete = fileSystem.getFileFromPath(currFocus);
    if (!dirToDelete && !fileToDelete) {
      alert('No folder selected or folder does not exist');
      return;
    }
    if (fileToDelete) {
      fileSystem.deleteFile(fileToDelete);
    } else if (dirToDelete) {
      fileSystem.deleteFile(dirToDelete);
    }
    fileSystem.saveChanges();
    forceRerender();
    currFocus = 'root';
    handleDeleteClose();
  };

  return (
    <Box>
      <Box className="root-container">
        <Box sx={{ flexGrow: 1, flexShrink: 2 }}>Root</Box>
        <Box style={{ display: 'flex' }}>
          <Tooltip title="Create new file">
            <Button
              onClick={() => handleClickOpen('File')}
              className="Onboarding-fileButton"
              style={fileButtonStyle}
            >
              <AddIcon style={{ fontSize: '20px', fill: 'var(--icon-primary)' }} />
            </Button>
          </Tooltip>
          <Tooltip title="Create new folder">
            <Button
              onClick={() => handleClickOpen('Folder')}
              className="Onboarding-folderButton"
              style={fileButtonStyle}
            >
              <CreateNewFolderIcon style={{ fontSize: '20px', fill: 'var(--icon-primary)' }} />
            </Button>
          </Tooltip>
          <Tooltip title="Delete this file">
            <Button
              onClick={() => handleDeleteOpen()}
              className="Onboarding-deleteButton"
              style={fileButtonStyle}
            >
              <RemoveCircleOutlineIcon style={{ fontSize: '20px', fill: 'var(--icon-primary)' }} />
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <div
        className="rootDirectory"
        onClick={handleWorkspaceOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleWorkspaceOpen();
          }
        }}
      >
        {fileSystem ? (
          <div className="Onboarding-rootContent">
            <Folder folder={fileSystem.getRootDirectory()} depth={0} />
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Create New {type}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name for the new {type}:
          </DialogContentText>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!newItemName.trim()}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Are you sure you want to delete this file?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting is a permanent action. Once deleted, files cannot be recovered. Are you sure
            you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkspaceSelector;