import { useState } from "react"
import { dropdownStyle } from "./WorkspaceStyles";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { IFileDirNode, IFileFileNode } from "./FS/IFileSystem";
import LeafFile from "./LeafFile";

export interface FolderParam {
    folder: IFileDirNode;
}

const Folder = ({folder}: FolderParam) => {
    const [isExpanded, setExpanded] = useState<boolean>(false);

    const expandFolder = () => {
        setExpanded(!isExpanded);
    }

    const showChildren = () => {
        const children: React.ReactNode[] = [];

        for (let key in folder.children) {
            let child = folder.children[key];
            switch(child.type) {
                case 'file':
                    children.push(LeafFile(child as IFileFileNode));
                    break; // Add break statement to prevent fall-through
                case "dir":
                    children.push(<Folder folder={child as IFileDirNode} />); // Cast child as IFileDirNode
                    break; // Add break statement to prevent fall-through
            }
        }

        return children;
    }
    
    return (
        <div> 
            {isExpanded? (
               <ExpandLessIcon
                onClick={expandFolder}
                style={dropdownStyle}
               >

               </ExpandLessIcon>
               {folder?.name}

                <div>{showChildren()}</div>  
            )
             : 
             (
               <ExpandMoreIcon
                onClick = {expandFolder}
                style = {dropdownStyle}
               >
               </ExpandMoreIcon>
                {folder?.name}
             )
            }
        </div>
    );
}

export default Folder