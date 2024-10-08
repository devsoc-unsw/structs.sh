import { useRef } from 'react';
import useCursor from './useCursor';
import styles from '../../../styles/CustomCaret.module.css';

type CustomCaretProps = {
  input: string;
  handleInput: (currInput: string) => void;
  clearInput: () => void;
  scrollToBottom: () => void;
};

const CustomCaret = ({ input, handleInput, clearInput, scrollToBottom }: CustomCaretProps) => {
  const { handleOnBlur, handleKeyDown, shifts, paused } = useCursor(
    input,
    clearInput,
    scrollToBottom
  );

  const refInput = useRef<HTMLInputElement>();

  function handleFakeInputClick() {
    // Focus the hidden input when clicking on the fake one
    if (refInput.current) {
      refInput.current.focus();
    }
  }

  const cursorPosition = input.length - shifts;

  const [beforeCursor, inCursor, afterCursor] = [
    input.slice(0, cursorPosition),
    input.charAt(cursorPosition),
    input.slice(cursorPosition + 1),
  ];

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className={`${styles.inputMirror} ${paused ? styles.paused : styles.blink}`}
        onClick={handleFakeInputClick}
      >
        {beforeCursor}
        <span data-cursorChar={inCursor}>{inCursor}</span>
        {afterCursor}
      </div>
      <input
        ref={refInput}
        className={styles.inputHidden}
        onKeyDown={handleKeyDown}
        onChange={(e) => handleInput(e.target.value)}
        onBlur={handleOnBlur}
        value={input}
      />
    </div>
  );
};

export default CustomCaret;
