import { BackendStructure, BackendUpdate, CType } from '../types/graphState';

export const IMAGINARY_STATES: BackendStructure[] = [
  {
    '0x1': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '27',
        next: '0x0',
      },
    },
  },
  {
    '0x1': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '27',
        next: '0x2',
      },
    },
    '0x2': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '34',
        next: '0x0',
      },
    },
  },
  {
    '0x1': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '27',
        next: '0x2',
      },
    },
    '0x2': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '34',
        next: '0x3',
      },
    },
    '0x3': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '56',
        next: '0x0',
      },
    },
  },
  {
    '0x1': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '27',
        next: '0x3',
      },
    },
    '0x3': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '56',
        next: '0x0',
      },
    },
    '0x4': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '72',
        next: '0x1',
      },
    },
  },
  {
    '0x1': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '27',
        next: '0x3',
      },
    },
    '0x3': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '56',
        next: '0x0',
      },
    },
    '0x4': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '72',
        next: '0x1',
      },
    },
    '0x5': {
      type: CType.SINGLE_LINED_LIST_NODE,
      is_pointer: false,
      data: {
        data: '21',
        next: '0x3',
      },
    },
  },
];

export const IMAGINARY_UPDATE: BackendUpdate[] = [
  {
    modified: {},
    removed: [],
  },
];
