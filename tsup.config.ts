
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/pf_EntityLookup.ts'],
    format: ['iife'],
    legacyOutput: true,
    globalName: 'PF',
    minify: true,
    dts: true,
    sourcemap: true,
    clean: true,
});
