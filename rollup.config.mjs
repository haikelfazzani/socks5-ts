import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

// const dir = 'socks4';

const bundle = (config) => ({
  ...config,
  input: `src/index.ts`,
});

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `dist/index.cjs`,
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: `dist/index.mjs`,
        format: 'es',
        sourcemap: false,
      }
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `dist/index.d.ts`,
      format: 'es',
    },
  }),
];