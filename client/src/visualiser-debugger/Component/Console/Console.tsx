// TODO: Proper rework on this file => we want to re-design this anyway. I can't fix lint now because it will potentially change functioanlity of the file
import React, { useRef, useState } from 'react';
import styles from 'styles/Console.module.css';
import classNames from 'classnames';
import { useGlobalStore } from 'visualiser-debugger/Store/globalStateStore';
import useSocketClientStore from '../../../Services/socketClient';
import CustomCaret from './CustomCaret';

type ConsoleProp = {
  scrollToBottom: () => void;
  isActive: boolean;
};

const Console = ({ scrollToBottom, isActive }: ConsoleProp) => {
  const PREFIX = 'structs.sh % ';
  const [input, setInput] = useState(PREFIX);
  const inputElement = useRef(null);
  const socket = useSocketClientStore((state) => state.socketClient);

  const consoleChunks = useGlobalStore((state) => state.consoleChunks);
  const appendConsoleChunk = useGlobalStore((state) => state.appendConsoleChunks);

  const cursorChar = 'tesrt';
  const cursorPaused = false;

  const handleInput = (currInput: string) => {
    // Ensure structs.sh prefix can't be deleted
    if (currInput.startsWith(PREFIX)) {
      setInput(currInput);
    }
  };

  const clearInput = () => {
    setInput(PREFIX);
    inputElement.current.innerText = '';
  };

  const removeStructsPrefix = (currInput: string) => {
    return currInput.split(' ').slice(2).join(' ');
  };

  const handleKey = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter') {
      const removedPrefixInput = removeStructsPrefix(input);
      if (removedPrefixInput.length > 0) {
        socket.serverAction.sendStdin(removedPrefixInput);
        appendConsoleChunk(`${removedPrefixInput}\n`);
        clearInput();
        scrollToBottom();
      }

      event.preventDefault();
    }
  };

  const focus = () => {
    inputElement.current.focus();
  };

  const splitChunks = (chunk: string[]) => {
    const joinedChunks = chunk.join('');
    return joinedChunks.split('\n');
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
          <div key={index}>{chunk}</div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        {/* <textarea
          className={styles.textArea}
          key="input"
          onChange={(e) => handleInput(e.target.value)}
          value={input}
          onKeyDown={handleKey}
          ref={inputElement}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          style={{ display: 'hidden' }}
        /> */}
        {/* <div className={styles.inputMirror}>
          <div className={styles.inputCursor} />
          <div>Testt</div>
        </div> */}
        <CustomCaret />
        {/* <div className={styles.cursor} /> */}
      </div>
    </div>
  );
};

export default Console;
