import React from 'react';
import SplitPane from 'react-split-pane';
import './Pane.scss';

interface Props {
    children: any;
    orientation: 'vertical' | 'horizontal';
    minSize: number | string;
    topGutterSize: number;
}

const Pane: React.FC<Props> = ({ children, orientation, minSize, topGutterSize = 0 }) => {
    const heightAdjustment = {
        height: `calc(100% - ${topGutterSize}px)`,
        bottom: '0',
    };
    return (
        <SplitPane split={orientation} minSize={minSize} style={heightAdjustment}>
            {children}
        </SplitPane>
    );
};

export default Pane;
