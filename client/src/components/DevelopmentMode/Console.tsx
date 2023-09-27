import React, { Fragment, useRef, useState } from 'react';
import { socket } from 'utils/socket';

import styles from 'styles/Console.module.css';
import classNames from 'classnames';

const Console = ({ chunks, handleAddChunk, scrollToBottom, isActive }) => {
  const [input, setInput] = useState('');
  const inputElement = useRef(null);

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
        handleAddChunk(`${input}\n`);
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
      {chunks.map((chunk: string, index: number) => (
        <Fragment key={index}>
          <code>{chunk.replace(/\n$/, '')}</code>
          {chunk.endsWith('\n') && <br />}
        </Fragment>
      ))}
      <code
        className={styles.input}
        key="input"
        onInput={handleInput}
        onKeyDown={handleKey}
        ref={inputElement}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
      />
    </div>
  );
};

export default Console;
