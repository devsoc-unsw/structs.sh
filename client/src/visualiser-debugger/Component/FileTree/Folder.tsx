import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { dropdownStyle } from './WorkspaceStyles';
import { IFileDirNode, IFileFileNode } from './FS/IFileSystem';
import LeafFile from './LeafFile';

export interface FolderParam {
  folder: IFileDirNode;
}

const Folder = ({ folder }: FolderParam) => {
  const [isExpanded, setExpanded] = useState<boolean>(false);

  const expandFolder = () => {
    setExpanded(!isExpanded);
  };

  const showChildren = () => {
    const children: React.ReactNode[] = [];

    Object.keys(folder.children).forEach((key) => {
      const child = folder.children[key];
      if (Object.prototype.hasOwnProperty.call(folder.children, key)) {
        switch (child.type) {
          case 'file':
            children.push(LeafFile(child as IFileFileNode));
            break;
          case 'dir':
            children.push(<Folder folder={child as IFileDirNode} />);
            break;
          default:
            break;
        }
      }
    });

    return children;
  };

  return (
    <div>
      {isExpanded ? (
        <>
          <ExpandLessIcon onClick={expandFolder} style={dropdownStyle} />
          {folder?.name}

          <div>{showChildren()}</div>
        </>
      ) : (
        <>
          <ExpandMoreIcon onClick={expandFolder} style={dropdownStyle} />
          {folder?.name}
        </>
      )}
    </div>
  );
};

export default Folder;
