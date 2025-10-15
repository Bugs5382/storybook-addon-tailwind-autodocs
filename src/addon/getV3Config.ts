import { serverRequire } from 'storybook/internal/common';

export const getV3Config = async (configFileName: string) => {
    // TODO: wrap in try catch
    const resolveConfig = await import('tailwindcss/resolveConfig.js');
    const config = await serverRequire(configFileName);
    return resolveConfig.default(config);
};
