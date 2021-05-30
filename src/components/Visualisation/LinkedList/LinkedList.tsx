import React from 'react';
import Experiment from './Experiment';
import FunctionsMenu from './FunctionMenu';
import styles from './LinkedList.module.scss';
import Node from './Node';
// import * as d3 from 'd3';

// Convert to a functional component
const LinkedList = () => {
    return (
        <div className={styles.container}>
            <h1>Linked List</h1>
            <Node />
            <Node />
            <Node />
            <FunctionsMenu />
            <Experiment />
        </div>
    );
};

export default LinkedList;
