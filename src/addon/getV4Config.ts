import { resolveConfig } from './resolveConfigV4/resolveConfig';

export const getV4Config = (fileName: string) => {
    return resolveConfig(fileName);
};
