module.exports = {
  out: 'build/typedoc',
  entryPoints: [
    'packages/sdk-api',
    'packages/sdk-events',
    'packages/ext-taquito'
  ],
  entryPointStrategy: 'packages',
  pluginPages: {
    pages: [
      { 
        title: 'VIRTUAL', 
        childrenDir: __dirname, 
        children: [
          { 
            title: 'Changelog', 
            source: 'CHANGELOG.md' 
          },
        ] 
      },
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