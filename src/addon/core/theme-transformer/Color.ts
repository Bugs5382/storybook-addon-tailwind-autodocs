import allColors from 'tailwindcss/dist/colors';

export class Color {
    public baseName: string;
    public shades: Record<string, string>;
    public subtitle: string;

    constructor(baseName: string, shades: Record<string, string>) {
        this.baseName = baseName;
        this.shades = shades;
        // TODO: Improve detection of default vs custom colors
        const allColors = require('tailwindcss/colors'); // TODO: Error handling?
        this.subtitle = allColors.hasOwnProperty(baseName)
            ? 'Default color from Tailwind CSS'
            : 'Custom color';
    }
}
