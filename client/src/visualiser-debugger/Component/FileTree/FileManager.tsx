import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AddIcon from '@mui/icons-material/Add';
import Folder from './Folder';
import './css/WorkspaceSelector.css';
import { useUserFsStateStore } from '../../Store/userFsStateStore';

const WorkspaceSelector = () => {
  const { fileSystem } = useUserFsStateStore.getState();

  const handleClickOpen = (_arg: string) => {
    // TODO: Implement
  };

  return (
    <Box>
      <Box className="root-container">
        <Box sx={{ flexGrow: 1 }}>Root</Box>
        <Box>
          <Button onClick={() => handleClickOpen('file')} className="icon-button">
            <AddIcon style={{ fontSize: '20px' }} />
          </Button>
          <Button onClick={() => handleClickOpen('folder')} className="icon-button">
            <CreateNewFolderIcon style={{ fontSize: '20px' }} />
          </Button>
        </Box>
      </Box>
      {fileSystem ? (
        <Folder folder={fileSystem.getRootDirectory()} depth={0} />
      ) : (
        <div>Loading...</div>
      )}
    </Box>
  );
};

export default WorkspaceSelector;
