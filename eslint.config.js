import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      // 基本规则
      'semi': ['error', 'never'], // 不使用分号
      'no-extra-semi': 'error', // 禁止不必要的分号
      'no-unused-vars': 'error', // 禁止未使用的变量
      'no-trailing-spaces': 'error', // 禁止行尾空白
      'quotes': ['error', 'single'], // 使用单引号
      'no-multiple-empty-lines': ['error', { 'max': 1 }], // 最多一个空行
      'no-return-await': 'error', // 禁止不必要的 return await
      'no-lonely-if': 'error', // 禁止 else 语句中的单独 if
      'no-multi-spaces': 'error', // 禁止多个空格

      // 空格规则
      'space-infix-ops': 'error', // 要求操作符周围有空格
      'space-unary-ops': ['error', { 'words': true, 'nonwords': false }], // 一元运算符后有空格
      'space-before-function-paren': ['error', 'never'], // 函数括号前无空格
      'space-in-parens': ['error', 'never'], // 括号内无空格
      'array-bracket-spacing': ['error', 'never'], // 数组括号内无空格
      'comma-spacing': ['error', { 'before': false, 'after': true }], // 逗号前无空格，后有空格
      'object-curly-spacing': ['error', 'always'], // 对象大括号内有空格
      'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }], // 对象键值冒号前无空格后有空格
      'arrow-spacing': 'error', // 箭头函数箭头前后有空格

      // 复杂度规则
      'max-depth': ['warn', 4], // 嵌套最大深度
      // 'max-lines-per-function': ['warn', 100], // 函数最大行数
      'max-params': ['warn', 4], // 函数参数最大数量
      'max-statements': ['error', 30, { 'ignoreTopLevelFunctions': true }], // 函数最大语句数

      // 变量和命名规则
      'no-var': 'error', // 禁止使用 var
      'prefer-const': 'error', // 优先使用 const
      'prefer-arrow-callback': 'error', // 优先使用箭头函数回调
      'camelcase': 'error', // 使用驼峰命名
      'no-underscore-dangle': 'error', // 禁止使用下划线开头或结尾的标识符

      // 最佳实践
      'eqeqeq': 'error', // 使用 === 和 !==
      'curly': 'error', // 要求所有控制语句使用大括号
      'default-case': 'error', // switch 语句需要 default
      'no-else-return': 'error', // 禁止在 else 前有 return
      // 'no-empty-function': 'error', // 禁止空函数
      'no-eval': 'error', // 禁止使用 eval
      'no-implied-eval': 'error', // 禁止隐式 eval
      'no-extend-native': 'error', // 禁止扩展原生对象
      'no-implicit-globals': 'error', // 禁止隐式全局变量
      'no-loop-func': 'error', // 禁止在循环中创建函数
      'no-new': 'error', // 禁止使用 new 调用无返回值的构造函数
    }
  },

  // Vue 文件规则
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.app.json',
        extraFileExtensions: ['.vue']
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    settings: {
      'vue': {
        'components': {
          'c-grid': 'c-grid',
          'c-table': 'c-table',
          'c-form': 'c-form',
          'c-table-action': 'c-table-action',
          'DynamicApp': 'DynamicApp',
          'c-tree': 'c-tree'
        }
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off', // 允许单个单词的组件名称
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': ['error', { 'singleline': 3, 'multiline': 1 }],
      'vue/no-empty-component-block': 'off',
      'vue/valid-template-root': 'off',
      'vue/no-unused-components': 'error',

      // TypeScript 规则
      // eslint-disable-next-line no-trailing-spaces
      '@typescript-eslint/no-unused-vars': ['error', { 'args': 'all', 'argsIgnorePattern': '^_', 'caughtErrors': 'all' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    }
  },

  // TypeScript 文件规则
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.app.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': ['error', {
        'args': 'all',
        'argsIgnorePattern': '^_',
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    }
  }
]
