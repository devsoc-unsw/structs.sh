import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { dropdownStyle } from './WorkspaceStyles';
import { IFileFileNode } from './FS/IFileSystem';

const LeafFile = (file: IFileFileNode) => {
  return (
    <div>
      <ExpandMoreIcon style={dropdownStyle} />
      {file?.name}
    </div>
  );
};

export default LeafFile;
