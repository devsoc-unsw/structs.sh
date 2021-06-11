import React from 'react';
import Pane from 'components/Panes/Pane';
import LinkedList from 'components/Visualisation/LinkedList/LinkedList';
import { Lesson } from 'components/Lesson';
import { Terminal } from 'components/Terminal';

import styles from './Dashboard.module.scss';

const Dashboard = ({ match }) => {
    // Extract route parameters
    const { params } = match;
    const topic = params.topic;

    return (
        <div className={styles.container}>
            <Pane orientation="vertical" minSize={'50%'}>
                <Pane orientation="horizontal" minSize={'50%'}>
                    <LinkedList>Visualiser here</LinkedList>
                    <Terminal>Terminal here</Terminal>
                </Pane>
                <Lesson topic={topic}></Lesson>
            </Pane>
        </div>
    );
};

export default Dashboard;
