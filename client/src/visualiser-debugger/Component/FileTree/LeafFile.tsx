import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { IFileFileNode } from './FS/IFileSystem';
import { useUserFsStateStore } from '../../Store/userFsStateStore';

export interface LeafFileParam {
  file: IFileFileNode;
  depth: number;
}

const LeafFile = ({ file, depth }: LeafFileParam) => {
  const { currFocusFilePath, setFocusFilePath, setFocusDirPath } = useUserFsStateStore();
  const isHighlighted = currFocusFilePath === file.path;


  const indentStyle = {
    marginLeft: `${10 + depth * 12}px`,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: isHighlighted ? '#e0e0e0' : 'transparent',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  };

  const handleFileClick = () => {
    setFocusFilePath(file.path);
    setFocusDirPath(file.parentPath);
  };

  return (
    <Box sx={indentStyle} onClick={handleFileClick}>
      <InsertDriveFileIcon fontSize="small" style={{ fontSize: '12px' }} />
      <Typography
        variant="body2"
        sx={{ marginLeft: '5px', userSelect: 'none', fontSize: '0.85rem' }}
      >
        {file.name}
      </Typography>
    </Box>
  );
};

export default LeafFile;
