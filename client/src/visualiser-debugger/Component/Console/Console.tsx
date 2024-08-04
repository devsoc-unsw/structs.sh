// TODO: Proper rework on this file => we want to re-design this anyway. I can't fix lint now because it will potentially change functioanlity of the file
import React, { Fragment, useRef, useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import styles from 'styles/Console.module.css';
import classNames from 'classnames';
import { useGlobalStore } from 'visualiser-debugger/Store/globalStateStore';
import useSocketClientStore from '../../../Services/socketClient';

type ConsoleProp = {
  scrollToBottom: () => void;
  isActive: boolean;
};

const Console = ({ scrollToBottom, isActive }: ConsoleProp) => {
  const [input, setInput] = useState('');
  const inputElement = useRef(null);
  const socket = useSocketClientStore((state) => state.socketClient);

  const consoleChunks = useGlobalStore((state) => state.consoleChunks);
  const appendConsoleChunk = useGlobalStore((state) => state.appendConsoleChunks);

  const handleInput = (currInput: string) => {
    setInput(currInput);
  };

  const clearInput = () => {
    setInput('');
    inputElement.current.innerText = '';
  };

  const handleKey = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter') {
      if (input.length > 0) {
        socket.serverAction.sendStdin(input);
        appendConsoleChunk(`${input}\n`);
        clearInput();
        scrollToBottom();
      }

      event.preventDefault();
    }
  };

  const focus = () => {
    inputElement.current.focus();
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
      {consoleChunks.map((chunk: string, index: number) => (
        <Fragment key={index}>
          <code>{chunk.replace(/\n$/, '')}</code>
        </Fragment>
      ))}
      <div className={styles.consoleInput}>
        <ChevronRightIcon />
        <input
          className={styles.input}
          key="input"
          onChange={(e) => handleInput(e.target.value)}
          value={input}
          onKeyDown={handleKey}
          ref={inputElement}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default Console;
