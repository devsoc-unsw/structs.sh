export interface IFileSystem {
  initialize(): IFileDirNode;

  addFile(file: IFileFileNode): void;
  addDir(file: IFileDirNode): void;

  // return the root node so we can access all children nodes
  // when we implement the front end file selector, we could just display this return result on the FE
  getRootDirectory(): IFileDirNode;
  getFileFromPath(path: string): IFileFileNode | undefined;
  getDirFromPath(path: string): IFileDirNode | undefined;

  deleteFile(file: IFileFileNode | IFileDirNode): void;

  // Pass back root directory
  saveChanges(): void;
}

export interface IFileBaseNode {
  name: string;
  path: string;
  type: 'dir' | 'file';
}

export interface IFileFileNode extends IFileBaseNode {
  data: string;
  type: 'file';
  parentPath: string;
}

export interface IFileDirNode extends IFileBaseNode {
  children: { [key: string]: IFileDirNode | IFileFileNode };
  type: 'dir';
  parentPath: string | undefined;
}

export const INITIAL_LOCAL_STORAGE_FS: IFileDirNode = {
  name: 'root',
  path: 'root',
  type: 'dir',
  parentPath: undefined,
  children: {
    'file1.c': {
      name: 'file1.c',
      path: 'root/file1.c',
      data: '// A empty file 1',
      type: 'file',
      parentPath: 'root',
    },
    'file2.c': {
      name: 'file2.c',
      path: 'root/file2.c',
      data: '// A empty file 3',
      type: 'file',
      parentPath: 'root',
    },
    'file3.c': {
      name: 'file3.c',
      path: 'root/file3.c',
      data: '// A empty file 3',
      type: 'file',
      parentPath: 'root',
    },
  },
};
