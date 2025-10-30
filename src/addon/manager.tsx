import { addons } from 'storybook/manager-api';
import ThemeLabelWrapper from './components/ThemeLabelWrapper';
addons.setConfig({
    sidebar: {
        renderLabel: item => ThemeLabelWrapper({ item }),
    },
    // TODO: Add custom showPanel (and remove bottomPanelHeight 0 in csf) once this is fixed: https://github.com/storybookjs/storybook/issues/32062
});
