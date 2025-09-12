/**
 * Basically a CSF file that exports a story rendering the colors
 * @param colors - Array of color groups with key, value, and subtitle
 */
const colors = (colors: Array<{ key: string; value: Record<string, string>; subtitle: string }>) => {
    return `
import React from 'react';

const ColorItem = ({ title, subtitle, colors }) => {
    return React.createElement('div', { style: { marginBottom: '24px' } },
        React.createElement('h3', { style: { margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' } }, title),
        subtitle && React.createElement('p', { style: { margin: '0 0 12px 0', fontSize: '14px', color: '#666' } }, subtitle),
        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
            Object.entries(colors).map(([name, color]) =>
                React.createElement('div', { key: name, style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
                    React.createElement('div', {
                        style: {
                            width: '40px',
                            height: '40px',
                            backgroundColor: color,
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                        }
                    }),
                    React.createElement('span', { style: { fontSize: '12px', marginTop: '4px' } }, name),
                    React.createElement('span', { style: { fontSize: '10px', color: '#666' } }, color)
                )
            )
        )
    );
};

const ColorPalette = ({ children }) => {
    return React.createElement('div', { style: { padding: '16px' } }, children);
};

export default {
    title: 'Colors',
    parameters: {
        layout: 'fullscreen',
        options: {
          bottomPanelHeight: 0
        }
    }
};

export const Colors = {
    render: () => {
        const colors = ${JSON.stringify(colors)};

        return React.createElement(ColorPalette, null,
            colors.map(({ key, value, subtitle }) =>
                React.createElement(ColorItem, {
                    key: key,
                    title: key,
                    subtitle: subtitle,
                    colors: value
                })
            )
        );
    }
};
`;
};

export default colors;