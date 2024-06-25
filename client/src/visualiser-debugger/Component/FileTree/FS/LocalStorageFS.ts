import { IFileDirNode, IFileFileNode, IFileSystem, INITIAL_LOCAL_STORAGE_FS } from './IFileSystem';

export class LocalStorageFS implements IFileSystem {
  root: IFileDirNode;

  initialize(): IFileDirNode {
    localStorage.clear();
    const data = localStorage.getItem('fileSystem');
    if (data) {
      this.root = JSON.parse(data);
    } else {
      this.root = INITIAL_LOCAL_STORAGE_FS;
      this.saveChanges(); // Save the initial structure to localStorage
    }

    return this.root;
  }

  constructor() {
    this.root = this.initialize();
  }

  addFile(file: IFileFileNode): void {
    const dir = this.getDirFromPath(file.parentPath);
    if (dir) {
      dir.children[file.name] = file;
      this.saveChanges();
    }
  }

  addDir(dir: IFileDirNode): void {
    const parentDir = this.getDirFromPath(dir.parentPath);
    if (parentDir) {
      parentDir.children[dir.name] = dir;
      this.saveChanges();
    }
  }

  deleteFile(file: IFileFileNode | IFileDirNode): void {
    const parent = this.getDirFromPath(file.parentPath);
    if (parent && parent.children[file.name]) {
      delete parent.children[file.name];
      this.saveChanges();
    }
  }

  getFileFromPath(path: string): IFileFileNode | undefined {
    return this.findNodeByPath(path) as IFileFileNode | undefined;
  }

  getDirFromPath(path: string): IFileDirNode | undefined {
    return this.findNodeByPath(path) as IFileDirNode | undefined;
  }

  getRootDirectory(): IFileDirNode {
    return this.root;
  }

  saveChanges(): void {
    localStorage.setItem('fileSystem', JSON.stringify(this.root));
  }

  // TODO: Not cached, refactor later to increase performance
  private findNodeByPath(path: string): IFileDirNode | IFileFileNode | undefined {
    const segments = path.split('/').filter(Boolean);
    let current: IFileDirNode | IFileFileNode | undefined = this.root;

    segments.forEach((segment: string) => {
      if (current.type === 'dir' && current.children[segment]) {
        current = current.children[segment];
      }
    });

    return current;
  }
}
