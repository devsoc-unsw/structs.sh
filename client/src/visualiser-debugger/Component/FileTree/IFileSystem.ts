export interface IFileSystem {
  createFile(
    file: IFileFileNode | IFileDirNode,
    files: Array<any>,
    setDropdownOpen: React.Dispatch<React.SetStateAction<Boolean>>,
    setFiles: React.Dispatch<React.SetStateAction<any[]>>,
    event: React.FormEvent
  ): void;

  deleteFile(): void;

  handleFileInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
    setFileInput: React.Dispatch<React.SetStateAction<string>>
  ): void;

  // return the root node so we can access all children nodes
  // when we implement the front end file selector, we could just display this return result on the FE
  viewAllFiles(): IFileDirNode;
}

export interface IFileBaseNode {
  name: string;
  path: string;
  type: 'dir' | 'file';
}

export interface IFileFileNode extends IFileBaseNode {
  data: string;
  type: 'file';
  parent: IFileDirNode;
}

export interface IFileDirNode extends IFileBaseNode {
  children: (IFileDirNode | IFileFileNode)[];
  type: 'dir';
}
