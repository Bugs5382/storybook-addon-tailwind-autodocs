import { serverRequire } from 'storybook/internal/common';

export const getV3Config = async (configFileName: string) => {
    const resolveConfig = await import('tailwindcss/resolveConfig');
    const config = await serverRequire(configFileName);
    return resolveConfig.default(config);
};
