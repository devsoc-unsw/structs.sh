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
            to right,
            #141E30,
            #243B55
        )
    `,
    particleColor: '#FFFFFF',
};
