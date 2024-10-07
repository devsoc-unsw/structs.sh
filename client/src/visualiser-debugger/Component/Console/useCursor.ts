import { useState } from 'react';

function useCursor(content: string) {
  const [shifts, setShifts] = useState(0);
  const [paused, setPaused] = useState(true);

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
