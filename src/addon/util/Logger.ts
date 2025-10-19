export class Logger {
    private static prefix = '[storybook-addon-tailwind-autodocs]';

    static warn(message: string): void {
        // Yellow
        console.warn('\x1b[33m%s\x1b[0m', `${this.prefix} Warning: ${message}`);
    }

    static error(message: string): void {
        // Red
        console.error('\x1b[31m%s\x1b[0m', `${this.prefix} Error: ${message}`);
    }

    static info(message: string): void {
        // Cyan
        console.info('\x1b[36m%s\x1b[0m', `${this.prefix} ${message}`);
    }
}
