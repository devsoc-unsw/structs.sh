import React from 'react';
import styles from './Terminal.module.scss';
import Prompt from './Prompt';

const Terminal = (props) => {
    return (
        <div className={styles.terminalContainer}>
            <Prompt username={'username'}></Prompt>
        </div>
    );
};

export default Terminal;
