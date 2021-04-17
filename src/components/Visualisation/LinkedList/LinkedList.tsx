import React from 'react';
import styles from './LinkedList.module.scss';
import Node from './Node';
// import * as d3 from 'd3';

class LinkedList extends React.Component {
    private myRef: React.RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {

    }    

    render() {
        return (
            <div className={styles.container} ref={this.myRef}>
                <h1>Linked List</h1>
                <Node />
                <Node />
                <Node />
            </div>
        );
    }
};

export default LinkedList;
