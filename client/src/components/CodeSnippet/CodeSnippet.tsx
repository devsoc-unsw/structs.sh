import React, { FC } from 'react';

interface Props {}

const CodeSnippet: FC<Props> = () => (
  <div
    style={{
      height: '650px',
      width: '100%',
      background: 'rgba(235, 235, 235)',
      overflowY: 'scroll',
      padding: 15,
    }}
  >
    <svg id="code-canvas" style={{ height: '100%', width: 1000 }} />
  </div>
);

export default CodeSnippet;
