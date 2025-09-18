// TODO: Proper rework on this file => we want to re-design this anyway. I can't fix lint now because it will potentially change functioanlity of the file
import { useEffect, useRef, useState } from 'react';
import styles from 'styles/Console.module.css';
import classNames from 'classnames';
import { useGlobalStore } from 'visualiser-debugger/Store/globalStateStore';
import { useFrontendStateStore } from 'visualiser-debugger/Store/frontendStateStore';
import { useUserFsStateStore } from 'visualiser-debugger/Store/userFsStateStore';
import CustomCaret from './CustomCaret';
import { IFileFileNode, IFileDirNode } from '../FileTree/FS/IFileSystem';
import useConsolePathStore from 'visualiser-debugger/Store/consolePathStore';

type ConsoleProp = {
  scrollToBottom: () => void;
};

const Console = ({ scrollToBottom }: ConsoleProp) => {
  const { currWorkingDir, setCurrWorkingDir } = useConsolePathStore();
  const [PREFIX, setPrefix] = useState(`structs.sh/${currWorkingDir} % `);
  const [input, setInput] = useState(PREFIX);
  const inputElement = useRef<HTMLInputElement>(null);

  const consoleChunks = useGlobalStore((state) => state.consoleChunks);
  const isCompiled = useFrontendStateStore((state) => state.isActive);
  const appendConsoleChunks = useGlobalStore((state) => state.appendConsoleChunks);
  const { resetConsoleChunks } = useGlobalStore();
  const { fileSystem, currFocusFilePath } = useUserFsStateStore();

  const updatePrefixPath = (newPath : string) => {
    setCurrWorkingDir(newPath);
    setPrefix(`structs.sh/${newPath} % `);
  }

  useEffect(() => {
    if (isCompiled) {
      const file = fileSystem.getFileFromPath(currFocusFilePath) as IFileFileNode;
      appendConsoleChunks(`${PREFIX}gcc -g ${file.name} -o a\n`);
      setInput('');
    } else {
      setInput(PREFIX);
    }
  }, [isCompiled, PREFIX]);

  // Every time when user add input to console, check the corresponding command
  useEffect(() => {
    const lastElem = consoleChunks.length - 1;
    if (consoleChunks[lastElem] === `${PREFIX}clear\n`) {
      resetConsoleChunks();
    } else if (consoleChunks[lastElem] === `${PREFIX}pwd\n`) {
      const newChunks = currWorkingDir + '\n';
      appendConsoleChunks('/' + newChunks);
    } else if (consoleChunks.length > 0 && consoleChunks[lastElem].startsWith(`${PREFIX}mkdir`)) {
      const str = consoleChunks[lastElem].trim();
      const newDirName = str.replace(`${PREFIX}mkdir `, '');

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
    } else if (consoleChunks.length > 0 && consoleChunks[lastElem].startsWith(`${PREFIX}cd`)) {
      // dirPath is the directory name
      const dirPath = consoleChunks[lastElem].trim().replace(`${PREFIX}cd `, '');

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
        setCurrWorkingDir('root');
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
    } else if (consoleChunks.length > 0 && consoleChunks[lastElem].startsWith(`${PREFIX}ls`)) {
      const files = fileSystem.getDirFromPath(currWorkingDir)?.children;
      let list = '';
      for (const index in files) {
        const nodeName = files[index].name;
        if (nodeName.trim().length === 0) continue;
        list = `${list} ${nodeName.trim()}`
      }
      list = list.trim();
      appendConsoleChunks(`${list}\n`);
    } else if (consoleChunks.length > 0 && consoleChunks[lastElem].startsWith(`${PREFIX}touch`)) {
      const fileName = consoleChunks[lastElem].trim().replace(`${PREFIX}touch `, '');
      if (fileName.includes('/')) {
        appendConsoleChunks(`Unable to create file: '\' cannot exists in a file name.\n`);
        return ;
      }

      // Handle creating multiple files at the same time
      const files = fileName.split(/\s+/);
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
    } else if (consoleChunks.length > 0 && consoleChunks[lastElem].startsWith(`${PREFIX}rm`)) {
      const fileName = consoleChunks[lastElem].trim().replace(`${PREFIX}rm `, '');
      const filePath = `${currWorkingDir}/${fileName}`;
      // Check if file exists
      const fileToBeDeleted = fileSystem.getFileFromPath(filePath);
      if (!fileToBeDeleted) {
        appendConsoleChunks(`rm: ${fileToBeDeleted}: No such file exists`);
        return;
      }
      fileSystem.deleteFile(fileToBeDeleted);
    }
  }, [consoleChunks])

  const handleInput = async (currInput: string) => {
    if (isCompiled) {
      setInput(currInput);
      return;
    }

    // Ensure structs.sh prefix can't be deleted
    if (currInput.startsWith(PREFIX)) {
      setInput(currInput)
    }
  };

  const clearInput = () => {
    if (isCompiled) {
      setInput('');
      return;
    }

    setInput(PREFIX);
  };

  const focus = () => {
    inputElement.current?.focus();
  };

  const splitChunks = (chunk: string[]) => {
    const joinedChunks = chunk.join('');
    return joinedChunks.split('\n').filter((c) => c !== '');
  };

  return (
    <div
      className={classNames(styles.console)}
      onClick={focus}
      onKeyUp={(e) => {
        if (e.key === 'Space') {
          e.preventDefault();
          focus();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {splitChunks(consoleChunks).map((chunk: string, index: number) => (
          <div key={`${chunk}-${index}`}>{chunk}</div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <CustomCaret
          input={input}
          handleInput={handleInput}
          clearInput={clearInput}
          scrollToBottom={scrollToBottom}
          inputRef={inputElement}
          isCompiled={isCompiled}
        />
      </div>
    </div>
  );
};

export default Console;
