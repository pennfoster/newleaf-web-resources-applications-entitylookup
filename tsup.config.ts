
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/pf_EntityLookup.ts'],
    format: ['esm', 'cjs'],
    dts: true,           // generate .d.ts files
    sourcemap: true,     // include source maps
    clean: true,         // clean output before build
});
