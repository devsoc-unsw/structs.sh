import { create } from 'zustand';
import { IFileSystem } from '../Component/FileTree/FS/IFileSystem';
import { LocalStorageFS } from '../Component/FileTree/FS/LocalStorageFS';

type UserFileSystemState = {
  fileSystem: IFileSystem;
  currFocusDirPath: string;
  currFocusFilePath: string;
};

type Action = {
  setFocusDirPath: (path: string) => void;
  setFocusFilePath: (path: string) => void;
  resetRootPaths: () => void;
};

export const useUserFsStateStore = create<UserFileSystemState & Action>((set) => ({
  fileSystem: new LocalStorageFS(),
  currFocusDirPath: '',
  currFocusFilePath: '',
  setFocusDirPath: (path: string) => {
    set({ currFocusDirPath: path });
  },
  setFocusFilePath: (path: string) => {
    set({ currFocusFilePath: path });
  },
  resetRootPaths: () => {
    set({ currFocusFilePath: '' });
    set({ currFocusDirPath: '' });
  },
}));
