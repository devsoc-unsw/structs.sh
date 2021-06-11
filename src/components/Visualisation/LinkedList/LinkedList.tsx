import React from 'react';
import styles from './LinkedList.module.scss';
import Node from './Node';
// import * as d3 from 'd3';

// Convert to a functional component
const LinkedList = () => {
    return (
        <div className={styles.container}>
            LINKED LIST VISUALISER HERE
            <Node />
            <Node />
            <Node />
        </div>
    );
};

export default LinkedList;
