/**
 * Basically a CSF file that exports a story rendering the colors
 * @param colors - Array of color groups with key, value, and subtitle
 *
 * NOTE: title in default export needs to match
 *
 * TODO: Fix theming so that we can use whatever the user defines
 */
const colorsCsf = (
    colors: Array<{
        key: string;
        value: Record<string, string>;
        subtitle: string;
    }>
) => {
    return `
import { styled, ThemeProvider, themes, convert, useTheme} from 'storybook/theming';

const Item = styled.div(({theme}) => {
    console.log('Theme in styled component:', theme.typography);
    return {
        marginBottom: '24px',
        fontFamily: theme.typography.fonts.base,
    };
});

const ColorItem = ({ title, subtitle, colors }) => {
    return (
        <Item>
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
        </Item>
    );
};

const ColorPalette = ({ children }) => {
    return <div style={{ padding: '16px' }}>{children}</div>;
};

export default {
    title: 'Theme',  
    parameters: {
        layout: 'fullscreen',
        options: { bottomPanelHeight: 0 }
    },
    decorators: [
        (Story) => {
            // TODO: Refactor to 'normal' once this function is baked in: https://github.com/storybookjs/storybook/issues/28664
            const { window: globalWindow } = global;
            const getPreferredColorScheme = () => {
                if (!globalWindow || !globalWindow.matchMedia) return 'light';

                const isDarkThemePreferred = globalWindow.matchMedia('(prefers-color-scheme: dark)').matches;
                if (isDarkThemePreferred) return 'dark';

                return 'light';
            };
            return (
                <ThemeProvider theme={convert(themes[getPreferredColorScheme()])} >
                    <Story />
                </ThemeProvider>
            );
        }
    ]
};

export const Colors = {
    render: () => {
        const colorData = ${JSON.stringify(colors)};
        return (
            <ColorPalette>
                {${JSON.stringify(colors)}.map(({ key, value, subtitle }) => (
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

export const Test = {
    render: () => <div>Test</div>
}
`;
};
export default colorsCsf;
