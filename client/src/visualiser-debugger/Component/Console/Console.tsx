// TODO: Proper rework on this file => we want to re-design this anyway. I can't fix lint now because it will potentially change functioanlity of the file
import React, { useEffect, useRef, useState } from 'react';
import styles from 'styles/Console.module.css';
import classNames from 'classnames';
import { useGlobalStore } from 'visualiser-debugger/Store/globalStateStore';
import { useFrontendStateStore } from 'visualiser-debugger/Store/frontendStateStore';
import { useUserFsStateStore } from 'visualiser-debugger/Store/userFsStateStore';
import CustomCaret from './CustomCaret';
import { IFileFileNode } from '../FileTree/FS/IFileSystem';

type ConsoleProp = {
  scrollToBottom: () => void;
  isActive: boolean;
};

const Console = ({ scrollToBottom, isActive }: ConsoleProp) => {
  const PREFIX = 'structs.sh % ';
  const [input, setInput] = useState(PREFIX);
  const inputElement = useRef<HTMLInputElement>(null);

  const consoleChunks = useGlobalStore((state) => state.consoleChunks);
  const isCompiled = useFrontendStateStore((state) => state.isActive);
  const appendConsoleChunks = useGlobalStore((state) => state.appendConsoleChunks);
  const { fileSystem, currFocusFilePath } = useUserFsStateStore();

  useEffect(() => {
    if (isCompiled) {
      const file = fileSystem.getFileFromPath(currFocusFilePath) as IFileFileNode;
      appendConsoleChunks(`${PREFIX}gcc -g ${file.name} -o a\n`);
      setInput('');
    } else {
      setInput(PREFIX);
    }
  }, [isCompiled]);

  const handleInput = (currInput: string) => {
    if (isCompiled) {
      setInput(currInput);
      return;
    }

    // Ensure structs.sh prefix can't be deleted
    if (currInput.startsWith(PREFIX)) {
      setInput(currInput);
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
      className={classNames(styles.console, { [styles.errorText]: !isActive })}
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
