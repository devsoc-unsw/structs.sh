// Store console curr working directory
import { create } from 'zustand';
import { useUserFsStateStore } from './userFsStateStore';
import { useGlobalStore } from './globalStateStore';
import { IFileFileNode, IFileDirNode } from '../Component/FileTree/FS/IFileSystem';

interface ConsolePathState {
  prefix: string,
  currWorkingDir: string,
  setPrefix: (updatedPrefix: string) => void;
  setCurrWorkingDir: (newWorkingDir: string) => void;
  updatePrefixPath: (newPath: string) => void;
  clearConsole: () => void;
  printWorkingDir: () => void;
  createNewDir : (newDirName: string) => void;
  changeDir: (dirPath: string) => void;
  listFiles: () => void;
  createNewFile: (newFileName: string) => void;
  removeFile: (fileName: string) => void;
}

const useConsolePathStore = create<ConsolePathState>((set, get) => ({
  prefix: `structs.sh/root % `, // prefix path is set to root
  currWorkingDir: 'root',
  setPrefix: (updatedPrefix: string) => set({ prefix: updatedPrefix }),
  setCurrWorkingDir: (newWorkingDir) => set({ currWorkingDir: newWorkingDir }),
  updatePrefixPath: (newPath) => {
    const { setCurrWorkingDir, setPrefix } = get();
    setCurrWorkingDir(newPath);
    setPrefix(`structs.sh/${newPath} % `);
  },
  clearConsole: () => {
    const { resetConsoleChunks } = useGlobalStore.getState();
    resetConsoleChunks();
  },
  printWorkingDir: () => {
    const { currWorkingDir } = get();
    const { appendConsoleChunks } = useGlobalStore.getState();
    appendConsoleChunks(`/${currWorkingDir}\n`);
  },
  createNewDir: (newDirName: string) => {
    const { currWorkingDir } = get();
    const { fileSystem } = useUserFsStateStore.getState();
    const { appendConsoleChunks } = useGlobalStore.getState();

    // Error checking
    if (newDirName.length === 0) {
      appendConsoleChunks('mkdir: missing operand\n');
      return;
    } else if (newDirName.includes('/')) {
      appendConsoleChunks(`mkdir: cannot create directory ${newDirName}`)
    }

    // First thing -> findNodeByPath
    const newFolder: IFileDirNode = {
      name: newDirName,
      path: `${currWorkingDir}/${newDirName}`,
      type: 'dir',
      children: {},
      parentPath: currWorkingDir
    }

    if (!fileSystem.addDir(newFolder)) {
      alert('failed to create a new directory'); // This can be changed to a modal later on instead of alert
      return;
    }

    fileSystem.saveChanges();
  },
  changeDir: (dirPath) => {
    const { currWorkingDir, updatePrefixPath } = get();
    const { fileSystem } = useUserFsStateStore.getState();
    const { appendConsoleChunks } = useGlobalStore.getState();

    // Cannot go further than the root directory
    if (dirPath === '..') {
      if (currWorkingDir === 'root') return;
      
      // Destructure the current working directory
      const dirPathArray = currWorkingDir.split('/');
      dirPathArray.pop();
      const newPath = dirPathArray.join('/');
      updatePrefixPath(newPath);
      return;
    }

    // Update directory path to the root right away
    if (dirPath === 'root') {
      updatePrefixPath('root');
      return;
    }

    const newPath = `${currWorkingDir}/${dirPath}`;
    const getDir = fileSystem.getDirFromPath(newPath);
    if (getDir && (getDir.type != 'dir' || getDir.name == '/root')) {
      appendConsoleChunks(`cd: ${dirPath}: Not a directory\n`);
      return;
    }

    const doesDirExists = fileSystem.doesDirExists(newPath);
    if (!doesDirExists) {
      appendConsoleChunks(`cd: ${dirPath}: No such file or directory\n`);
      return;
    }

    updatePrefixPath(newPath);
  },
  listFiles: () => {
    const { currWorkingDir } = get();
    const { fileSystem } = useUserFsStateStore.getState();
    const { appendConsoleChunks } = useGlobalStore.getState();

    const filesInCurrDir = fileSystem.getDirFromPath(currWorkingDir)?.children;
    let filelist = '';
    for (const index in filesInCurrDir) {
      const nodeName = filesInCurrDir[index].name.trim();
      if (nodeName.length === 0) continue;
      filelist = `${filelist} ${nodeName.trim()}`
    }
    filelist = filelist.trim();
    appendConsoleChunks(`${filelist}\n`);
  },
  createNewFile: (newFileName: string) => {
    const { currWorkingDir } = get();
    const { fileSystem } = useUserFsStateStore.getState();
    const { appendConsoleChunks } = useGlobalStore.getState();

    // Error handling
    if (newFileName.includes('/')) {
      appendConsoleChunks(`Unable to create file: '\' cannot exists in a file name.\n`);
      return ;
    }
    // Handle creating multiple files at the same time
    const files = newFileName.split(/\s+/);
    for (const file of files) {
      const newFile: IFileFileNode = {
        name: file,
        path: `${currWorkingDir}/${file}`,
        type: 'file',
        data: '',
        parentPath: currWorkingDir,
      }
      fileSystem.addFile(newFile);
    }
  },
  removeFile: (fileName: string) => {
    const { currWorkingDir } = get();
    const { fileSystem } = useUserFsStateStore.getState();
    const { appendConsoleChunks } = useGlobalStore.getState();

    const filePath = `${currWorkingDir}/${fileName}`;
    // Check if file exists
    const fileToBeDeleted = fileSystem.getFileFromPath(filePath);
    if (!fileToBeDeleted) {
      appendConsoleChunks(`rm: ${fileToBeDeleted}: No such file exists\n`);
      return;
    }

    if (fileToBeDeleted && fileToBeDeleted.type != 'file') {
      appendConsoleChunks(`rm: ${fileName}: is not a file\n`);
      return;
    }
  
    fileSystem.deleteFile(fileToBeDeleted);
  }
}));

export default useConsolePathStore;