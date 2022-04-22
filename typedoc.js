module.exports = {
    out: 'build/typedoc',
    readme: './README.md',
    entryPoints: [
      './packages/sdk-api/src/index.ts'
    ],
    exclude: [
      '**/*.spec.ts',
      '**/data/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/rollup*.ts',
      '**/test/**',
      '/coverage/**',
    ],
    name: 'TzKT SDK',
    excludePrivate: true,
  };