/**
 * Basically a CSF file that exports a story rendering the colors
 * @param colors - Array of color groups with key, value, and subtitle*
 * @returns CSF string
 */
const csf = (
    colors: Array<{
        key: string;
        value: Record<string, string>;
        subtitle: string;
    }>
) => {
    return `
import { styled, ThemeProvider, themes, ensure, CSSObject} from 'storybook/theming';
import { ColorPalette, ColorItem} from '@storybook/addon-docs/blocks'

export default {
    title: 'Theme',  
    parameters: {
        layout: 'fullscreen',
        options: { bottomPanelHeight: 0 }
    },
    decorators: [
        (Story) => {
            return (
                <ThemeProvider theme={ensure(themes.light)} >
                    <Story />
                </ThemeProvider>
            );
        }
    ]
};


const Wrapper = styled.div(({ theme }) => ({
  background: theme.background.content,
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'center',
  padding: '4rem 20px',
  minHeight: '100vh',
  boxSizing: 'border-box',
  gap: '3rem',
  [\`@media (min-width: 600px)\`]: {}
}));

const Container = styled.div(() => ({
    maxWidth: '1000px',
    width: '100%',
    minWidth: '0px'
}));

// Inspired by https://github.com/storybookjs/storybook/blob/main/code/addons/docs/src/blocks/components/DocsPage.tsx
// Basically what the toGlobalSelector('h1') renders
const Title = styled.h1(({ theme }) => ({
    fontFamily: theme.typography.fonts.base,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    WebkitOverflowScrolling: 'touch' as CSSObject['WebkitOverflowScrolling'],
    margin: '20px 0 8px',
    padding: 0,
    cursor: 'text',
    position: 'relative',
    color: theme.color.defaultText,
    '&:first-of-type': {
      marginTop: 0,
      paddingTop: 0
    },
    '&:hover a.anchor': {
      textDecoration: 'none'
    },
    '& code': {
      fontSize: 'inherit'
    },
    fontSize: \`\${theme.typography.size.l1}px\`,
    fontWeight: theme.typography.weight.bold,
}));
    

export const Colors = {
    render: () => {
        return (
            <Wrapper>
                <Container>
                    <Title>Colors</Title>
                    <br />
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
                </Container>
            </Wrapper>
        );
    }
};


export const Typography = {
    render: () => {
        return (
            <Wrapper>
                <Container>
                    <Title>Typography</Title>
                    <br />
                    <div>TODO</div>
                </Container>
            </Wrapper>
        )
    }
}
`;
};
// TODO: Add layouts
export default csf;
