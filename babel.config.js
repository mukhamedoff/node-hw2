module.exports = api => {
  const isTest = api.env('test');
  return {
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript'
    ],
    plugins: [
      ["@babel/plugin-proposal-decorators", { "legacy": true }]
    ]
  }
};
