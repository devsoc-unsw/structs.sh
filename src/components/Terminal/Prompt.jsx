import React from 'react';
import styles from './Terminal.module.scss';

const Prompt = ({ username }) => {
    return (
        <>
            <span className={styles.username}>{username}@Structs.sh</span>
            <span className={styles.prompt}>:~$ </span>
            <input className={styles.typeInput} type="text" defaultValue="Type here!" />
        </>
    );
};

export default Prompt;
