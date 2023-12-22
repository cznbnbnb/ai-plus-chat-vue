module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-essential'
      // 其他扩展或配置...
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      requireConfigFile: false,
    },
    rules: {
      'no-unused-vars': 'warn',
      // 其他自定义规则...
    },
  };
  