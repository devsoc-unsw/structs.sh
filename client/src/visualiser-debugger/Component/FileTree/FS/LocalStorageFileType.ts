export interface ILocalStorageFileFormat {
  name: string;
  fullPath: string;
  data: string;
  type: 'file';
  parent: string;
}

export interface ILocalStorageFolderFormat {
  name: string;
  fullPath: string;
  type: 'folder';
  children: (ILocalStorageFileFormat | ILocalStorageFolderFormat)[];
}

export const INITIAL_LOCAL_STORAGE_FS: ILocalStorageFolderFormat = {
  name: 'root',
  fullPath: 'root',
  type: 'folder',
  children: [
    {
      name: 'file1.c',
      fullPath: 'root/file1.c',
      data: '// A empty file 1',
      type: 'file',
      parent: 'root',
    },
    {
      name: 'file2.c',
      fullPath: 'root/file2.c',
      data: '// A empty file 3',
      type: 'file',
      parent: 'root',
    },
    {
      name: 'file3.c',
      fullPath: 'root/file3.c',
      data: '// A empty file 3',
      type: 'file',
      parent: 'root',
    },
  ],
};
