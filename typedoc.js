module.exports = {
    out: 'build/typedoc',
    entryPoints: [
      'packages/*',
    ],
    entryPointStrategy: 'packages',
    pluginPages: {
      pages: [
        { title: 'VIRTUAL', childrenDir: '../', children: [
          { title: 'Changelog', source: 'CHANGELOG.md' },
        ] },
      ]
    },
    exclude: [
      '**/*.spec.ts',
      '**/data/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/rollup*.ts',
      '**/test/**',
      'examples/**'
    ],
    name: 'TzKT SDK',
    excludePrivate: true,
  };