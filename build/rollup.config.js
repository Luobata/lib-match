import babel from 'rollup-plugin-babel';
import alias from 'rollup-plugin-alias';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import path from 'path';
import flow from 'rollup-plugin-flow';

const root = path.resolve(__dirname, '../');

module.exports = {
    input: path.resolve(root, 'src/index.js'),
    output: {
        file: 'dist/match.esm.js',
        format: 'es',
        name: 'match',
        sourcemap: true,
    },
    plugins: [
        resolve(),
        flow(
            {
                all: true
            }
        ),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            // presets: [
            //     ["env", {
            //         "modules": false,
            //         "targets": {
            //             "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
            //         }
            //     }],
            // ]
        }),
        alias({
            MATCH: path.resolve(root, 'src/match'),
            LIB: path.resolve(root, 'src/lib'),
            TEST: path.resolve(root, 'src/test')
        })
    ]
// output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
};
