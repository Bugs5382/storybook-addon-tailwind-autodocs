/**
 * Basically a CSF file that exports a story rendering the colors
 * @param colors - Array of color groups with key, value, and subtitle
 *
 * NOTE: title needs to match
 */
const colors = (colors: Array<{ key: string; value: Record<string, string>; subtitle: string }>) => {
    return `
import React from 'react';

const ColorItem = ({ title, subtitle, colors }) => {
    return (
        <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>{title}</h3>
            {subtitle && <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>{subtitle}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.entries(colors).map(([name, color]) => (
                    <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: color,
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                        <span style={{ fontSize: '12px', marginTop: '4px' }}>{name}</span>
                        <span style={{ fontSize: '10px', color: '#666' }}>{color}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ColorPalette = ({ children }) => {
    return <div style={{ padding: '16px' }}>{children}</div>;
};

export default {
    title: 'Theme/Colors',
    parameters: {
        layout: 'fullscreen',
        options: { bottomPanelHeight: 0 }
    }
};

export const Colors = {
    render: () => {
        const colorData = ${JSON.stringify(colors)};
        return (
            <ColorPalette>
                {colorData.map(({ key, value, subtitle }) => (
                    <ColorItem
                        key={key}
                        title={key}
                        subtitle={subtitle}
                        colors={value}
                    />
                ))}
            </ColorPalette>
        );
    }
};
`;
};
export default colors;