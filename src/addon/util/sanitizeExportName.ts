// src/addon/util/sanitizeExportName.ts
// TODO: Investigate how Storybook creates its index + export to see how this should be santiized properly
// Good enough for now, but will break under some circumstances
export function sanitizeExportName(name: string): string {
    return name
        .replace(/[^a-zA-Z0-9\s]/g, ' ') // Replace special characters with spaces
        .split(/\s+/) // Split on one or more spaces
        .filter(word => word.length > 0) // Remove empty strings
        .map(word => {
            // Capitalize first letter of each word
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
}
