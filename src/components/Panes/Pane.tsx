import React from 'react';
import SplitPane from 'react-split-pane';
import './Pane.scss';

interface Props {
    children: any;
    orientation: 'vertical' | 'horizontal';
    minSize: number | string;
}

const Pane: React.FC<Props> = ({ children, orientation, minSize }) => {
    return (
        <SplitPane split={orientation} minSize={minSize}>
            {children}
        </SplitPane>
    );
};

export default Pane;
