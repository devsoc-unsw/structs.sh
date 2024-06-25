import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AddIcon from '@mui/icons-material/Add';
import { IFileSystem } from './FS/IFileSystem';
import { LocalStorageFS } from './FS/LocalStorageFS';
import Folder from './Folder';
import './css/WorkspaceSelector.css';

const WorkspaceSelector = () => {
  const [fs, setFs] = useState<IFileSystem | null>(null);

  useEffect(() => {
    const newFs = new LocalStorageFS();
    newFs.initialize();
    setFs(newFs);
    console.log('console', newFs);
  }, []);

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
      {fs ? <Folder folder={fs.getRootDirectory()} depth={0} /> : <div>Loading...</div>}
    </Box>
  );
};

export default WorkspaceSelector;
