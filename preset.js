// this file is slightly misleading. It needs to be CJS, and thus in this "type": "module" package it should be named preset.cjs
// but Storybook won't pick that filename up so we have to name it preset.js instead
const preset = require('./dist/preset.cjs');

const managerEntries = (entry = []) => {
    return [...entry, require.resolve('./dist/manager.js')];
};

module.exports = {
    ...preset,
    managerEntries,
};
