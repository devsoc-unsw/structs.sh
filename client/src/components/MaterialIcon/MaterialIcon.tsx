import React from 'react';

const MaterialIcon = ({ name, style }: { name: string, style?: React.CSSProperties }) => (
  <span className="material-icons-round" style={style}>{name}</span>
);

export default MaterialIcon;
