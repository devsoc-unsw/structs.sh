import { dropdownStyle } from './WorkspaceStyles';
import { IFileFileNode } from './FS/IFileSystem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const LeafFile = (file: IFileFileNode) => {
    return (
        <div>
            <ExpandMoreIcon
            style={dropdownStyle}
            >

            </ExpandMoreIcon>
            {file?.name}
        </div>
    )
}

export default LeafFile