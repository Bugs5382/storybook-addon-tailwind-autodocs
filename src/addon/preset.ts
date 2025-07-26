import type { Indexer, IndexInput } from '@storybook/types';
import { TAILWIND_REGEX, vite, webpack } from './unplugin';

const dynamicIndexer: Indexer = {
    test: TAILWIND_REGEX,
    /**
     * There are a few issues here.
     * 1. Storybook's indexer API doesn't support "type: 'docs'", tracked here: https://github.com/storybookjs/storybook/issues/28803
     * In order to create an index with type 'docs', we must hit the code within the if statement here https://github.com/storybookjs/storybook/blob/11daa5e19520e0fe42ac5a7b4b7a4d896a85e3ea/code/core/src/core-server/utils/StoryIndexGenerator.ts#L463
     * In order to do that, we need to have an 'autodocs' tag. It is worth noting that this is quite fragile (autodocs needs to be enabled); but this is the best we can do for now.
     * FIXME: Refactor once "type: docs" is officially supported
     *
     * 2. The importPath in IndexInput is ignored by the indexer API; but it will soon, tracked here: https://github.com/storybookjs/storybook/pull/30612
     * Instead it always uses the file being indexed. This prevents creating multiple indexes per config file.
     * FIXME: Refactor once custom importPath is supported
     *
     * 3. The exportName is used to determine the name of the index, and it must match the name of the autodocs default name (which is usually 'Docs', but can be overridden via defaultName https://storybook.js.org/docs/writing-docs/autodocs#configure).
     * The current solution uses a same name export so that we don't see the 'story' tab in the UI, but this is a bit hacky as I'm not sure about this behaviour.
     * FIXME: Once the indexer API supports 'type: docs', we can remove this hack and use a proper autodocs export.
     */
    createIndex: async () => {
        return [
            {
                type: 'docs',
                exportName: '__docs',
                name: 'Docs',
                title: 'Theme',
                tags: ['autodocs'],
            } as IndexInput,
        ];
    },
};

export const experimental_indexers: Indexer[] = [dynamicIndexer];

export const viteFinal = async (config: any) => {
    const { plugins = [] } = config;
    plugins.push(vite({}));
    config.plugins = plugins;
    return config;
};

export const webpackFinal = async (config: any) => {
    const { plugins = [] } = config;
    plugins.push(webpack({}));
    config.plugins = plugins;
    return config;
};
