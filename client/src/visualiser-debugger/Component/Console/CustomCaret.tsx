import useCursor from './useCursor';
import styles from '../../../styles/CustomCaret.module.css';

type CustomCaretProps = {
  input: string;
  handleInput: (currInput: string) => void;
  clearInput: () => void;
  scrollToBottom: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isCompiled: boolean;
};

const CustomCaret = ({
  input,
  handleInput,
  clearInput,
  scrollToBottom,
  inputRef,
  isCompiled,
}: CustomCaretProps) => {
  const { handleOnBlur, handleKeyDown, handleKeyUp, shifts, paused } = useCursor(
    input,
    clearInput,
    scrollToBottom,
    isCompiled
  );

  const cursorPosition = input.length - shifts;

  const [beforeCursor, inCursor, afterCursor] = [
    input.slice(0, cursorPosition),
    input.charAt(cursorPosition),
    input.slice(cursorPosition + 1),
  ];

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={`${styles.inputMirror} ${paused ? styles.paused : styles.blink}`}>
        {beforeCursor}
        <span data-cursorChar={inCursor}>{inCursor}</span>
        {afterCursor}
      </div>
      <input
        ref={inputRef}
        className={styles.inputHidden}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onChange={(e) => handleInput(e.target.value)}
        onBlur={handleOnBlur}
        value={input}
      />
    </div>
  );
};

export default CustomCaret;
