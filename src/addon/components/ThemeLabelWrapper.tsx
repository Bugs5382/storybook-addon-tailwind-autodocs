import React from 'react';
import { DocumentIcon } from '@storybook/icons';
import { API_HashEntry } from 'storybook/internal/types';
import { styled } from 'storybook/theming';

const TwAutodocsLabel = styled.div(({}) => ({
    colorScheme: 'light dark',
    position: 'absolute',
    inset: '0',
    width: '100%',
    display: 'flex',
    gap: '6px',
    alignItems: 'start',
    paddingLeft: '22px',
    paddingTop: '5px',
    paddingBottom: '4px',
    backgroundColor: 'light-dark(#f6f9fc, #222425)',
    borderRadius: '4px',
    fontSize: '14px',
    textDecoration: 'none',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    cursor: 'pointer',
    color: 'inherit',
    '&:hover': {
        backgroundColor: 'light-dark(#e5f2fc, #202c34)',
    },
    // Selected state
    '[data-selected="true"] &': {
        backgroundColor: '#029cfd',
        color: 'white',
    },
}));

const TwAutodocsLabelIcon = styled.div(() => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: '2px',
    svg: {
        width: '14px',
        height: '14px',
        color: 'rgb(255, 131, 0)',
    },
}));

interface Props {
    item: API_HashEntry;
}

// Inspired by https://stackblitz.com/~/github.com/Sidnioulz/storybook-sidebar-urls
const ThemeLabelWrapper = ({ item }: Props) => {
    if (
        item.tags?.includes('tailwind') &&
        'parent' in item &&
        item.parent !== undefined
    ) {
        return (
            <TwAutodocsLabel>
                <TwAutodocsLabelIcon>
                    <DocumentIcon />
                </TwAutodocsLabelIcon>
                {item.name}
            </TwAutodocsLabel>
        );
    }
};

export default ThemeLabelWrapper;
