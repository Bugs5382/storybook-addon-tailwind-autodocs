import { Typography } from '../core/util/helpers';

/**
 * Basically a CSF file that exports a story rendering the colors
 * @param colors - Array of color groups with key, value, and subtitle*
 * @param typography - TODO
 * @returns CSF string
 */
const csf = (
    colors: Array<{
        key: string;
        value: Record<string, string>;
        subtitle: string;
    }>,
    typography: Typography
) => {
    const fontSizes = Object.values(typography.size);
    const fontWeights = Object.entries(typography.weight);
    const fontFamilies = Object.entries(typography.type);
    console.log(fontFamilies);
    const sampleText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

    return `
import { styled, ThemeProvider, themes, ensure } from 'storybook/theming';
import { ColorPalette, ColorItem, Typeset } from '@storybook/addon-docs/blocks';
import { createElement } from 'react';

export default {
    title: 'Theme',
    parameters: {
        layout: 'fullscreen',
        options: { bottomPanelHeight: 0 }
    },
    decorators: [
        (Story) => {
            return createElement(ThemeProvider, { theme: ensure(themes.light) }, createElement(Story));
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
    WebkitOverflowScrolling: 'touch',
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
        return createElement(Wrapper, null,
            createElement(Container, null,
                createElement(Title, null, 'Colors'),
                createElement('br'),
                createElement(ColorPalette, null,
                    ${JSON.stringify(colors)}.map(({ key, value, subtitle }) =>
                        createElement(ColorItem, {
                            key: key,
                            title: key,
                            subtitle: subtitle,
                            colors: value
                        })
                    )
                )
            )
        );
    }
};

const FontHeaderSection = styled.div(({ theme }) => ({
    fontFamily: theme.typography.fonts.base,
    fontSize: \`\${theme.typography.size.s3}px\`,
    color: theme.color.defaultText,
    margin: 0,
    padding: 0,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    WebkitOverflowScrolling: 'touch',
}));

const HorizontalRule = styled.div(({ theme }) => ({
      border: '0 none',
      borderTop: \`1px solid \${theme.appBorderColor}\`,
      height: 4,
      paddingBottom: '30px',
}));

export const Typography = {
    render: () => createElement(
        Wrapper,
        null,
        createElement(
            Container,
            null,
            createElement(Title, null, 'Typography'),
            createElement('br'),
            ${JSON.stringify(fontFamilies)}.map(([label, fontFamily], familyIndex) =>
                [
                    createElement(
                        'div',
                        { key: label },
                        createElement(
                            FontHeaderSection,
                            null,
                            createElement(
                                'div',
                                null,
                                createElement('b', null, 'Font Face: '),
                                createElement(
                                    'span',
                                    { style: { fontFamily } },
                                    label
                                )
                            ),
                            createElement(
                                'div',
                                null,
                                createElement('b', null, 'Weights: '),
                                ${JSON.stringify(fontWeights)}.map(([weightLabel, weightValue], index) =>
                                    createElement(
                                        'span',
                                        {
                                            key: weightLabel,
                                            style: { fontWeight: weightValue, fontFamily }
                                        },
                                        \`\${weightValue}(\${weightLabel})\${index < ${fontWeights.length} - 1 ? ', ' : ''}\`
                                    )
                                )
                            )
                        ),
                        createElement(Typeset, {
                            fontSizes: ${JSON.stringify(fontSizes)},
                            fontWeight: 400,
                            sampleText: '${sampleText}',
                            fontFamily
                        })
                    ),
                    familyIndex < ${fontFamilies.length} - 1 ? createElement(HorizontalRule, { key: \`hr-\${label}\` }) : null
                ]
            ).flat()
        )
    )
}
`;
};

export default csf;
