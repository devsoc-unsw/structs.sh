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
  LINKED_LISTS = 'Linked Lists',
  BINARY_SEARCH_TREE = 'Binary Search Trees',
  AVL_TREE = 'AVL Trees',
  SORTING = 'Sorting Algorithms',
}

export interface Documentation {
  [command: string]: OperationUsage;
}
