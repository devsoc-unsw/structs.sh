import { Theme, useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { Folder, FolderOpen, Code } from '@mui/icons-material';
import { SiC } from 'react-icons/si';

const TopicTree = () => {
  const theme: Theme = useTheme();
  return (
    <Box height="100%" paddingLeft={2} bgcolor={theme.palette.background.default}>
      <TreeView
        defaultCollapseIcon={<FolderOpen />}
        defaultExpandIcon={<Folder />}
        defaultEndIcon={<SiC size="50%" />}
        sx={{ width: '12vw' }}
      >
        <TreeItem nodeId="1" label="Linked List">
          <TreeItem nodeId="2" label="linked_list.c" />
          <TreeItem nodeId="3" label="prepend.c" />
          <TreeItem nodeId="4" label="append.c" />
          <TreeItem nodeId="5" label="insert.c" />
          <TreeItem nodeId="6" label="search.c" />
          <TreeItem nodeId="7" label="delete.c" />
        </TreeItem>
        <TreeItem nodeId="8" label="Binary Search Tree">
          <TreeItem nodeId="9" label="bst.c" />
          <TreeItem nodeId="10" label="insert.c" />
          <TreeItem nodeId="11" label="traversal.c" />
          <TreeItem nodeId="12" label="rotation.c" />
          <TreeItem nodeId="13" label="search.c" />
          <TreeItem nodeId="14" label="delete.c" />
        </TreeItem>
        <TreeItem nodeId="15" label="Graphs">
          <TreeItem nodeId="16" label="graph.c" />
          <TreeItem nodeId="17" label="traversal.c" />
          <TreeItem nodeId="18" label="mst.c" />
        </TreeItem>
      </TreeView>
    </Box>
  );
};

export default TopicTree;
