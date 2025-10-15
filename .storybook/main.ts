import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: [
        '../src/**/*.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
        '../src/style.css',
        // '../tailwind.config.js',
    ],
    addons: ['@storybook/addon-links', '@storybook/addon-docs', '../preset.js'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
};
export default config;
