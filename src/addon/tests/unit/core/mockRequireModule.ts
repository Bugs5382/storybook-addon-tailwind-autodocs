// TODO: Figure out what needs to happen to this + usages of this on SB10 migration (ESM)
// Inspired by https://github.com/vitest-dev/vitest/discussions/3134#discussioncomment-7135147
const Module = require('module').Module;

export function mockRequireModule(mockedUri: string, stub: any) {
    Module._load_original = Module._load;
    Module._load = function (uri: string, parent: any) {
        if (uri === mockedUri) return stub;
        return Module._load_original(uri, parent);
    };
}

export function restoreRequireModule() {
    if (Module._load_original) {
        Module._load = Module._load_original;
        delete Module._load_original;
    }
}
