/**
 * Overrides the tsconfig used for the app:
 *  - loads the appropriate tsconfig to instrument ts-node
 *      - allows IDE to use original tsconfig vs ts-node
 *  - improves performance
 *  - transpileOnly tells TypeScript to avoid checking test code during the compiling phase
 */

const tsNode = require('ts-node');

tsNode.register({
    files: true,
    transpileOnly: true,
    project: './tsconfig.tests.json'
});