import React from 'react';
import ReactJson from 'react-json-view';

export interface DebuggerProps {
  src: Object;
}

export const Debugger: React.FC<DebuggerProps> = ({ src }) => (
  <div className="DEBUG">
    <pre>
      <ReactJson src={src} name={null} />
    </pre>
  </div>
);
