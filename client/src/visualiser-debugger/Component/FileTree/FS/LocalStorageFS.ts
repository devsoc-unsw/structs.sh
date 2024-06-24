import { assertUnreachable } from '../../Visualizer/Util/util';
import { IFileDirNode, IFileFileNode, IFileSystem } from './IFileSystem';

export class LocalStorageFS implements IFileSystem {
  root: IFileDirNode = undefined;

  initialize(): IFileDirNode {
    this.root = {
      name: 'root',
      path: '/',
      type: 'dir',
      parent: undefined,
      children: {},
    };
    this.loadFromLocalStorage();
    return this.root;
  }

  createFile(file: IFileFileNode | IFileDirNode): void {
    if (file.parent.children[file.path]) {
      throw new Error('File already exists');
    }
    file.parent.children[file.path] = file;
    file.path = file.parent.path + file.name;
    this.saveToLocalStorage();
  }

  deleteFile(file: IFileFileNode | IFileDirNode): void {
    delete file.parent.children[file.path];
    this.saveToLocalStorage();
  }

  viewAllFiles(): IFileDirNode {
    return this.root;
  }

  saveChangesRecursive(dir: IFileDirNode): void {
    Object.entries(dir.children).forEach(([_, node]) => {
      switch (node.type) {
        case 'dir':
          this.saveChangesRecursive(node as IFileDirNode);
          break;
        case 'file':
          // No need to save each file separately, save the whole structure to local storage
          break;
        default:
          assertUnreachable(node);
          break;
      }
    });
  }

  saveChanges(): void {
    this.saveChangesRecursive(this.root);
    this.saveToLocalStorage();
  }

  saveToLocalStorage(): void {
    localStorage.setItem('fileSystem', JSON.stringify(this.root));
  }

  loadFromLocalStorage(): void {
    const data = localStorage.getItem('fileSystem');
    if (data) {
      this.root = JSON.parse(data);
    }
  }
}
