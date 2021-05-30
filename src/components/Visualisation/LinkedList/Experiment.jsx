import React from 'react';

export default class Experiment extends React.Component {

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        console.log("Done rendering");


    }

    render() {
        return (
            <div>
                This is a component for D3 experiments
            </div>
        )
    }
}
