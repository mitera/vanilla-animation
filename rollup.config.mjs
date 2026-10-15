import { readFileSync } from 'node:fs';
import typescript from 'typescript';
import rollupTypescript from '@rollup/plugin-typescript';

// Read package metadata so the banner stays in sync with package.json on every release
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// GitHub owner/repo, e.g. "mitera/vanilla-animation", derived from the repository URL
const repoPath = pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '').replace(/^https?:\/\/github\.com\//, '');
const [repoOwner] = repoPath.split('/');

const license = `/*!
 * @author ${pkg.author}
 * ${pkg.name} v${pkg.version} by @${repoOwner}
 * https://github.com/${repoPath}
 * Released under the ${pkg.license} License.
 */`;

export default {
    input: `./src/${pkg.name}.ts`,
    output: [
        {
            dir: 'dist',
            format: 'umd',
            name: 'VanillaAnimation',
            banner: license,
            indent: '\t',
        }
    ],
    plugins: [
        rollupTypescript( { typescript } ),
    ],
};
