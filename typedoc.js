module.exports = {
    out: 'build/typedoc',
    entryPoints: [
      './packages/sdk-api/src/index.ts',
      './packages/sdk-events/src/index.ts'
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