export const getVersionFromStories = (stories: string[]): 3 | 4 | null => {
    const hasConfigFile = stories.some(
        storyPath =>
            storyPath.includes('tailwind.config.ts') ||
            storyPath.includes('tailwind.config.js')
    );

    const hasCssFile = stories.some(storyPath => storyPath.endsWith('.css'));

    // TODO: Add warning if you have both tailwind v3 and v4 paths specified

    if (hasConfigFile) return 3;
    if (hasCssFile) return 4;

    // TODO: Refactor so that this throws the error and it is caught in the caller function
    // TODO: Use in combination with package version detection to tell warn them as well
    // TODO: Decide whether error like this should go after attempt at plugin injection.
    // TODO: Probably time to create a logger class
    console.warn(
        '\x1b[33m%s\x1b[0m', // Yellow color
        '[storybook-addon-tailwind-autodocs] Warning: No Tailwind config or CSS file detected in stories. ' +
            'Please include tailwind.config.ts/js or a .css file in your Storybook configuration.'
    );
    return null;
};
