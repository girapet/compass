import terser from '@rollup/plugin-terser';

export default {
	input: 'js/index.js',
	output: {
		file: 'js/dist/index.js',
		format: 'es',
		plugins: [terser()],
    sourcemap: true
	}
};