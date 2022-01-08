import React from 'react';
import curr from 'visualiser/linked-list-visualiser/assets/curr.svg';
import prev from 'visualiser/linked-list-visualiser/assets/prev.svg';
import { topOffset } from 'visualiser/linked-list-visualiser/util/constants';
import 'visualiser/linked-list-visualiser/styles/visualiser.css';

interface Props {}

const VisualiserCanvas: React.FC<Props> = () => {
    return (
        <header
            style={{
                height: '100%',
                padding: '10px',
                background: 'rgba(235, 235, 235)',
            }}
        >
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
};

export default VisualiserCanvas;
