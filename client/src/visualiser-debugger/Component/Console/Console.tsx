// TODO: Proper rework on this file => we want to re-design this anyway. I can't fix lint now because it will potentially change functioanlity of the file
import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/Console.module.css';
import classNames from 'classnames';
import { useGlobalStore } from '@/visualiser-debugger/Store/globalStateStore';
import { useFrontendStateStore } from '@/visualiser-debugger/Store/frontendStateStore';
import { useUserFsStateStore } from '@/visualiser-debugger/Store/userFsStateStore';
import useConsolePathStore from '@/visualiser-debugger/Store/consolePathStore';
import { IFileFileNode } from '@/visualiser-debugger/Component/FileTree/FS/IFileSystem';
import CustomCaret from './CustomCaret';

type ConsoleProp = {
  scrollToBottom: () => void;
};

const Console = ({ scrollToBottom }: ConsoleProp) => {
  const {
    prefix,
    clearConsole,
    printWorkingDir,
    createNewDir,
    changeDir,
    listFiles,
    createNewFile,
    removeFile,
  } = useConsolePathStore();
  const [input, setInput] = useState(prefix);
  const inputElement = useRef<HTMLInputElement>(null);

  const consoleChunks = useGlobalStore((state) => state.consoleChunks);
  const isCompiled = useFrontendStateStore((state) => state.isActive);
  const appendConsoleChunks = useGlobalStore((state) => state.appendConsoleChunks);
  const { fileSystem, currFocusFilePath } = useUserFsStateStore();

  useEffect(() => {
    if (isCompiled) {
      const file = fileSystem.getFileFromPath(currFocusFilePath) as IFileFileNode;
      appendConsoleChunks(`${prefix}gcc -g ${file.name} -o a\n`);
      setInput('');
    } else {
      setInput(prefix);
    }
  }, [isCompiled, prefix, appendConsoleChunks, currFocusFilePath, fileSystem]);

  // Every time when user add input to console, check the corresponding command
  useEffect(() => {
    if (consoleChunks.length <= 0) return;
    const consoleIndex = consoleChunks.length - 1;
    if (!consoleChunks[consoleIndex].startsWith(prefix)) return;

    // Running user command
    const command = consoleChunks[consoleIndex].trim().replace(`${prefix}`, '');
    if (command === 'clear') clearConsole();
    else if (command === 'pwd') printWorkingDir();
    else if (command.startsWith('ls')) listFiles();
    else if (command.startsWith('mkdir')) {
      const dirName = command.replace('mkdir ', '');
      createNewDir(dirName);
    } else if (command.startsWith('cd')) {
      const dirPath = command.replace('cd ', '');
      changeDir(dirPath);
    } else if (command.startsWith('touch')) {
      const fileName = command.replace('touch ', '');
      createNewFile(fileName);
    } else if (command.startsWith('rm')) {
      const fileName = command.replace('rm ', '');
      removeFile(fileName);
    }
  }, [
    consoleChunks,
    changeDir,
    clearConsole,
    createNewDir,
    createNewFile,
    listFiles,
    prefix,
    printWorkingDir,
    removeFile,
  ]);

  const handleInput = async (currInput: string) => {
    if (isCompiled) {
      setInput(currInput);
      return;
    }

    // Ensure structs.sh prefix can't be deleted
    if (currInput.startsWith(prefix)) {
      setInput(currInput);
    }
  };

  const clearInput = () => {
    if (isCompiled) {
      setInput('');
      return;
    }

    setInput(prefix);
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
