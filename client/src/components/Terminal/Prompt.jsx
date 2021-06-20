import React from 'react';
import styles from './Terminal.module.scss';
import Caret from './Caret';

const Prompt = ({ username }) => {
    return (
        <>
            <span className={styles.username}>{username}@Structs.sh</span>
            <span className={styles.prompt}>:~$ </span>
            <Caret />
            <input className={styles.typeInput} type="text" defaultValue="Type here!" />
        </>
    );
};

export default Prompt;
