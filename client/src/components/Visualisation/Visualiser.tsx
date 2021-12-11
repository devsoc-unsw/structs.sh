import React from 'react';

interface Props {}

const Visualiser: React.FC<Props> = () => {
    return (
        <header style={{ height: '100%', background: 'rgba(235, 235, 235)' }}>
            {/* TODO: Place visualiser canvas here */}
            <div className="visualiser">
                <svg className="visualiser-svg" overflow="auto" style={{ width: '100%' }}>
                    <g className="nodes" transform="translate(0, 20)" />
                    <g className="pointers" transform="translate(0, 20)" />
                </svg>
            </div>
        </header>
    );
};

export default Visualiser;
