import path from "path";
import { pathToFileURL } from "url";

/**
 * Required to run TypeScript tests in Node.js environments while using ESM module standards (NodeNext). Windows
 * platforms need full/explicit file path to modules. 
 * 
 * Resolve a module path to a valid file:// URL string for dynamic import.
 * Handles relative and absolute paths, and normalizes cross-platform.
 *
 * @param relativeToRoot - Relative or absolute path to a file
 * @returns file:// URL string for import()
 */
export function resolveModulePath(relativeToRoot: string): string {
    const projectRoot = process.cwd(); // Where your dev server or test runner starts
    const fullPath = path.resolve(projectRoot, relativeToRoot);
    return pathToFileURL(fullPath).href;
}