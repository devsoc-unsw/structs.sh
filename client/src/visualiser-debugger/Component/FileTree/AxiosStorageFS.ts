import { assertUnreachable } from '../Visualizer/Util/util';
import { AxiosAgent } from './AxiosClient';
import { IFileDirNode, IFileFileNode, IFileSystem } from './IFileSystem';

export class LocalStorageFS implements IFileSystem {
  root: IFileDirNode;

  axiosAgent: AxiosAgent;

  initialize(): IFileDirNode {
    this.root = {
      name: 'root',
      path: '/',
      type: 'dir',
      parent: undefined,
      children: {},
    };
    this.axiosAgent = new AxiosAgent();
    return this.root;
  }

  createFile(file: IFileFileNode | IFileDirNode): void {
    if (file.parent.children[file.path]) {
      throw new Error('File already exists');
    }
    file.parent.children[file.path] = file;
    file.path = file.parent.path + file.name;
  }

  deleteFile(file: IFileFileNode | IFileDirNode): void {
    file.parent.children[file.path] = undefined;
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
          this.axiosAgent.saveFile(
            node.parent.path,
            node.name,
            node.data,
            (_files) => {
              // Do nothing
            },
            () => {
              console.error('Error while saving file');
            }
          );
          break;
        default:
          assertUnreachable(node);
          break;
      }
    });
  }

  saveChanges(): void {
    this.saveChangesRecursive(this.root);
  }
}
