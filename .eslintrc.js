module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    /* settings: {
        'import/resolver': {
            webpack: {
                config:'./webpack.config.js',
            },
        },
    },
    */
    globals: {
        $: true,

    },
    rules: {
        'no-console': 'off',
        'no-bitwise': 'off',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'no-useless-constructor': 'off',
        'no-unused-vars': 'warn',
        'class-methods-use-this': 'off',
        'no-plusplus': 'off',
        'max-classes-per-file': 'off',
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'no-underscore-dangle': 'off',
        'max-len': 'off',
        'import/no-extraneous-dependencies': 'off',
        'react/jsx-indent': [
            1,
            4,
        ],
        'react/jsx-indent-props': [
            1,
            4,
        ],
        'react/sort-comp': 'off',
        indent: [
            'error',
            4,
        ],
        quotes: [
            'error',
            'single',
        ],
        semi: [
            'error',
            'always',
        ],
    },
};
