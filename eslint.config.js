import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import markdown from 'eslint-plugin-markdown';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config(
    // 1. Global ignores
    {
        ignores: ['node_modules/', 'dist/', 'eslint.config.js', '.prettierrc.json'],
    },
    // 2. Core ESLint Recommended Rules
    pluginJs.configs.recommended,

    // 3. TypeScript Recommended Rules
    ...tseslint.configs.recommended,

    // 4. Rule Adjustments (Keep relevant ones)
    {
        rules: {
            // Allow unused vars/args prefixed with underscore
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-imports': 'error',
        },
    },

    markdown.configs.recommended,

    // 5. Prettier Compatibility
    eslintConfigPrettier,
    // Prettier plugin integration
    {
        plugins: { prettier: pluginPrettier },
        rules: { 'prettier/prettier': 'error' },
    }
);
