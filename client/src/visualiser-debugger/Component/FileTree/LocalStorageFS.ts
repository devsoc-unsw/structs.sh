import axios from 'axios';
import { SERVER_URL } from 'utils/constants';
import React from 'react';
import { IFileDirNode, IFileFileNode, IFileSystem } from './IFileSystem';
import { PLACEHOLDER_USERNAME } from './Util/util';

export class LocalStorageFS implements IFileSystem {
  createFile(
    file: IFileFileNode | IFileDirNode,
    files: Array<any>,
    setDropdownOpen: React.Dispatch<React.SetStateAction<Boolean>>,
    setFiles: React.Dispatch<React.SetStateAction<any[]>>,
    event: React.FormEvent
  ): void {
    event.preventDefault();

    switch (file.type) {
      // if it is a leaf file
      case 'file':
        {
          if (file.name === '') {
            return;
          }
          const currentDir = file.parent.name;
          const data = {
            username: PLACEHOLDER_USERNAME,
            workspace: currentDir,
            filename: file.name,
            fileData: '',
          };
          axios.post(`${SERVER_URL}/api/saveFile`, data).then((response) => {
            console.log(response.data);
            if (!Object.prototype.hasOwnProperty.call(response.data, 'error')) {
              // are the files here supposed to be IFileNode and such???
              files.push({ name: file.name, text: '' });
            }
          });

          setDropdownOpen(false);

          axios
            .get(`${SERVER_URL}/api/retrieveFilesInWorkspace`, {
              params: {
                username: PLACEHOLDER_USERNAME,
                workspaceName: currentDir,
              },
            })
            .then((response) => {
              const newFiles = response.data.files;
              setFiles(newFiles);
            });
        }
        break;
      default:
        break;
    }
  }

  deleteFile(): void {
    throw new Error('Method not implemented.');
  }

  handleFileInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
    setFileInput: React.Dispatch<React.SetStateAction<string>>
  ): void {
    const fileInput = event.target.value;
    setFileInput(fileInput);
  }

  viewAllFiles(): IFileDirNode {
    throw new Error('Method not implemented.');
  }
}
