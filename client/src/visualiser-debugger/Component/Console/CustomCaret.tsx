import { useState, useRef } from 'react';
import useCursor from './useCursor';
import styles from '../../../styles/CustomCaret.module.css';

const CustomCaret = () => {
  const [content, setContent] = useState('');
  const {
    // handleOnFocus: handleOnFocusCursor,
    handleOnBlur,
    handleKeyDown,
    shifts,
    paused,
  } = useCursor(content);

  const refInput = useRef<HTMLInputElement>();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setContent(event.target.value);
  }

  function handleFakeInputClick() {
    if (refInput.current) {
      refInput.current.focus(); // Programmatically focus the hidden input
    }
  }

  function handleKeyDownForFakeInput(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent scrolling if Space key is pressed
      handleFakeInputClick(); // Focus the hidden input
    }
  }

  // function handleOnFocusLabel(event) {
  //   refInput.current.focus();
  //   handleOnFocusCursor(event);
  // }

  const cursorPosition = content.length - shifts;

  const [beforeCursor, inCursor, afterCursor] = [
    content.slice(0, cursorPosition),
    content.charAt(cursorPosition),
    content.slice(cursorPosition + 1),
  ];

  return (
    <div>
      <div
        className={`${styles.inputMirror} ${paused ? styles.paused : styles.blink}`}
        onClick={handleFakeInputClick}
        onKeyDown={handleKeyDownForFakeInput}
        tabIndex={0}
        role="textbox"
        aria-label="Custom text input"
      >
        {beforeCursor}
        <span>{inCursor}</span>
        {afterCursor}
      </div>
      <input
        ref={refInput}
        className={styles.inputHidden}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onBlur={handleOnBlur}
        value={content}
      />
    </div>
  );
};

export default CustomCaret;
