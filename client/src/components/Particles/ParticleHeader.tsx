import { Theme } from '@mui/material';
import { useTheme } from '@mui/styles';
import React, { useEffect } from 'react';
import Particles from 'react-tsparticles';
import './ParticleHeader.scss';
import { darkParticleTheme } from './ParticleThemes';

interface Props {}

const ParticleHeader: React.FC<Props> = () => {
  const theme: Theme = useTheme();
  // const particleTheme = theme === darkTheme ? darkParticleTheme : lightParticleTheme;
  const particleTheme = darkParticleTheme;

  // Note: this is a hacky way of forcefully setting the background gradient
  useEffect(() => {
    const body: any = document.querySelector('body');
    if (!body) return () => {};

    body.style.background = particleTheme.backgroundCss;

    return () => {
      body.style.background = theme.palette.background.default;
    };
  });

  return <div>{/* {' '} */}</div>;
};

export default ParticleHeader;
