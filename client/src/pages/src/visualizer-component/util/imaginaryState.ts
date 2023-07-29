import { BackendLinkedList, ParsedBackendLinkedListUpdate } from '../types/graphState';

export const IMAGINARY_STATE_1: BackendLinkedList = {
  nodes: [
    {
      nodeId: '0x000001',
      value: '32',
      next: '0x000002',
      isPointer: true,
    },
    {
      nodeId: '0x000002',
      value: '15',
      next: '0x000003',
      isPointer: false,
    },
    {
      nodeId: '0x000003',
      value: '32',
      next: '0x000004',
      isPointer: false,
    },
    {
      nodeId: '0x000004',
      value: '44',
      next: null,
      isPointer: false,
    },
  ],
};

export const IMAGINARY_UPDATE: ParsedBackendLinkedListUpdate[] = [
  {
    modified: [],
    deleted: [],
  },
];
