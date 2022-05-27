import { Text, Rect } from '@svgdotjs/svg.js';

export interface CodeLine {
  rectTarget: Rect;
  textTarget: Text;
}

export interface OperationUsage {
  args: string[];
  description: string;
  id?: number;
}

export enum DataStructure {
  LINKED_LISTS = 'linked lists',
  BINARY_SEARCH_TREE = 'binary search trees',
  AVL_TREES = 'avl trees',
}
export interface Documentation {
  [command: string]: OperationUsage;
}
