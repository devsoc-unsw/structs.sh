import { useState } from 'react';
import useSocketClientStore from 'Services/socketClient';
import { useGlobalStore } from 'visualiser-debugger/Store/globalStateStore';

function useCursor(content: string, clearInput: () => void, scrollToBottom: () => void) {
  const socket = useSocketClientStore((state) => state.socketClient);
  const appendConsoleChunk = useGlobalStore((state) => state.appendConsoleChunks);

  const [shifts, setShifts] = useState(0);
  const [paused, setPaused] = useState(true);

  const removeStructsPrefix = (currInput: string) => {
    return currInput.split(' ').slice(2).join(' ');
  };

  let timeoutRef = null;

  function pauseWithTimeout() {
    setPaused(true);

    clearTimeout(timeoutRef);

    timeoutRef = setTimeout(() => {
      setPaused(false);
    }, 500);
  }

  function updateShifts(key) {
    switch (key) {
      case 'ArrowLeft':
        if (content.length > shifts) {
          setShifts(shifts + 1);
        }
        break;
      case 'ArrowRight':
        if (shifts > 0) {
          setShifts(shifts - 1);
        }
        break;
      case 'Delete':
        if (content.length >= shifts) {
          setShifts(shifts - 1);
        }
        break;
      case 'Home':
      case 'ArrowUp':
        setShifts(content.length);
        break;
      case 'End':
      case 'ArrowDown':
        setShifts(0);
        break;
      case 'Enter':
        {
          const removedPrefixInput = removeStructsPrefix(content);
          if (removedPrefixInput.length > 0) {
            socket.serverAction.sendStdin(removedPrefixInput);
            appendConsoleChunk(`${removedPrefixInput}\n`);
            clearInput();
            scrollToBottom();
          }
        }
        break;
      default:
        break;
    }
  }

  function handleOnFocus() {
    setPaused(false);
  }

  function handleOnBlur() {
    setPaused(true);
  }

  function handleKeyDown({ key }) {
    pauseWithTimeout();

    updateShifts(key);
  }

  return {
    handleOnFocus,
    handleOnBlur,
    handleKeyDown,
    shifts,
    paused,
  };
}

export default useCursor;
