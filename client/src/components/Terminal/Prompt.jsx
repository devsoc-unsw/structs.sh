import React, { useRef } from 'react';
import styles from './Terminal.module.scss';
import Caret from './Caret';

const Prompt = ({ username, path, processCommand }) => {
    const typeInput = useRef(null);
    const fontSizePX = '8';

    const growInputField = () => {
        typeInput.current.style.width = `${(typeInput.current.value.length + 1) * fontSizePX}px`;
    };

    const handleKeyPress = (event) => {
        const pressedKey = event.charCode;
        const currContent = event.target.value;
        switch (pressedKey) {
            case 13:
                // Processing command on enter press
                processCommand(currContent);
                break;
        }
    };

    return (
        <div className={styles.terminalLine}>
            <span className={styles.username}>{username}@Structs.sh</span>
            <span className={styles.prompty}>:</span>
            <span className={styles.path}>{path}</span>
            <span className={styles.prompt}>$</span>
            <input
                ref={typeInput}
                className={styles.typeInput}
                type="text"
                onKeyPress={handleKeyPress}
            />
            <Caret />
        </div>
    );
};

export default Prompt;
