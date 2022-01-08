import { Divider, Typography } from '@mui/material';
import React from 'react';
import curr from 'visualiser-src/linked-list-visualiser/assets/curr.svg';
import prev from 'visualiser-src/linked-list-visualiser/assets/prev.svg';
import { topOffset } from 'visualiser-src/linked-list-visualiser/util/constants';

interface Props {
    topicTitle: string;
}

const VisualiserCanvas: React.FC<Props> = ({ topicTitle }) => {
    switch (topicTitle) {
        case 'Linked Lists':
            return <LinkedListCanvas />;
        case 'Binary Search Trees':
            return null;
        default:
            return null;
    }
};

const LinkedListCanvas: React.FC = () => (
    <header
        style={{
            height: '100%',
            padding: '10px',
            background: 'rgba(235, 235, 235)',
        }}
    >
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
            Linked List Visualiser
        </Typography>
        <Divider />
        <div className="container">
            <div className="container" id="canvas">
                <div id="current" style={{ top: `${topOffset}px` }}>
                    <img src={curr} alt="curr arrow" />
                </div>
                <div id="prev" style={{ top: `${topOffset}px` }}>
                    <img src={prev} alt="prev arrow" />
                </div>
            </div>
        </div>
    </header>
);

export default VisualiserCanvas;
