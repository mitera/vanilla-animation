import typescript from 'typescript';
import rollupTypescript from '@rollup/plugin-typescript';

const license = `/*!
 * @author Simone Miterangelis <simone@mite.it>
 * vanilla-animation v1.0.5 by @mitera
 * https://github.com/mitera/vanilla-animation
 * Released under the MIT License.
 */`;

export default {
    input: './src/vanilla-animation.ts',
    output: [
        {
            dir: 'dist',
            format: 'umd',
            name: 'VanillaAnimation',
            //file: pkg.main,
            banner: license,
            indent: '\t',
        }
    ],
    plugins: [
        rollupTypescript( { typescript } ),
    ],
};