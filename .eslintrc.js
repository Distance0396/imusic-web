module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  plugins: ['vue', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'vue/html-indent': ['warn', 2],
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 4 },
      multiline: { max: 1 },
    }],
    // "implicit-arrow-linebreak": "beside",
    "implicit-arrow-linebreak": ["error", "beside"],
    // "arrow-parens": ["error", "always"],  // 强制单参数时省略括号（默认配置）
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid', //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
        singleQuote: true,
        semi: false,
        bracketSpacing: true,
        trailingComma: 'es5', // 与 .prettierrc.js 保持一致
        tabWidth: 2,
        useTabs: false,
      },
    ],
  },
}
