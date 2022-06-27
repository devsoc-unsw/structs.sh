interface ParticleBackgroundTheme {
  backgroundCss: string;
  particleColor: string;
}

// Source: https://uigradients.com/#DigitalWater
export const lightParticleTheme: ParticleBackgroundTheme = {
  backgroundCss: 'linear-gradient(to right, #ffffff, #ffffff)',
  particleColor: '#555555',
};

// Source: https://uigradients.com/#Royal
export const darkParticleTheme: ParticleBackgroundTheme = {
  backgroundCss: `
          linear-gradient(
              to bottom,
              #14113C,
              #242059
          )
      `,
  particleColor: '#FFFFFF',
};
