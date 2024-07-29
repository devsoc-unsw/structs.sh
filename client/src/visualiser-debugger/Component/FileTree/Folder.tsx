import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, IconButton, Typography } from '@mui/material';
import { IFileDirNode } from './FS/IFileSystem';
import LeafFile from './LeafFile';
import { useUserFsStateStore } from '../../Store/userFsStateStore';
import { assertUnreachable } from '../Visualizer/Util/util';

export interface FolderParam {
  folder: IFileDirNode;
  depth: number;
}

const Folder = ({ folder, depth }: FolderParam) => {
  const { setFocusDirPath } = useUserFsStateStore();
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const expandFolder = () => {
    if (!isExpanded) {
      setFocusDirPath(folder.path);
    }
    setExpanded(!isExpanded);
  };

  const indentStyle = {
    margin: '0px',
    padding: '0px',
    marginLeft: `${depth * 12}px`,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
    height: '20px',
  };

  const iconStyle = {
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.3s',
  };

  const showChildren = () => {
    const children: React.ReactNode[] = [];

    Object.keys(folder.children).forEach((key) => {
      const child = folder.children[key];
      if (Object.prototype.hasOwnProperty.call(folder.children, key)) {
        switch (child.type) {
          case 'file':
            children.push(<LeafFile file={child} depth={depth + 1} key={key} />);
            break;
          case 'dir':
            children.push(<Folder folder={child as IFileDirNode} depth={depth + 1} key={key} />);
            break;
          default:
            assertUnreachable(child);
            break;
        }
      }
    });

    return children;
  };

  return (
    <Box>
      <Box sx={indentStyle} component="div" onClick={expandFolder}>
        <IconButton size="small" style={iconStyle}>
          <ExpandMoreIcon fontSize="inherit" style={{ fontSize: '16px' }} />
        </IconButton>
        <Typography variant="body2" sx={{ flexGrow: 1, userSelect: 'none', fontSize: '0.85rem' }}>
          {folder.name}
        </Typography>
      </Box>
      {isExpanded && <Box>{showChildren()}</Box>}
    </Box>
  );
};

export default Folder;
