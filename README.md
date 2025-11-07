# Tailwind Autodocs 🎨

Design system documentation that comes directly from your tailwind config.

Demo: [Storybook](https://matanio.github.io/storybook-addon-tailwind-autodocs/)*

_*This uses the [`index.css`](https://github.com/matanio/storybook-addon-tailwind-autodocs/blob/main/src/style.css) file from this project_

<p align="center">
  <img src="https://github.com/user-attachments/assets/d7e2da9b-a674-44d6-9638-484073990921" />
</p>

## Features

- Automatically generates documentation from your Tailwind configuration
- Supports both Tailwind v3 (`tailwind.config.js|ts`) and v4 (CSS `@theme` directive)
- Works with Hot Module Reloading (HMR); changes to your config are reflected immediately
- Displays theme colors and typography using Storybook's doc blocks
- Customizable sections and output format

_...and more features that are hopefully coming soon:_

- _Adding autodocs for tailwind spacing and screen break points_

## Requirements
- Storybook
- TailwindCSS v3.x or v4.x
- Vite

## Installation

First, install the package.

```sh
npm install --save-dev storybook-addon-tailwind-autodocs
```

Then, register it as an addon in `.storybook/main.js`, and specify your tailwind configuration path there too.

```ts
// .storybook/main.ts

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
    stories: [
        // ...
        '../src/index.css', // 👈 replace with your tailwind configs path
        // '../tailwind.config.js', // 👈 OR use this for tailwind v3
    ],
    // ...
    addons: [
        '@storybook/addon-essentials',
        'storybook-addon-tailwind-autodocs', // 👈 register the addon here
    ],
};

export default config;
```

Then, run storybook with `npm run storybook`

And there you go! You should now see a new category in your storybook called "Tailwind Theme". 🎉

## Configuration
You can customise the addon behaviour by passing in optional parameters:

| Option           | Type                                                                                | Default                    | Description                                                                                                                                                                                           |
|------------------|-------------------------------------------------------------------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sections`       | `('Colors'\|'Typography')[]` or `{ name: 'Colors'\|'Typography', path?: string }[]` | `['Colors', 'Typography']` | Which theme sections to enable. Only `'Colors'` and `'Typography'` are valid section names. `name` is the story identifier and label. `path` is the sidebar location (uses `defaultPath` if omitted). |
| `defaultPath`    | `string`                                                                            | `'Tailwind Theme/'`        | The default sidebar path prefix.                                                                                                                                                                      |                                                                                                                      |
| `forceSingleDoc` | `undefined` or `string` or `{ name: string, path?: string }`                        | `undefined`                | If defined, combines all sections into one story. Can be a string (uses `defaultPath`) or object with custom `name` and optional `path`. Unlike `sections`, `name` can be any custom string.          |

### Examples

_The terminology (Category, Folder, Component) is explained in Storybook's documentation [here](https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy#structure-and-hierarchy)._

**Default configuration (no options):**
```ts
// .storybook/main.ts
const config: StorybookConfig = {
    stories: [
        // ...
        '../src/index.css'
    ],
    addons: [
        // ...
        'storybook-addon-tailwind-autodocs',
    ],
};
```

**Custom Category:**
```ts
const config: StorybookConfig = {
    stories: [
        // ...
        '../src/index.css'
    ],
    addons: [
        // ...
        {
            name: 'storybook-addon-tailwind-autodocs',
            options: {
               defaultPath: 'Design System/' 
            }
        }
    ],
};
```

**Custom Paths / Sections**
```ts
const config: StorybookConfig = {
    stories: [
        // ...
        '../src/index.css'
    ],
    addons: [
        // ...
        {
            name: 'storybook-addon-tailwind-autodocs',
            options: {
                sections: [
                    {
                        name: 'Typography',
                        path: 'Design System/Component Box',
                    },
                ],
            }
        }
    ],
};
```
This will result in only Typography appearing under a component (`'Component Box'`) in a category called `'Design System'`.
Adding a `'/'` at the end of the path will result in a folder instead of a component.

**Single Combined Document**
```ts
const config: StorybookConfig = {
    stories: [
        // ...
        '../src/index.css'
    ],
    addons: [
        // ...
        {
            name: 'storybook-addon-tailwind-autodocs',
            options: {
                forceSingleDoc: 'My Theme',
                // The above is same as 
                // forceSingleDoc: {
                //     name: 'My Theme'
                // }
            }
        }
    ],
};
```
This will result in a single story called `'My Theme'` containing both Colors and Typography sections under the category created by `defaultPath` (`'Tailwind Theme'`). A `path` can be defined
to place it elsewhere, similar to the `sections`.