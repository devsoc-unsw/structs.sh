import { Box, Typography } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { IFileFileNode } from './FS/IFileSystem';

export interface LeafFileParam {
  file: IFileFileNode;
  depth: number;
}

const LeafFile = ({ file, depth }: LeafFileParam) => {
  const indentStyle = {
    marginLeft: `${depth * 15}px`,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  };

  return (
    <Box sx={indentStyle}>
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
