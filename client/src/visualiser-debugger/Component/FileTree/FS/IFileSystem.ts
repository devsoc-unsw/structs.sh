export interface IFileSystem {
  createFile(file: IFileFileNode | IFileDirNode): void;

  // TODO: Figure out
  deleteFile(file: IFileFileNode | IFileDirNode): void;

  // TODO: Refactor to be more generic
  saveChanges(): void;

  // return the root node so we can access all children nodes
  // when we implement the front end file selector, we could just display this return result on the FE
  viewAllFiles(): IFileDirNode;

  // Pass back root directory
  initialize(): IFileDirNode;
}

export interface IFileBaseNode {
  name: string;
  // This is identify
  path: string;
  type: 'dir' | 'file';
}

export interface IFileFileNode extends IFileBaseNode {
  data: string;
  type: 'file';
  parent: IFileDirNode;
}

export interface IFileDirNode extends IFileBaseNode {
  parent: IFileDirNode | undefined;
  children: { [key: string]: IFileDirNode | IFileFileNode };
  type: 'dir';
}
