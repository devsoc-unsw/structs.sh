import React, { Fragment, useEffect, useRef, useState } from "react";
import { socket } from "utils/socket";

import styles from "styles/Console.module.css";

const Console = () => {
  let [chunks, setChunks] = useState<string[]>([]);
  let [input, setInput] = useState("");
  let inputElement = useRef(null);

  useEffect(() => {
    const onStdout = (data: string) => {
      setChunks((chunks) => [...chunks, data]);
      scrollToBottom();
    };

    socket.on("sendStdoutToUser", onStdout);

    return () => {
      socket.off("sendStdoutToUser", onStdout);
    };
  }, []);

  let handleInput = () => {
    setInput(inputElement.current.innerText);
  }

  let clearInput = () => {
    setInput("");
    inputElement.current.innerText = "";
  }

  let handleKey = (event) => {
    if (event.key === "Enter") {
      if (input.length > 0) {
        socket.emit("send_stdin", input);
        setChunks([...chunks, input + "\n"]);
        clearInput();
        scrollToBottom();
      }

      event.preventDefault();
    }
  }

  let focus = () => {
    inputElement.current.focus();
  }

  let scrollToBottom = () => {
    if (inputElement.current) {
      const container = inputElement.current.parentElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  return (
    <div className={styles.console} onClick={focus}>
      {chunks.map((chunk, index) => (
        <Fragment key={index}>
          <span>{chunk.replace(/\n$/, "")}</span>
          {chunk.endsWith("\n") && <br />}
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
