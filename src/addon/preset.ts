import type { Indexer } from 'storybook/internal/types';
import { vite, webpack } from './unplugin';
import { configIndexer } from './indexers/configIndexer';

export const experimental_indexers: Indexer[] = [configIndexer];

export const viteFinal = async (config: any) => {
    const { plugins = [] } = config;
    plugins.push(vite({}));
    config.plugins = plugins;
    return config;
};

// TODO: Test webpack
export const webpackFinal = async (config: any) => {
    const { plugins = [] } = config;
    plugins.push(webpack({}));
    config.plugins = plugins;
    return config;
};
