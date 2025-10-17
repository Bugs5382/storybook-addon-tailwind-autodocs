interface PackageJson {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

interface ResolvedConfig {
    theme: {
        colors: Record<string, any>;
        fontSize: Record<string, any>;
        fontFamily: Record<string, any>;
        fontWeight: Record<string, any>;
        // screens: Record<string, any>;
        // spacing: Record<string, any>;
        // borderRadius: Record<string, any>;
    };
}
