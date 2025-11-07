export class Color {
    public baseName: string;
    public shades: Record<string, string>;
    public subtitle: string;

    static readonly DEFAULT_COLOR_LABEL = 'Default color from TailwindCSS';
    static readonly EXTENDED_COLOR_LABEL =
        'Extended from default Tailwind color';
    static readonly CUSTOM_COLOR_LABEL = 'Custom color';

    constructor(baseName: string, shades: Record<string, string>) {
        this.baseName = baseName;
        this.shades = shades;
        // TODO: Add ability for user to customise / turn on/off subtitle?
        this.setSubtitle();
    }

    private setSubtitle() {
        const allColors = require('tailwindcss/colors');
        const tailwindShades = allColors[this.baseName];

        // If tailwind doesn't have this baseName, then it's a custom color
        if (typeof tailwindShades === 'undefined') {
            this.subtitle = Color.CUSTOM_COLOR_LABEL;
            return;
        }

        // Handle simple colors (e.g. white, black, transparent, inherit, current)
        if (typeof tailwindShades === 'string') {
            if (
                Object.keys(this.shades).length === 1 &&
                this.shades[this.baseName] === tailwindShades
            ) {
                this.subtitle = Color.DEFAULT_COLOR_LABEL;
            } else {
                this.subtitle = Color.CUSTOM_COLOR_LABEL;
            }
            return;
        }

        // Handle object colors (e.g. red, blue, etc.)
        const tailwindKeys = Object.keys(tailwindShades);
        const shadeKeys = Object.keys(this.shades);

        const shadesMatchTailwindShades = tailwindKeys.every(
            key => this.shades[key] === tailwindShades[key]
        );

        // If we match the tailwind defaults exactly, then treat it as a default
        const isExactMatch =
            tailwindKeys.length === shadeKeys.length &&
            shadesMatchTailwindShades;
        if (isExactMatch) {
            this.subtitle = Color.DEFAULT_COLOR_LABEL;
            return;
        }

        // If we match the tailwind defaults, and have a few extras, then say it's extended
        const isExtended =
            shadesMatchTailwindShades && shadeKeys.length > tailwindKeys.length;
        if (isExtended) {
            this.subtitle = Color.EXTENDED_COLOR_LABEL;
            return;
        }

        // If we're here, then the baseName matches (e.g. red) but we don't have all the defaults
        this.subtitle = Color.CUSTOM_COLOR_LABEL;
    }
}
