import { create } from 'zustand';
import { IFileSystem } from '../Component/FileTree/FS/IFileSystem';
import { LocalStorageFS } from '../Component/FileTree/FS/LocalStorageFS';

type UserFileSystemState = {
  fileSystem: IFileSystem;
  currFocusDirPath: string | null;
  currFocusFilePath: string | null;
};

type Action = {
  setFocusDirPath: (path: string) => void;
  setFocusFilePath: (path: string) => void;
};

export const useUserFsStateStore = create<UserFileSystemState & Action>((set) => ({
  fileSystem: new LocalStorageFS(),
  currFocusDirPath: null,
  currFocusFilePath: null,
  setFocusDirPath: (path: string) => {
    set({ currFocusDirPath: path });
  },
  setFocusFilePath: (path: string) => {
    set({ currFocusFilePath: path });
  },
}));
