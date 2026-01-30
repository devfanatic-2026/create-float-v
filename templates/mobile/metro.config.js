const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Add node_modules paths
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Critical for pnpm/monorepos
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// 4. Manual mapping for modules that Metro struggles to find in pnpm store
const extraNodeModules = {};

try {
    // Resolve @babel/runtime
    extraNodeModules['@babel/runtime'] = path.dirname(require.resolve('@babel/runtime/package.json'));
} catch (e) { }

try {
    // Resolve @float-v/lite to its source in workspace
    extraNodeModules['@float-v/lite'] = path.resolve(workspaceRoot, 'float-v-lite');
} catch (e) { }

config.resolver.extraNodeModules = extraNodeModules;

module.exports = config;
