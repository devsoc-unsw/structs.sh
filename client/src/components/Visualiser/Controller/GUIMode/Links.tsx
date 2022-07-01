import React, { FC } from 'react';

interface Props {
  colour: string;
}

export const LastLink: FC<Props> = ({ colour = '#000000' }) => (
  <svg width="50" height="50">
    <path d="M1 1 V 25 H30" fill="none" stroke={colour} strokeWidth="2" />
  </svg>
);

export const Link: FC<Props> = ({ colour = '#000000' }) => (
  <svg width="50" height="50">
    <path d="M1 1 V 49  M1 25 H30" fill="none" stroke={colour} strokeWidth="2" />
  </svg>
);
