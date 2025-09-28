import React from 'react';

import { API_HashEntry } from 'storybook/internal/types';

interface Props {
    item: API_HashEntry;
}

const ThemeLabelWrapper = ({ item }: Props) => {
    if (item.tags?.includes('tailwind')) {
        const title = item.name;
        return <span>{title}</span>;
    }
};

export default ThemeLabelWrapper;
