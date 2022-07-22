// This file exists to get Jest to run properly

module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ["@babel/preset-react", { "runtime": "automatic" }],
        '@babel/preset-typescript'
    ],
};