/**
 * File required by Dynamics since Power Platform does not support js.map files (only map.js). 
 *
 */
import fs from "fs";
import path from "path";

try {

    const distDir = path.resolve('dist');
    const iifeDir = path.join(distDir, 'iife');

    if (!fs.existsSync(iifeDir)) {
        console.warn('⚠️ No iife directory found. Skipping.');
        process.exit(0);
    }

    const files = fs.readdirSync(iifeDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));

    jsFiles.forEach(jsFile => {
        const jsFilePath = path.join(iifeDir, jsFile);
        const mapFileName = `${jsFile}.map`;
        const mapFilePath = path.join(iifeDir, mapFileName);
        const renamedMapFileName = mapFileName.replace(/\.js.map$/, '.map.js');
        const renamedMapFilePath = path.join(distDir, renamedMapFileName);
        const newJsFilePath = path.join(distDir, jsFile);

        // Rename and move map file
        if (fs.existsSync(mapFilePath)) {
            console.log(`New map file name: ${renamedMapFileName}`);
            fs.renameSync(mapFilePath, renamedMapFilePath);
        } else {
            console.warn(`⚠️ Map file not found for: ${jsFile}`);
        }

        // Update sourceMappingURL and move JS file
        let jsContent = fs.readFileSync(jsFilePath, 'utf8');
        jsContent = jsContent.replace(
            /\/\/# sourceMappingURL=.*$/,
            `//# sourceMappingURL=${renamedMapFileName}`
        );
        fs.writeFileSync(newJsFilePath, jsContent);

        console.log(`✅ Moved & updated: ${jsFile} → ${renamedMapFileName}`);
    });

    // Remove the iife directory
    fs.rmSync(iifeDir, { recursive: true, force: true });
    console.log('✅ Source map renamed and JS file updated successfully.');
} catch (error) {
    console.error('❌ Failed to update source map reference:', error);
    process.exit(1); // Optional: exit with error code for CI/CD
}

