import React, { FC } from 'react';

interface Props {}
  
const CodeSnippet: FC<Props> = () => (
  <div
    id="code-canvas"
    style={{ height: '100%', width: '100%', background: 'rgba(235, 235, 235)', overflowY: 'scroll', padding: 15}}
  />
);

export default CodeSnippet;