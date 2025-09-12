import React from 'react';

import { DocumentIcon } from '@storybook/icons'
import { IndexInput } from 'storybook/internal/types';

interface Props {
    item: IndexInput;
}

const ThemeLabelWrapper = ({ item } : Props) => {
    if (item.tags?.includes('tailwind')) {
        const title = item.name
        return (
            <>
                <a className="tw-autodocs-label">
                    <div className="tw-autodocs-label-icon">
                        {/* TODO: Use different icon? */}
                        <DocumentIcon />
                    </div>
                    {title}
                </a>
            </>
        )
    }
};

export default ThemeLabelWrapper;