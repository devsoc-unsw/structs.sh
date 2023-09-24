import React, { Fragment, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { socket } from 'utils/socket';

import styles from 'styles/Console.module.css';

const Console = () => {
  const [chunks, setChunks] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const inputElement = useRef(null);

  const scrollToBottom = () => {
    if (inputElement.current) {
      const container = inputElement.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    const onStdout = (data: string) => {
      setChunks((oldChunks) => [...oldChunks, data]);
      scrollToBottom();
    };

    socket.on('sendStdoutToUser', onStdout);

    return () => {
      socket.off('sendStdoutToUser', onStdout);
    };
  }, []);

  const handleInput = () => {
    setInput(inputElement.current.innerText);
  };

  const clearInput = () => {
    setInput('');
    inputElement.current.innerText = '';
  };

  const handleKey = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter') {
      if (input.length > 0) {
        socket.emit('send_stdin', input);
        setChunks([...chunks, `${input}\n`]);
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
      className={styles.console}
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
      {chunks.map((chunk, index) => (
        <Fragment key={index}>
          <span>{chunk.replace(/\n$/, '')}</span>
          {chunk.endsWith('\n') && <br />}
        </Fragment>
      ))}
      <span
        className={styles.input}
        key="input"
        onInput={handleInput}
        onKeyDown={handleKey}
        ref={inputElement}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
      ></span>
    </div>
  );
};

export default Console;
