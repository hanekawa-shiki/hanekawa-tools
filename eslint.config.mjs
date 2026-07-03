import antfu from '@antfu/eslint-config';
import tailwindcss from 'eslint-plugin-tailwindcss';

const tailwindcssRecommended = tailwindcss.configs.recommended;

/**
 * 自定义 ESLint 规则：去除 className 中多余的空白字符
 * 支持三种形式：
 *   className="p-4  bg-red"
 *   className={'p-4  bg-red'}
 *   className={`p-4  bg-red`}
 */
const classNameTrimPlugin = {
  rules: {
    /**
     * 自定义规则：去除 className 中多余的空白字符
     */
    'trim-classname-whitespace': {
      meta: {
        type: 'layout',
        fixable: 'whitespace',
        docs: {
          description: 'Collapse extra whitespace in className string values',
        },
      },
      create(context) {
        function check(node, rawString) {
          const collapsed = rawString.replace(/\s+/g, ' ').trim();
          if (rawString === collapsed) {
            return;
          }

          context.report({
            node,
            message: 'Unexpected extra whitespace in className',
            fix(fixer) {
              if (node.type === 'Literal') {
                const quote = node.raw[0];
                return fixer.replaceText(node, `${quote}${collapsed}${quote}`);
              }
              if (node.type === 'TemplateLiteral') {
                return fixer.replaceText(node, `\`${collapsed}\``);
              }
              return null;
            },
          });
        }

        return {
          JSXAttribute(node) {
            if (node.name.name !== 'className') {
              return;
            }
            const value = node.value;
            if (!value) {
              return;
            }

            // className="foo  bar"
            if (value.type === 'Literal' && typeof value.value === 'string') {
              check(value, value.value);
            }

            if (value.type === 'JSXExpressionContainer') {
              const expr = value.expression;
              // className={'foo  bar'}
              if (expr.type === 'Literal' && typeof expr.value === 'string') {
                check(expr, expr.value);
              }
              // className={`foo  bar`}
              if (expr.type === 'TemplateLiteral' && expr.expressions.length === 0) {
                check(expr, expr.quasis[0].value.raw);
              }
            }
          },
        };
      },
    },
  },
};

export default antfu({
  // 关闭 stylistic，格式化交给 Prettier 处理，避免 ESLint 和 Prettier 规则冲突
  stylistic: false,
  formatters: {
    css: 'prettier',
    html: 'prettier',
    markdown: 'prettier',
  },
  react: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  settings: {
    tailwindcss: {
      cssConfigPath: 'src/index.css',
      functions: ['clsx', 'classnames', 'cx', 'cn', 'cva'],
    },
  },
  plugins: {
    ...tailwindcssRecommended.plugins,
    custom: classNameTrimPlugin,
  },
  rules: {
    // Tailwind CSS 所有规则显式开启
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/enforces-negative-arbitrary-values': 'warn',
    'tailwindcss/enforces-shorthand': 'warn',
    'tailwindcss/no-arbitrary-value': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/no-contradicting-classname': 'error',
    'tailwindcss/no-unnecessary-arbitrary-value': 'warn',
    // 自定义规则
    'custom/trim-classname-whitespace': 'error',
    // 强制所有 if/else/for/while 使用大括号
    'antfu/curly': 'off',
    curly: ['error', 'all'],
  },
  overrides: {
    'src/router/index.tsx': {
      'react-refresh/only-export-components': 'off',
    },
  },
});
