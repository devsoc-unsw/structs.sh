import React from 'react';
import Pane from 'components/Panes/Pane';
import Tabs from 'components/Panes/Tabs';

const Dashboard = ({ match }) => {
    // Extract route parameters
    const { params } = match;
    const topic = params.topic;

    return (
        <div>
            <Pane orientation="vertical" minSize={'50%'}>
                <Pane orientation="horizontal" minSize={'50%'}>
                    <div>Visualiser here</div>
                    <div>Terminal here</div>
                </Pane>
                <div>
                    {topic}
                    <Tabs topic={topic}/>
                </div>
            </Pane>
        </div>
    );
};

export default Dashboard;
